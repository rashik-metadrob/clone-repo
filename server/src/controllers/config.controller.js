const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { configService } = require('../services');

const getConfigByType = catchAsync(async (req, res) => {
  const config = await configService.getConfigByType(req.query.type)
  res.send(config);
});

const getSettings = catchAsync(async (req, res) => {
  const config = await configService.getSettings()
  res.send(config);
});

const uniqueConfig = catchAsync(async (req, res) => {
  let config = await configService.getConfigByType(req.body.type)

  if(config){
    config = await configService.updateConfigById(config._id.toString(), req.body);
  } else {
    config = await configService.createConfig(req.body);
  }

  res.send(config);
});

module.exports = {
  getConfigByType,
  uniqueConfig,
  getSettings
};