const { Project, Product } = require('../models');
const _ = require('lodash')
const { PROJECT_TYPE } = require('../utils/constant');
const mongoose = require('mongoose');
const { getFileSize } = require('../utils/storageUtils');

const updateTemplateStatusAfterCompress = async (templatePath) => {
    const projects = await Project.find({
        template: templatePath,
        type: PROJECT_TYPE.TEMPLATE
    })

    const allStoreIds = _.map(projects, (el) => {return mongoose.Types.ObjectId(_.get(el, ['_id']))})
    const newFileSize = getFileSize(templatePath)
    Project.updateMany({'_id': {'$in': allStoreIds}}, {isCompressing: false, size: newFileSize}, null, (err, res) => {})
}

const updateProdAndDecorStatusAfterCompress = async (objectUrl) => {
    const products = await Product.find({
        objectUrl: objectUrl
    })

    const allProdIds = _.map(products, (el) => {return mongoose.Types.ObjectId(_.get(el, ['_id']))})
    const newFileSize = getFileSize(objectUrl)
    Product.updateMany({'_id': {'$in': allProdIds}}, {isCompressing: false, size: newFileSize}, null, (err, res) => {})
}

module.exports = {
    updateTemplateStatusAfterCompress,
    updateProdAndDecorStatusAfterCompress
}