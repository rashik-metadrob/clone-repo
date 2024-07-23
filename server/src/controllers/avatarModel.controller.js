const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');
const { avatarModelService } = require('../services');
const CONSTANTS = require('../utils/constant');

const queryAllAvatarModels = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['roleFor'])
    const models = await avatarModelService.queryAllAvatarModels(filter);
    res.send(models);
});

module.exports = {
    queryAllAvatarModels
};