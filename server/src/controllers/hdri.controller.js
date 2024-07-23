const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { hdriService } = require('../services');
const _ = require('lodash')
const pick = require('../utils/pick');

const createHdri = catchAsync(async (req, res) => {
    const user = req.user;
    const hdri = await hdriService.createHdri({
      ...req.body,
      createdBy: user._id
    });
    res.status(httpStatus.CREATED).send(hdri);
});

const getAllHdri = catchAsync(async (req, res) => {
    const filter = {}
    if(req.query.isOnlyNonDisable) {
      filter.isDisabled = {$ne: true}
    }
    const hdris = await hdriService.getAllHdri(filter);
    res.send(hdris);
});

const getHdriById = catchAsync(async (req, res) => {
  const hdri = await hdriService.getHdriById(req.params.id);
  res.send(hdri);
});

const getHdris = catchAsync(async (req, res) => {
    let filter = pick(req.query, []);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    if(req.query.search){
        filter = {
          ...filter,
          name: {
            "$regex": new RegExp(req.query.search.toLowerCase(), "i")
          }
        }
      }
    const result = await hdriService.queryHdris(filter, options);
    res.send(result);
});

const getHdrisByAdmin = catchAsync(async (req, res) => {
  let filter = pick(req.query, []);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  if(req.query.search){
    filter = {
      ...filter,
      name: {
        "$regex": new RegExp(req.query.search.toLowerCase(), "i")
      }
    }
  }
  const result = await hdriService.queryHdris(filter, options);
  res.send(result);
});

const deleteHdri = catchAsync(async (req, res) => {
    const hdri = await hdriService.deleteHdriById(req.query.id);
    res.send(hdri);
});

const updateHdri = catchAsync(async (req, res) => {
    const hdri = await hdriService.updateHdriById(req.params.id, req.body);
    res.send(hdri);
});

module.exports = {
    createHdri,
    getAllHdri,
    getHdriById,
    getHdris,
    deleteHdri,
    updateHdri,
    getHdrisByAdmin,
};