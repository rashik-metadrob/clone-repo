const { Project, Product } = require('../models');
const ApiError = require('../utils/ApiError');
const _ = require('lodash')
const userConfigService = require("./userConfig.service");
const { PROJECT_MODE, USER_CONFIG_KEY, RENDERER_CONFIG, CURRENCY, PROJECT_TYPE, COMPRESS_DATA_TYPE, STORE_THEME_TYPES } = require('../utils/constant');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const moment = require("moment");
const { CART_TYPES } = require('../config/productCartType');
const { getFileSize } = require('../utils/storageUtils');
const { createCompressRequest } = require('../utils/compressUtils');

/**
 * Create a project
 * @param {Object} projectBody
 * @returns {Promise<Project>}
 */
const createProject = async (projectBody) => {
    let cloneBody = _.cloneDeep(projectBody)
    if(_.has(cloneBody, ['updateLogs'])){
        delete cloneBody.updateLogs
    }

    let shouldCompressing = false
    if(cloneBody.type == PROJECT_TYPE.TEMPLATE && !cloneBody.shouldNotCompress){
        shouldCompressing = true
    }

    const newProject = await Project.create({
        ...cloneBody,
        isCompressing: shouldCompressing,
    })

    if(newProject.type == PROJECT_TYPE.TEMPLATE && _.get(newProject, ['template'])){
        await updateProjectById(newProject.id, { size: getFileSize(_.get(newProject, ['template'])) })
    }

    if(newProject.type == PROJECT_TYPE.TEMPLATE && shouldCompressing && _.get(newProject, ['template'])) {
        createCompressRequest(_.get(newProject, ['template']), COMPRESS_DATA_TYPE.PROJECT)
    }

    return newProject;
};

/**
 * Get project by id
 * @param {ObjectId} id
 * @returns {Promise<Project>}
 */
const getProjectById = async (id) => {
    const project = await Project.findById(id);
    if(project && project.toObject().templateId){
        const template = await Project.findById(project.toObject().templateId);
        if(template){
            project.template = template.template;
            project.materials = template.materials;
            project.hdr = template.hdr;
            project.isAttachHdriToBackground = template.isAttachHdriToBackground
            project.templateToneMappingExposure = _.get(template, 'templateToneMappingExposure', RENDERER_CONFIG.TONE_MAPPING_EXPOSURE)
        }
    }
    return project;
};

/**
 * Get project by id
 * @param {ObjectId} id
 * @returns {Promise<Project>}
 */
const queryProjectById = async (id, isPublishMode) => {
    const project = await Project.findById(id).populate('templateId').populate('listProducts.objectId')
        .populate({
            path: 'cameras.assetId', 
            select: 'id name filePath',
            justOne: true
        })
        .populate({
            path: 'publishStoreData.listProducts.objectId',
            justOne: true
        })
    // Now: templateId is Project object
    let storeData = null
    if(project){
        storeData = project.toObject()
        storeData.id = storeData._id
        delete storeData._id

        if(storeData.templateId) {
            storeData.template = storeData.templateId.template;
            storeData.materials = storeData.templateId.materials;
            storeData.hdr = storeData.templateId.hdr;
            storeData.templateAvailableAnimation = storeData.templateId.templateAvailableAnimation;
            storeData.isAttachHdriToBackground = storeData.templateId.isAttachHdriToBackground
            storeData.templateToneMappingExposure = _.get(storeData.templateId, 'templateToneMappingExposure', RENDERER_CONFIG.TONE_MAPPING_EXPOSURE)
        }
        delete storeData.templateId

        if(!storeData.listProducts){
            storeData.listProducts = []
        }

        let productData = storeData.listProducts

        if(isPublishMode) {
            productData = _.get(storeData, ['publishStoreData', 'listProducts'], [])
            storeData.listTexts = _.get(storeData, ['publishStoreData', 'listTexts'], [])
            storeData.treeData = _.get(storeData, ['publishStoreData', 'treeData'], [])
            storeData.background = _.get(storeData, ['publishStoreData', 'background'], "")
            storeData.brandLogo = _.get(storeData, ['publishStoreData', 'brandLogo'], "")
            storeData.storeThemeType = _.get(storeData, ['publishStoreData', 'storeThemeType'], STORE_THEME_TYPES.TYPE_1)
            storeData.storeNameStyle = _.get(storeData, ['publishStoreData', 'storeNameStyle'], null)
            storeData.elementMaterials = _.get(storeData, ['publishStoreData', 'elementMaterials'], {})
            storeData.name = _.get(storeData, ['publishStoreData', 'name'], '')
            storeData.description = _.get(storeData, ['publishStoreData', 'description'], {})
        }

        storeData.listProducts = productData.filter(el => el && el.objectId && !_.get(el.objectId, ['isDeleted'], false))
        storeData.listProducts = productData.map(el => {
            el.price = _.get(el.objectId, 'price', 0)
            el.lastPrice = _.get(el.objectId, 'price', 0) - _.get(el.objectId, 'price', 0) * (_.get(el.objectId, 'discount', 0) / 100)
            el.discount = _.get(el.objectId, 'discount', 0)
            el.displayCurrency = _.get(el.objectId, 'displayCurrency', CURRENCY.USD)
            el.cartType = _.get(el.objectId, 'cartType', CART_TYPES.METADROB_CART)
            el.webLink = _.get(el.objectId, 'webLink', "")
            el.useThirdPartyCheckout = _.get(el.objectId, 'useThirdPartyCheckout', false)
            el.specification = _.get(el.objectId, 'specification', false)

            el.objectId = _.get(el.objectId, ['_id'], null)

            return el
        })


        storeData.cameras = _.map(storeData.cameras, (el) => {
            if(_.has(el, ['assetId', 'filePath'])){
                el.thumnail = _.get(el, ['assetId', 'filePath'])
                el.assetId = _.get(el, ['assetId', '_id'])
            }

            return el
        })

        delete storeData.publishStoreData
    }
    return storeData;
};

