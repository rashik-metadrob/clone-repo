const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { textService } = require('../services');
const _ = require('lodash')

const createText = catchAsync(async (req, res) => {
  const user = req.user;
  const text = await textService.createText({
    ...req.body,
    createdBy: user._id
  });
  res.status(httpStatus.CREATED).send(text);
});

const getPublicTexts = catchAsync(async (req, res) => {
  const filter = pick(req.query, []);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  filter.isDisabled = {$ne: true}

  const result = await textService.queryPublicTexts(filter, options);
  res.send(result);
});

const getTexts = catchAsync(async (req, res) => {
  const user = req.user;
  const filter = pick(req.query, []);
  // filter.createdBy = user._id
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  if(!options.sortBy){
    options.sortBy = 'createdAt:desc'
  }
  const result = await textService.queryTexts(filter, options);
  res.send(result);
});

const deleteText = catchAsync(async (req, res) => {
  const hdri = await textService.deleteTextById(req.query.id);
  res.send(hdri);
});

const updateText = catchAsync(async (req, res) => {
  const hdri = await textService.updateTextById(req.params.id, req.body);
  res.send(hdri);
});

module.exports = {
    createText,
    getTexts,
    deleteText,
    updateText,
    getPublicTexts
};