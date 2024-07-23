import axios from './base.api';

const createTicket = (data) => {
    return axios.post(`/zoho/ticket`, data).then(rs => {
        return rs.data
    })
}

const getTickets = (params) => {
    return axios.get(`/zoho/tickets`, {params}).then(rs => {
        return rs.data
    })
}

const getTicketById = (id) => {
    return axios.get(`/zoho/ticket/${id}`).then(rs => {
        return rs.data
    })
}

const getTicketCount = (params = {}) => {
    return axios.get(`/zoho/ticket/count`, {params}).then(rs => {
        return rs.data
    })
}

const getTicketCountByField = (params = {}) => {
    return axios.get(`/zoho/ticket/count-by-field`, {params}).then(rs => {
        return rs.data
    })
}

const downLoadAttachment = (id, ticketId) => {
    return axios.get(
        `/zoho/attachment/download/${id}?ticketId=${ticketId}`,
        {
            responseType: 'blob'
        }
    ).then(rs => {
        return rs.data
    })
}

const zohoApi = {
    getTickets,
    getTicketById,
    downLoadAttachment,
    getTicketCount,
    getTicketCountByField,
    createTicket
}

export default zohoApi