/**
 * Query for projects
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryProjects = async (filter, options) => {
    let conditions = [];
    // filter['$and'] : Array
    if(filter['$and'] && typeof filter['$and'] === "object"){
        conditions = [...filter['$and']]
    }
    let filterPro = {
        ...filter,
        $and: [
            {$or: [{"isDeleted": {$exists: false}}, {"isDeleted": false}]},
            ...conditions
        ]
    }

    const projects = await Project.paginate(filterPro, options);

    await Project.populate(projects.results, {path: 'plans', select: 'id name isFree'})

    return projects;
};

const queryProjectsByAdmin = async (filter, options) => {
    let conditions = [];
    // filter['$and'] : Array
    if(filter['$and'] && typeof filter['$and'] === "object"){
        conditions = [...filter['$and']]
    }
    let filterPro = {
        ...filter,
        $and: [
            {$or: [{"isDeleted": {$exists: false}}, {"isDeleted": false}]},
            ...conditions
        ]
    }

    const isShopifyStore = filterPro.isShopifyStore == 1
    delete filterPro.isShopifyStore

    const limit = options.limit && parseInt(options.limit, 10) > 0 ? parseInt(options.limit, 10) : 10;
    const page = options.page && parseInt(options.page, 10) > 0 ? parseInt(options.page, 10) : 1;
    const skip = (page - 1) * limit;
    let sort = '';
    if (options.sortBy) {
        const sortingCriteria = [];
        options.sortBy.split(',').forEach((sortOption) => {
        const [key, order] = sortOption.split(':');
        sortingCriteria.push((order === 'desc' ? '-' : '') + key);
        });
        sort = sortingCriteria.join(' ');
    } else {
        sort = 'createdAt';
    }

    const aggregateExps = [
        {
            $match: filterPro
        },
        {
            $lookup: {
                from: 'users',
                localField: 'createdBy',
                foreignField: '_id',
                as: 'users',
                pipeline: [
                    {
                        $project: {
                            id: "$_id",
                            name: "$name",
                            shopifyShop: 1,
                            shopifyShopEmail: 1,
                        }
                    },
                    { $limit : 1 }
                ]
            }
        },
        {
            $set: {
                createdBy: { $arrayElemAt: [ "$users", 0 ] },
                id: "$_id"
            }
        },
        {
            $unset: ['users', 'publishStoreData', 'listProducts', 'listTexts', 'treeData', 'updateLogs']
        }
    ]

    if(isShopifyStore) {
        aggregateExps.push({
            $match: {
                $and: [
                    {
                        'createdBy.shopifyShop':  {$exists: true}
                    },
                    {
                        'createdBy.shopifyShop':  {$ne: ""}
                    }
                ]
            }
        })
    }

    let resultTotals = await Project.aggregate(aggregateExps)
    let results = await Project.aggregate(aggregateExps).sort(sort).skip(skip).limit(limit)

    const totalResults = resultTotals.length;
    const totalPages = Math.ceil(totalResults / limit)
    return {
        results,
        limit,
        page,
        totalPages,
        totalResults
    };
};

/**
 * Update project by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateProjectById = async (id, updateBody) => {
    const project = await getProjectById(id);
    if (!project) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Store not found');
    }
    let body = _.cloneDeep(updateBody)
    if(body.updateLogs) {
        delete body.updateLogs
    }
    if(project.mode == PROJECT_MODE.PUBLISH && _.get(body, 'mode', '') !== PROJECT_MODE.PUBLISH){
        await userConfigService.decreaseValueOfConfig(project.createdBy, USER_CONFIG_KEY.NUM_OF_PUBLISH_STORE_IN_MONTH)
    }

    if(project.type == PROJECT_TYPE.TEMPLATE && _.get(body, ['template']) && _.get(body, ['template']) != _.get(project, ['template'])) {
        body.isCompressing = true
        createCompressRequest(_.get(body, ['template']), COMPRESS_DATA_TYPE.PROJECT)
    }

    if(project.type == PROJECT_TYPE.TEMPLATE && _.get(body, ['template'])){
        body.size = getFileSize(_.get(body, ['template']))
    }
    
    Object.assign(project, body);

    const shouldSaveLog = _.get(body, ['shouldSaveLog'], false)
    if(shouldSaveLog) {
        if(!project.updateLogs) {
            project.updateLogs = []
        }
        project.updateLogs.unshift({
            updatedAt: moment(new Date()).toISOString(),
            description: _.get(body, ['description'], _.get(project, ['description'], '')),
            updateBody: body,
        })
    }
    
    await project.save();
    return queryProjectById(id);
};

const updateProjectMode = async (id, updateBody) => {
    const project = await getProjectById(id);
    if (!project) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Store not found');
    }
    let body = _.cloneDeep(updateBody)
    if(project.mode == PROJECT_MODE.PUBLISH && _.get(body, 'mode', '') !== PROJECT_MODE.PUBLISH){
        await userConfigService.decreaseValueOfConfig(project.createdBy, USER_CONFIG_KEY.NUM_OF_PUBLISH_STORE_IN_MONTH)
    }
    if(_.get(body, 'mode', '') == PROJECT_MODE.PUBLISH) {
        body.publishStoreData = {
            listProducts: _.get(project, ['listProducts'], []),
            listTexts: _.get(project, ['listTexts'], []),
            treeData: _.get(project, ['treeData'], []),
            background: _.get(project, ['background'], ''),
            brandLogo: _.get(project, ['brandLogo'], ''),
            storeThemeType: _.get(project, ['storeThemeType'], STORE_THEME_TYPES.TYPE_1),
            storeNameStyle: _.get(project, ['storeNameStyle'], null),
            elementMaterials: _.get(project, ['elementMaterials'], {}),
            name: _.get(project, ['name'], ''),
            description: _.get(project, ['description'], ''),
        }
    } else {
        body.publishStoreData = {}
    }
    Object.assign(project, body);
    
    await project.save();
    return queryProjectById(id);
};

const syncPublishStoreWithLive = async (id) => {
    const project = await getProjectById(id);
    if (!project) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Store not found');
    }
    let body = {
        publishStoreData: {
            listProducts: _.get(project, ['listProducts'], []),
            listTexts: _.get(project, ['listTexts'], []),
            treeData: _.get(project, ['treeData'], []),
            background: _.get(project, ['background'], ''),
            brandLogo: _.get(project, ['brandLogo'], ''),
            storeThemeType: _.get(project, ['storeThemeType'], STORE_THEME_TYPES.TYPE_1),
            storeNameStyle: _.get(project, ['storeNameStyle'], null),
            elementMaterials: _.get(project, ['elementMaterials'], {}),
            name: _.get(project, ['name'], ''),
            description: _.get(project, ['description'], ''),
        }
    }
    Object.assign(project, body);
    
    await project.save();
    return queryProjectById(id);
};

const deleteProjectById = async (id) => {
    const proj = await getProjectById(id);
    if (!proj) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
    }
    Object.assign(proj, {isDeleted: true});
    await proj.save();
    return proj;
};

const getAllProjectHaveGalleryFilePath = (assetId, userid) => {
    const userId = mongoose.Types.ObjectId(userid);
    return Project.aggregate([
        {
            $match: { createdBy: userId},
        },
        { 
            $unwind: "$listProducts" 
        },
        { 
            $unwind: "$listProducts.gallery" 
        },
        {
            $match: {
                $and: [
                    {"listProducts.gallery.assetId": {$exists: true}},
                    {"listProducts.gallery.assetId": assetId}
                ]
            }
        },
        {
            $group: {
              _id: "$_id"
            }
        },
    ])
}

const getAllThumnail = async () => {
    return await Project.aggregate([
      {
        $match: {
          "image": {$exists: true}
        }
      },
      {
        $project: {
            "thumnail": "$image"
        }
      }
    ])
}

const getTotalPublishedStoreByUserId = async (userId) => {
    const projects = await Project.find({ createdBy: userId, isDeleted: {$ne: true}, mode: PROJECT_MODE.PUBLISH })

    return _.get(projects, ['length'], 0)
}

module.exports = {
    getProjectById,
    updateProjectById,
    queryProjects,
    createProject,
    deleteProjectById,
    queryProjectsByAdmin,
    getAllProjectHaveGalleryFilePath,
    getAllThumnail,
    queryProjectById,
    getTotalPublishedStoreByUserId,
    updateProjectMode,
    syncPublishStoreWithLive
}