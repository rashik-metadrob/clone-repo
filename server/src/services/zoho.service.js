
const fetch = require("node-fetch");
const axios = require("axios");
const ApiError = require("../utils/ApiError");
const httpStatus = require('http-status');
const _ = require('lodash')
const configService = require('./config.service');
const { CONFIG_TYPE } = require("../utils/constant");
const logger = require("../config/logger");
const moment = require('moment')
const config = require('../config/config')
const path = require("path");
const FormData = require("form-data");
const fs = require("fs")

const ZohoDesk_sClientId = config.zohoDeskClientId
const ZohoDesk_sClientSecret = config.zohoDeskClientSecret
const ZohoDesk_sDeptId = config.zohoDeskDepartmentId
const ZohoDesk_sCode = config.zohoDeskGrantCode
const ZohoDesk_lTicketStatusList = ['Open','On Hold','Escalated','Closed']

let refreshConfig = {
    client_id: ZohoDesk_sClientId, // The client ID obtained from Zoho
    client_secret: ZohoDesk_sClientSecret, // The client secret obtained from Zoho
    grant_type: 'refresh_token',
    scope: "Desk.tickets.READ,Desk.tickets.ALL,Desk.basic.CREATE,Desk.tickets.UPDATE,Desk.search.READ",
}

let authConfig = {
    client_id: ZohoDesk_sClientId, // The client ID obtained from Zoho
    code: ZohoDesk_sCode, // The grant token
    client_secret: ZohoDesk_sClientSecret, // The client secret obtained from Zoho
    grant_type: 'authorization_code',
}

const outputBaseFolder = path.join(process.cwd(), 'public/uploads')
// Method to refresh the access token
const refreshToken = async () => {
    try {
        const refreshToken = await getZohoRefreshToken()
        if(!refreshToken) {
            // Make a POST request to Zoho token endpoint to refresh the access token
            const { data } = await axios.post(
                'https://accounts.zoho.com/oauth/v2/token',
                {},
                {
                    params: authConfig,
                }
            )
            console.log(data)
            // Update the access token property with the new access token

            if(data.error) {
                console.log('INIT_CREATE_CONFIG_ERR CREATE TOKEN', moment().toISOString(), data)
                await configService.deleteConfigByType(CONFIG_TYPE.ZOHO_DESK_REFRESH_TOKEN)
                await configService.deleteConfigByType(CONFIG_TYPE.ZOHO_DESK_ACCESS_TOKEN)
                return false
            }

            if(data.refresh_token) {
                await configService.createOrUpdateUniqueConfig(CONFIG_TYPE.ZOHO_DESK_REFRESH_TOKEN, data.refresh_token)
                await configService.createOrUpdateUniqueConfig(CONFIG_TYPE.ZOHO_DESK_ACCESS_TOKEN, data.access_token)
            }
            return true
        } else {
            const { data } = await axios.post(
                'https://accounts.zoho.com/oauth/v2/token',
                {},
                {
                    params: {...refreshConfig, refresh_token: refreshToken},
                }
            )
            if(data.error) {
                console.log('INIT_CREATE_CONFIG_ERR GET TOKEN', moment().toISOString(), data, {...refreshConfig, refresh_token: refreshToken})
                await configService.deleteConfigByType(CONFIG_TYPE.ZOHO_DESK_REFRESH_TOKEN)
                await configService.deleteConfigByType(CONFIG_TYPE.ZOHO_DESK_ACCESS_TOKEN)
                return false
            }
            // Update the access token property with the new access token
            await configService.createOrUpdateUniqueConfig(CONFIG_TYPE.ZOHO_DESK_ACCESS_TOKEN, data.access_token)
            return true
        }
    } catch (e) {
        console.log('INIT_CREATE_CONFIG_ERR', moment().toISOString(),  _.get(e, ['response', 'data', 'message']))
        // Capture the exception using Sentry
        await configService.deleteConfigByType(CONFIG_TYPE.ZOHO_DESK_REFRESH_TOKEN)
        await configService.deleteConfigByType(CONFIG_TYPE.ZOHO_DESK_ACCESS_TOKEN)
        return false
    }
}

const getZohoRefreshToken = async () => {
    const refreshTokenConfig  = await configService.getConfigByType(CONFIG_TYPE.ZOHO_DESK_REFRESH_TOKEN)
    const refreshToken = _.get(refreshTokenConfig, ['content', 'value'], "")

    return refreshToken
}

