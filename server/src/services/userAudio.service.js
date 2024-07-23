const httpStatus = require('http-status');
const { UserAudio } = require('../models');
const ApiError = require('../utils/ApiError');
const _ = require('lodash');
const { DATA_HELPER } = require('../utils/hepler');
const mongoose = require('mongoose');

const createUserAudio = async (body) => {
  return UserAudio.create(body);
};

const getAudiosByUserId = async (userId) => {
  const audios = await UserAudio.find({userId}).populate({path: "asset"});

  let data = []
  audios.forEach(el => {
    data.push(el.toObject())
  })
  data = _.map(data, (el) => {
    el.name = _.get(el, ['asset', 'name'])
    el.filePath = _.get(el, ['asset', 'filePath'])
    el.id = el._id
    delete el.asset
    delete el._id
    return el
  })

  return data
};

const deleteUserAudioById = async (id) => {
    const audio = await UserAudio.findById(id);
    if (!audio) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Audio not found');
    }

    await audio.remove()

    return audio
}

module.exports = {
    createUserAudio,
    getAudiosByUserId,
    deleteUserAudioById
};