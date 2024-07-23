const { Product, Asset } = require('../models');
const ApiError = require('../utils/ApiError');
const _ = require('lodash');
const mongoose = require('mongoose');
const { MODEL_BLOCK, IMAGE_FILE_EXTENSIONS, AUDIO_FILE_EXTENSIONS, VIDEO_FILE_EXTENSIONS } = require('../utils/constant');
const { bytesToMegabytes } = require('../utils/storageUtils');
const { PRODUCT_TYPES } = require('../config/productType');

const getUserStorageInfo = async (userId) => {
    const id = mongoose.Types.ObjectId(userId)
    const prods = await Product.aggregate([
        {
            $match: {
                createdBy: id,
                type: { $in: [PRODUCT_TYPES.PRODUCTS, PRODUCT_TYPES.ELEMENT]},
                size: {$exists: true}
            }
        },
        {
            $project: {
                block: 1,
                size: 1,
                objectUrl: 1
            }
        }
    ])

    const assets = await Asset.aggregate([
        {
            $match: {
                createdBy: id,
                size: {$exists: true}
            }
        },
        {
            $project: {
                size: 1,
                filePath: 1
            }
        }
    ])

    const prodImageTotalSize = prods.filter(el => el.block && el.block == MODEL_BLOCK['2D']).reduce((total, val) => total + _.get(val, ['size'], 0), 0)
    const prod3DTotalSize = prods.filter(el => !el.block || el.block == MODEL_BLOCK['3D']).reduce((total, val) => total + _.get(val, ['size'], 0), 0)

    const assetImageTotalSize = assets.filter(el => _.some(IMAGE_FILE_EXTENSIONS, (ext) => new RegExp(ext, "i").test(el.filePath))).reduce((total, val) => total + _.get(val, ['size'], 0), 0)
    const assetAudioTotalSize = assets.filter(el => _.some(AUDIO_FILE_EXTENSIONS, (ext) => new RegExp(ext, "i").test(el.filePath))).reduce((total, val) => total + _.get(val, ['size'], 0), 0)
    const assetVideoTotalSize = assets.filter(el => _.some(VIDEO_FILE_EXTENSIONS, (ext) => new RegExp(ext, "i").test(el.filePath))).reduce((total, val) => total + _.get(val, ['size'], 0), 0)

    return {
        threeD: bytesToMegabytes(prod3DTotalSize),
        images: bytesToMegabytes(prodImageTotalSize + assetImageTotalSize),
        audios: bytesToMegabytes(assetAudioTotalSize),
        videos: bytesToMegabytes(assetVideoTotalSize),
        total: bytesToMegabytes(prod3DTotalSize) + bytesToMegabytes(prodImageTotalSize + assetImageTotalSize) + bytesToMegabytes(assetAudioTotalSize) + bytesToMegabytes(assetVideoTotalSize)
    }
};

module.exports = {
    getUserStorageInfo
}