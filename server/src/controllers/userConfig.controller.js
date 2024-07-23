const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { userConfigService } = require('../services');
const CONSTANTS = require("../utils/constant")

// Apply for unique config
const getConfig = catchAsync(async (req, res) => {
    let config = await userConfigService.getUserConfigByIdAndKey(req.query.userId, req.query.key)

    res.send(config);
});
// Apply for unique config
const uniqueConfig = catchAsync(async (req, res) => {
    let config = await userConfigService.getUserConfigByIdAndKey(req.body.userId, req.body.key)

    if(config){
        config = await userConfigService.updateUserConfigById(config._id.toString(), req.body.value);
    } else {
        config = await userConfigService.createUserConfig(req.body);
    }

    res.send(config);
});

// Apply for config reset in the end of month
const increaseValueOfConfig = catchAsync(async (req, res) => {
    const key = req.body.key
    let config = await userConfigService.getUserConfigByIdAndKeyInCurrentMonth(req.body.userId, key)

    if(config){
        let body = {
            userId: req.body.userId,
            key: key,
            value: {
                value: config.value.value + 1
            }
        }
        config = await userConfigService.updateUserConfigById(config._id.toString(), body.value);
    } else {
        let body = {
            userId: req.body.userId,
            key: key,
            value: {
                value: 1
            }
        }
        config = await userConfigService.createUserConfig(body);
    }

    res.send({result: true});
});

// Apply for config reset in the end of month
const userEnterRoom = catchAsync(async (req, res) => {
    let config = await userConfigService.getUserConfigByIdAndKeyInCurrentMonth(req.body.userId, CONSTANTS.USER_CONFIG_KEY.NUM_OF_USER_ENTER_IN_MONTH)

    if(config){
        if(config.value.value >= CONSTANTS.NUMBER_OF_LIMIT_USER_IN_MONTH){
            res.send({result: false});
            return;
        }

        let body = {
            userId: req.body.userId,
            key: CONSTANTS.USER_CONFIG_KEY.NUM_OF_USER_ENTER_IN_MONTH,
            value: {
                value: config.value.value + 1
            }
        }
        config = await userConfigService.updateUserConfigById(config._id.toString(), body.value);
    } else {
        let body = {
            userId: req.body.userId,
            key: CONSTANTS.USER_CONFIG_KEY.NUM_OF_USER_ENTER_IN_MONTH,
            value: {
                value: 1
            }
        }
        config = await userConfigService.createUserConfig(body);
    }

    res.send({result: true});
});

module.exports = {
  uniqueConfig,
  userEnterRoom,
  increaseValueOfConfig,
  getConfig
};