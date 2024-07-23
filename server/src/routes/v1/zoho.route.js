const express = require('express');
const zohoController = require('../../controllers/zoho.controller');
const auth = require('../../middlewares/auth');
const router = express.Router();

router.post('/ticket', zohoController.createTicket);
router.get('/attachment/download/:id', zohoController.downLoadAttachment);
router.get('/ticket/count-by-field', zohoController.getTicketCountByField);
router.get('/ticket/count', zohoController.getTicketCount);
router.get('/ticket/:id', zohoController.getTicket);
router.get('/tickets', zohoController.queryTickets);

module.exports = router;