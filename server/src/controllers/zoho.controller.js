const { zohoService } = require('../services');
const catchAsync = require('../utils/catchAsync');
const _ = require("lodash")
const pick = require('../utils/pick');

const createTicket = catchAsync(async (req, res) => {
    const ticket = await zohoService.createTicket({
        "subject": req.body.content,
        "message": req.body.content,
        "lastName": req.body.userName || 'Undefined user',
        "email": req.body.email || "undefined_user@gmail.com",
        attachments: _.get(req.body, ['attachments'], [])
    })

    res.send(ticket)
});

const queryTickets = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['status', 'limit', 'from', 'email'])
    if(!filter.limit){
        filter.limit = 100
    }
    if(!filter.from){
        filter.from = 0
    }
    
    const tickets = await zohoService.getTickets(filter)

    res.send(tickets)
});


const getTicketCount = catchAsync(async (req, res) => {
    const data = await zohoService.getTicketCount()

    res.send(data)
});

const getTicketCountByField = catchAsync(async (req, res) => {
    const data = await zohoService.getTicketCountByField()

    res.send(data)
});

const getTicket = catchAsync(async (req, res) => {
    const ticket = await zohoService.getTicket(req.params.id)

    res.send(ticket)
});

const downLoadAttachment = catchAsync(async (req, res) => {
    const response = await zohoService.downLoadAttachment(req.params.id, req.query.ticketId)

    const contentType = response.headers.get("content-type")
    const contentDisposition = response.headers.get("Content-Disposition")
    const contentTypeOption = response.headers.get("X-Content-Type-Options")
    const contentLength =  response.data.length //response.headers.get("Content-Length")

    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", contentDisposition);
    res.setHeader("X-Content-Type-Options", contentTypeOption);
    res.status(200).send(Buffer.from(response.data, 'binary'));
});

module.exports = {
    createTicket,
    queryTickets,
    getTicket,
    downLoadAttachment,
    getTicketCount,
    getTicketCountByField
}