const getZohoAccessToken = async () => {
    let accessTokenConfig  = await configService.getConfigByType(CONFIG_TYPE.ZOHO_DESK_ACCESS_TOKEN)
    let accessToken = _.get(accessTokenConfig, ['content', 'value'], "")

    if(accessToken) {
        return `Zoho-oauthtoken ${accessToken}`
    }

    if (accessToken.length === 0) await refreshToken()

    accessTokenConfig  = await configService.getConfigByType(CONFIG_TYPE.ZOHO_DESK_ACCESS_TOKEN)
    accessToken = _.get(accessTokenConfig, ['content', 'value'], "")

    if(accessToken) {
        return `Zoho-oauthtoken ${accessToken}`
    }

    return ""
}

// // Define interface for Zoho message content
// interface ZohoMessage {
//     email: string
//     subject: string
//     message: string
//     firstName: string
//     lastName: string
// }
// Method to create a ticket in Zoho Desk
const createTicket = async (body) => {
    const {
        subject,
        message,
        lastName,
        email
    } = body

    const attachments = _.get(body, ['attachments'], [])
    try {
        const accessToken = await getZohoAccessToken()
        // Make a POST request to Zoho Desk API endpoint to create a ticket
        const {data} = await axios.post(
                'https://desk.zoho.com/api/v1/tickets',
                {
                    subject: subject,
                    description: message,
                    contact: {
                        lastName: lastName,
                        email: email,
                    },
                    email,
                    departmentId :  ZohoDesk_sDeptId,
                },
                {
                headers: {
                    Authorization: accessToken,
                },
            }
        )
        
        if(data.id) {
            if(attachments.length > 0){
                for(let i = 0; i < attachments.length; i++){
                    await uploadTicketAttachment(attachments[i], data.id)
                }
            }
        }
    } catch (e) {
        // Check if the error is due to authentication failure
        if (e?.response?.status === 401) {
            // Refresh the access token
            const isTokenRetrieved = await refreshToken()

            // Retry creating the ticket if the access token is successfully refreshed
            if (isTokenRetrieved) {
                return await createTicket(body)
            }
        } else {
            console.log('ZOHO CREATE TICKET ERR', _.get(e, ['response', 'data']))
            throw new ApiError(httpStatus.BAD_REQUEST, _.get(e, ['response', 'data', 'message'], "Can't create Ticket."))
        }
    }
}

const uploadTicketAttachment = async (attachment, ticketId) => {
    const accessToken = await getZohoAccessToken()
    const { relativePath } = attachment

    if(!relativePath) {
        return null
    }

    try {
        const filePath = path.join(outputBaseFolder, relativePath)

        if (!fs.existsSync(filePath)) {
            return null
        }

        const readStream = fs.createReadStream(filePath);

        const form = new FormData();
        form.append("file", readStream);

        const {data} = await axios({
            method: 'POST',
            url: `https://desk.zoho.com/api/v1/tickets/${ticketId}/attachments?isPublic=true`,
            data: form,
            headers: { 
                "Content-Type": "multipart/form-data",
                Authorization: accessToken,
            },
        })
        fs.unlinkSync(filePath)
        return data

    } catch (err) {
        if (err?.response?.status === 401) {
            // Refresh the access token
            const isTokenRetrieved = await refreshToken()

            // Retry creating the ticket if the access token is successfully refreshed
            if (isTokenRetrieved) {
                return await uploadTicketAttachment(attachment, ticketId)
            }
        } else {
            console.log("UPLOAD ATTACHMENT ERR", _.get(err, ['response', 'data']))
            return null
        }
    }
}

const getTickets = async (filter) => {
    const accessToken = await getZohoAccessToken()

    try {
        const response =  await axios.get(
            'https://desk.zoho.com/api/v1/tickets/search',
            {
                params: {
                    ...filter
                },
                headers: {
                    Authorization: accessToken,
                },
            }
        )

        return response.data

    } catch (err) {
        if (err?.response?.status === 401) {
            // Refresh the access token
            const isTokenRetrieved = await refreshToken()

            // Retry creating the ticket if the access token is successfully refreshed
            if (isTokenRetrieved) {
                return await getTickets(filter)
            }
        } else {
            throw new ApiError(httpStatus.BAD_REQUEST, _.get(err, ['response', 'data', 'message'], "Can't get Ticket."))
        }
    }
}

