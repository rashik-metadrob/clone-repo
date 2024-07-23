const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { projectService, userService, userSubcriptionService } = require('../services');
const CONSTANTS = require("../utils/constant")
const _ = require('lodash')

const createProject = catchAsync(async (req, res) => {
  const project = await projectService.createProject(req.body);
  res.status(httpStatus.CREATED).send(project);
});

const getProject = catchAsync(async (req, res) => {
  // Query project and sync data
    const project = await projectService.queryProjectById(req.params.id, req.query.isPublishMode);
    if (!project) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Store not found');
    }
    res.send(project);
});

const getProjects = catchAsync(async (req, res) => {
  let filter = pick(req.query, ['name', 'type', 'mode', 'createdBy']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  filter['$and'] = []

  if(filter.type && filter.type === CONSTANTS.PROJECT_TYPE.TEMPLATE){
    const contentTypes = await userService.getContentTypeOfUser(req.user._id);
    filter['$and'].push({
      $or: [{"contentType": {$exists: false}}, {"contentType": {$in: contentTypes}}]
    })
  }

  if(req.query.search){
    filter = {
      ...filter,
      name: {
        "$regex": new RegExp(req.query.search.toLowerCase(), "i")
      }
    }
  }
  if(filter.type === CONSTANTS.PROJECT_TYPE.TEMPLATE) {
    filter.isDisabled = { $ne: true }
  }
  
  const result = await projectService.queryProjects(filter, options);
  const user = req.user;
  if(user){
    const publishRs = await projectService.queryProjects({
      mode: CONSTANTS.PROJECT_MODE.PUBLISH,
      createdBy: user._id
    }, options);

    result.publishTotals = publishRs.totalResults || 0;

    const draftRs = await projectService.queryProjects({
      mode: CONSTANTS.PROJECT_MODE.UNSAVED,
      createdBy: user._id
    }, options);

    result.draftTotals = draftRs.totalResults || 0;
  }

  res.send(result);
});

const getProjectsByAdmin = catchAsync(async (req, res) => {
  let filter = pick(req.query, ['name', 'type', 'mode', 'createdBy', 'isShopifyStore']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  if(req.query.search){
    filter = {
      ...filter,
      name: {
        "$regex": new RegExp(req.query.search.toLowerCase(), "i")
      }
    }
  }

  if(!options.sortBy){
    options.sortBy = "createdAt:desc"
  }

  const result = await projectService.queryProjectsByAdmin(filter, options);
  res.send(result);
});

const getListPublishProject = catchAsync(async (req, res) => {
  const user = req.user
  const options = {
    limit: 1000
  }
  const result = await projectService.queryProjects({createdBy: user._id, mode: CONSTANTS.PROJECT_MODE.PUBLISH}, options);
  result.results = result.results.map(el => {
    const obj = el.toObject();

    return {
      label: obj.name,
      value: obj._id
    }
  })
  res.send(result);
});

const updateProjectMode = catchAsync(async (req, res) => {
  const mode = _.get(req.body, ['mode'], CONSTANTS.PROJECT_MODE.UNSAVED)
  const project = await projectService.updateProjectMode(req.params.id, {mode});
  res.send(project);
});

const syncPublishStoreWithLive = catchAsync(async (req, res) => {
  const project = await projectService.syncPublishStoreWithLive(req.params.id);
  res.send(project);
});

const updateProject = catchAsync(async (req, res) => {
    const project = await projectService.updateProjectById(req.params.id, req.body);
    res.send(project);
});

const deleteProject = catchAsync(async (req, res) => {
  // const user = req.user;
  // let project = await projectService.getProjectById(req.query.id);
  // if(project.createdBy.toString() != user._id.toString()){
  //   throw new ApiError(httpStatus.NOT_FOUND, 'The project was not created by you');
  // }
  let project = await projectService.deleteProjectById(req.query.id);
  res.send(project);
});
  
module.exports = {
    getProject,
    updateProject,
    getProjects,
    createProject,
    getListPublishProject,
    deleteProject,
    getProjectsByAdmin,
    updateProjectMode,
    syncPublishStoreWithLive
};