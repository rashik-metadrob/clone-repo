const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { assetService } = require('../services');
const _ = require('lodash')
const pick = require('../utils/pick');
const mongoose = require('mongoose');

const createAsset = catchAsync(async (req, res) => {
    const user = req.user;
    const asset = await assetService.createAsset({
      ...req.body,
      createdBy: user._id
    });
    res.status(httpStatus.CREATED).send(asset);
});

const getAllAsset = catchAsync(async (req, res) => {
    const user = req.user;
    let filter = _.pick(req.query, ['type'])
    if(user._id){
        filter = {
            ...filter,
            createdBy: user._id
        }
    }
    const assets = await assetService.getAllAsset(filter);
    res.send(assets);
});

const getAssetById = catchAsync(async (req, res) => {
    const asset = await assetService.getAssetById(req.params.id);
    res.send(asset);
});

const getAssets = catchAsync(async (req, res) => {
    const user = req.user;
    let filter = pick(req.query, ['type', 'filterExts']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    if(!options.sortBy){
        options.sortBy = "createdAt:desc"
    }
    if(filter.filterExts){
        filter['$or'] = []
        try {
            filter.filterExts.split(',').forEach(ext => {
                filter['$or'].push({
                    filePath: {
                        "$regex": new RegExp(ext.toLowerCase(), "i")
                    }
                }) 
            })
        }
        catch (err) {

        }

        delete filter.filterExts
    }

    if(req.query.search){
        filter.name = {
            "$regex": new RegExp(req.query.search.toLowerCase(), "i")
        }
    }

    if(user._id){
        filter = {
            ...filter,
            createdBy: user._id
        }
    }
    if(req.query.isOnlyNonDisable) {
        filter.isDisabled = {$ne: true}
    }
    const result = await assetService.queryAssets(filter, options);
    res.send(result);
});

const getPublicAssets = catchAsync(async (req, res) => {
    let filter = pick(req.query, ['type']);
    let conditions = [];
    if(_.has(req.query, ['attribute_isShowTutorialVideo'])){
        if(_.get(req.query, ['attribute_isShowTutorialVideo'], 0) == 1){
            conditions.push({
                $and: [{"attribute.isShowTutorialVideo": {$exists: true}}, {"attribute.isShowTutorialVideo": {$eq: true}}]
            })
        } else {
            conditions.push({
                $or: [{"attribute.isShowTutorialVideo": {$exists: false}}, {"attribute.isShowTutorialVideo": {$eq: false}}]
            })
        }
    }
    if(_.has(req.query, ['attribute_isFeatureTutorialVideo'])){
        if(_.get(req.query, ['attribute_isFeatureTutorialVideo'], 0) == 1){
            conditions.push({
                $and: [{"attribute.isFeatureTutorialVideo": {$exists: true}}, {"attribute.isFeatureTutorialVideo": {$eq: true}}]
            })
        } else {
            conditions.push({
                $or: [{"attribute.isFeatureTutorialVideo": {$exists: false}}, {"attribute.isFeatureTutorialVideo": {$eq: false}}]
            })
        }
    }
    if(conditions.length > 0){
        filter['$and'] = conditions
    }
    
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await assetService.queryAssets(filter, options);
    res.send(result);
});

const deleteAsset = catchAsync(async (req, res) => {
    const user = req.user
    const { shouldDeleteFile } = req.query
    const asset = await assetService.deleteAssetById(req.query.id, user._id, shouldDeleteFile == 1);
    res.send(asset);
});

const updateAsset = catchAsync(async (req, res) => {
    const asset = await assetService.updateAssetById(req.params.id, req.body);
    res.send(asset);
});

module.exports = {
    createAsset,
    getAllAsset,
    getAssetById,
    getAssets,
    deleteAsset,
    updateAsset,
    getPublicAssets,
};