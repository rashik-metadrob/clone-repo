const httpStatus = require('http-status');
const { AvatarModel } = require('../models');
const ApiError = require('../utils/ApiError');

const queryAllAvatarModels = async (filter) => {
    const data = await AvatarModel.find(filter);
    return data;
};

module.exports = {
    queryAllAvatarModels
};