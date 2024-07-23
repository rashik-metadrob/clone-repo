const httpStatus = require('http-status');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { placeholderService } = require('../services');
const _ = require('lodash')

const createPlaceholder = catchAsync(async (req, res) => {
  const user = req.user;
  const placeholder = await placeholderService.createPlaceholder({
    ...req.body,
    createdBy: user._id
  });
  res.status(httpStatus.CREATED).send(placeholder);
});

const getPublicPlaceholders = catchAsync(async (req, res) => {
  const filter = pick(req.query, []);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await placeholderService.queryPublicPlaceholders(filter, options);
  res.send(result);
});

const getPlaceholders = catchAsync(async (req, res) => {
  const user = req.user;
  const filter = pick(req.query, []);
  filter.createdBy = user._id
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  if(!options.sortBy){
    options.sortBy = 'createdAt:desc'
  }
  const result = await placeholderService.queryPlaceholders(filter, options);
  res.send(result);
});

const deletePlaceholder = catchAsync(async (req, res) => {
  const hdri = await placeholderService.deletePlaceholderById(req.query.id);
  res.send(hdri);
});

const updatePlaceholder = catchAsync(async (req, res) => {
  const hdri = await placeholderService.updatePlaceholderById(req.params.id, req.body);
  res.send(hdri);
});

module.exports = {
    createPlaceholder,
    getPlaceholders,
    deletePlaceholder,
    updatePlaceholder,
    getPublicPlaceholders
};