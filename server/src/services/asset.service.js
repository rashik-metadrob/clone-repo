const { ASSET_TYPES } = require('../config/assetType');
const { Asset } = require('../models');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const projectService = require("./project.service")
const _ = require('lodash')
const path = require("path");
const fs = require("fs");
const { getFileSize } = require('../utils/storageUtils');

const createAsset = async (body) => {
    let cloneBody = _.cloneDeep(body)
    if(_.has(cloneBody, ['filePath'])){
        cloneBody.size = getFileSize(_.get(cloneBody, ['filePath']))
    }
    return Asset.create(body);
};

const getAssetById = async (id) => {
    const asset = await Asset.findById(id);
    return asset;
};

const getAllAsset = async (filter = {}) => {
    return Asset.find({...filter, $or: [{"isDeleted": {$exists: false}}, {"isDeleted": false}]})
};

const deleteAssetById = async (id, userId, shouldDeleteFile = false) => {
    const asset = await getAssetById(id);
    if (!asset) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Asset not found');
    }
    const filePath = _.get(asset, ['filePath'])
    Object.assign(asset, {isDeleted: true});
    await asset.save();

    if(shouldDeleteFile && filePath){
        const uploadFolder = path.join(process.cwd(), `public/uploads`)
        const fullPath = `${uploadFolder}/${filePath}`
        console.log('fullPath', fullPath)
        if (fs.existsSync(fullPath)){
            fs.unlinkSync(fullPath)
        }
        
    }
    
    if(_.get(asset, 'type', -1) == ASSET_TYPES.GALLERY){
        const data = await projectService.getAllProjectHaveGalleryFilePath(asset.id, userId)
        for(let i = 0; i < data.length; i++){
            const project = await projectService.getProjectById(data[i]._id);
            if (project) {
                let listProductsOfProject =  _.get(project, 'listProducts', [])
                _.each( listProductsOfProject, product => {
                    _.set(product, ['gallery'], _.get(product, 'gallery', []).filter(gal => gal.assetId !== asset.id))
                })
    
                await projectService.updateProjectById(project.id, {listProducts: _.cloneDeep(listProductsOfProject)})
            }
        }
    }

    return asset;
};

const queryAssets = async (filter, options) => {
    let filterAssets = {
        ...filter,
        isDeleted: { $ne: true }
    }
    const assets = await Asset.paginate(filterAssets, options);
    return assets;
};

const updateAssetById = async (id, updateBody) => {
    const asset = await getAssetById(id);
    if (!asset) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Asset not found');
    }
    Object.assign(asset, updateBody);
    await asset.save();
    return asset;
  };

module.exports = {
    createAsset,
    getAssetById,
    deleteAssetById,
    getAllAsset,
    queryAssets,
    updateAssetById,
}