const getTicketCountByField = async () => {
    const accessToken = await getZohoAccessToken()

    try {
        const {data} =  await axios.get(
            'https://desk.zoho.com/api/v1/ticketsCountByFieldValues',
            {
                params: {
                    field: "statusType,status,priority,channel,spam,overDue,escalated"
                },
                headers: {
                    Authorization: accessToken,
                },
            }
        )
        return data

    } catch (err) {
        if (err?.response?.status === 401) {
            // Refresh the access token
            const isTokenRetrieved = await refreshToken()

            // Retry creating the ticket if the access token is successfully refreshed
            if (isTokenRetrieved) {
                return await getTicketCountByField()
            }
        } else {
            throw new ApiError(httpStatus.BAD_REQUEST, _.get(err, ['response', 'data', 'message'], "Can't get Ticket count."))
        }
    }
}

const getTicketCount = async (filter = {}) => {
    const accessToken = await getZohoAccessToken()

    try {
        const {data} =  await axios.get(
            'https://desk.zoho.com/api/v1/ticketsCount',
            {
                params: {
                    ...filter
                },
                headers: {
                    Authorization: accessToken,
                },
            }
        )
        return data

    } catch (err) {
        if (err?.response?.status === 401) {
            // Refresh the access token
            const isTokenRetrieved = await refreshToken()

            // Retry creating the ticket if the access token is successfully refreshed
            if (isTokenRetrieved) {
                return await getTicketCount(filter)
            }
        } else {
            throw new ApiError(httpStatus.BAD_REQUEST, _.get(err, ['response', 'data', 'message'], "Can't get Ticket count."))
        }
    }
}

const getTicket = async (id) => {
    const accessToken = await getZohoAccessToken()
    try {
        const { data } =  await axios.get(
            `https://desk.zoho.com/api/v1/tickets/${id}`,
            {
                params: {
                    include: 'contacts,products,departments,team,assignee,isRead,skills,team'
                },
                headers: {
                    Authorization: accessToken,
                },
            }
        )

        if(_.get(data, ['attachmentCount'], 0) > 0) {
            const { data: attachments } =  await axios.get(
                `https://desk.zoho.com/api/v1/tickets/${id}/attachments`,
                {
                    headers: {
                        Authorization: accessToken,
                    },
                }
            )

            if(attachments){
                data.attachments = _.get(attachments, ['data'], [])
            }
        }
    
        return data
    } catch (err) {
        if (err?.response?.status === 401) {
            // Refresh the access token
            const isTokenRetrieved = await refreshToken()

            // Retry creating the ticket if the access token is successfully refreshed
            if (isTokenRetrieved) {
                return await getTicket(id)
            }
        } else {
            console.log("GET TICKET ERR", `https://desk.zoho.com/api/v1/tickets/${id}`, _.get(err, ['message']))
            throw new ApiError(httpStatus.BAD_REQUEST, _.get(err, ['response', 'data', 'message'], "Can't get Ticket."))
        }
    }
    
}

const downLoadAttachment = async (id, ticketId) => {
    const accessToken = await getZohoAccessToken()
    try {
        const response =  await axios.get(
            `https://desk.zoho.com/api/v1/tickets/${ticketId}/attachments/${id}/content`,
            {
                headers: {
                    Authorization: accessToken
                },
                responseType: 'arraybuffer'
            }
        )
        return response
    } catch (err) {
        if (err?.response?.status === 401) {
            // Refresh the access token
            const isTokenRetrieved = await refreshToken()

            // Retry creating the ticket if the access token is successfully refreshed
            if (isTokenRetrieved) {
                return await downLoadAttachment(id, ticketId)
            }
        } else {
            console.log("GET ATTACHMENT ERR", _.get(err, ['message']))
            throw new ApiError(httpStatus.BAD_REQUEST, _.get(err, ['response', 'data', 'message'], "Can't get Attachment."))
        }
    }
}

module.exports = {
    createTicket,
    refreshToken,
    getTickets,
    getTicket,
    downLoadAttachment,
    getTicketCount,
    getTicketCountByField
}