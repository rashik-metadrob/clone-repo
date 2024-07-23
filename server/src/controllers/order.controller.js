const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { orderService } = require('../services');
const _ = require('lodash')

const getOrderByIntentSetcret = catchAsync(async (req, res) => {
  const order = await orderService.getOrderByIntentSetcret(req.params.intentSecret);
  res.send(order);
});

const createOrder = catchAsync(async (req, res) => {
  const user = req.user;
  const order = await orderService.createOrder({
    ...req.body,
    userId: user._id
  });
  res.status(httpStatus.CREATED).send(order);
});

const updateOrder = catchAsync(async (req, res) => {
    const order = await orderService.updateOrderById(req.params.id, req.body);
    if (!order) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
    }
    res.send(order);
});

const getOrderByPaypalPaymentId = catchAsync(async (req, res) => {
  const order = await orderService.getOrderByPaypalPaymentId(req.params.id);
  res.send(order);
});


const getGrossIncomeInfo = catchAsync(async (req, res) => {
  const grossInfo = await orderService.getGrossIncomeInfo();

  const thisMonthAmount = _.get(grossInfo, ['thisMonth', '0', 'amount'], 0)
  const lastMonthAmount = _.get(grossInfo, ['lastMonth', '0', 'amount'], 0)
  res.send({
    thisMonth: thisMonthAmount,
    lastMonth: lastMonthAmount,
    percent: lastMonthAmount * thisMonthAmount != 0  ? +((thisMonthAmount - lastMonthAmount) / lastMonthAmount * 100).toFixed(2): lastMonthAmount > thisMonthAmount ? -100 : thisMonthAmount > lastMonthAmount ? 100 : 0
  });
});

const getRetailerGrossIncomeInfo = catchAsync(async (req, res) => {
  const user = req.user
  const grossInfo = await orderService.getRetailerGrossIncomeInfo(user._id);

  const thisMonthAmount = _.get(grossInfo, ['thisMonth', '0', 'amount'], 0)
  const lastMonthAmount = _.get(grossInfo, ['lastMonth', '0', 'amount'], 0)
  res.send({
    thisMonth: thisMonthAmount,
    lastMonth: lastMonthAmount,
    percent: lastMonthAmount * thisMonthAmount != 0  ? +((thisMonthAmount - lastMonthAmount) / lastMonthAmount * 100).toFixed(2): lastMonthAmount > thisMonthAmount ? -100 : thisMonthAmount > lastMonthAmount ? 100 : 0
  });
});

const getOrdersLast7Days = catchAsync(async (req, res) => {
  const user = req.user
  const rs = await orderService.getOrdersLast7Days(user._id);

  const thisWeekAmount = _.get(rs, ['thisWeek', '0', 'amount'], 0)
  const lastWeekAmount = _.get(rs, ['lastWeek', '0', 'amount'], 0)
  res.send({
    thisWeek: thisWeekAmount,
    lastWeek: lastWeekAmount,
    percent: lastWeekAmount * thisWeekAmount != 0  ? +((thisWeekAmount - lastWeekAmount) / lastWeekAmount * 100).toFixed(2): lastWeekAmount > thisWeekAmount ? -100 : thisWeekAmount > lastWeekAmount ? 100 : 0
  });
});

const getOrders = catchAsync(async (req, res) => {
  const user = req.user
  const filter = pick(req.query, ['shipmentStatus', 'createdAt']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  // const result = await orderService.queryOrders(filter, options);
  const result = await orderService.queryOrdersByRetailerId(filter, options, user._id);
  res.send(result);
})
  
module.exports = {
  getOrderByIntentSetcret,
  updateOrder,
  createOrder,
  getOrderByPaypalPaymentId,
  getGrossIncomeInfo,
  getOrdersLast7Days,
  getOrders,
  getRetailerGrossIncomeInfo
};