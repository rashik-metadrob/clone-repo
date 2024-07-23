const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { emailService, zohoService } = require('../services');
const _ = require('lodash')

const receiverEmail1 = "info@metadrob.com"
const receiverEmail2 = "adhyan@metadrob.com"
const receiverEmail3 = "navin@metadrob.com"

const sendFeedBack = catchAsync(async (req, res) => {
  await emailService.sendFeedBack(req.body.from, receiverEmail1, req.body.content, _.get(req.body, ['attachments'], []));
  await emailService.sendFeedBack(req.body.from, receiverEmail2, req.body.content, _.get(req.body, ['attachments'], []));
  await emailService.sendFeedBack(req.body.from, receiverEmail3, req.body.content, _.get(req.body, ['attachments'], []));
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  sendFeedBack
};