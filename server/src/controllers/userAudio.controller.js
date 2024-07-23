const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { userAudioService } = require('../services');
const CONSTANTS = require("../utils/constant")

const getUserAudiosByUserId = catchAsync(async (req, res) => {
    const user = req.user
    let audios = await userAudioService.getAudiosByUserId(user._id)

    res.send(audios);
});

const deleteUserAudioById = catchAsync(async (req, res) => {
    let audio = await userAudioService.deleteUserAudioById(req.params.id)

    res.send(audio);
});

const createUserAudio = catchAsync(async (req, res) => {
    const user = req.user
    const { asset } = req.body
    let audio = await userAudioService.createUserAudio({
        userId: user._id,
        asset,
    })

    res.send(audio);
});

module.exports = {
    getUserAudiosByUserId,
    deleteUserAudioById,
    createUserAudio
}