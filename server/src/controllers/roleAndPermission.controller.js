const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { roleAndPermissionService } = require('../services');
const _ = require('lodash');
const { LIST_PERMISSIONS_OPTIONS } = require('../utils/constant');

const getAllPermissions = catchAsync(async (req, res) => {
    res.send(LIST_PERMISSIONS_OPTIONS);
});

const queryRoleAndPermissions = catchAsync(async (req, res) => {
    let filter = pick(req.query, ['isSuperAdminRole']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    if(req.query.search){
        filter.name = { 
            "$regex": new RegExp(req.query.search.toLowerCase(), "i") 
        }
    }
    if(!filter.isSuperAdminRole) {
        filter.isSuperAdminRole = {$ne: true}
    }
    const roleAndPermission = await roleAndPermissionService.queryRoleAndPermissions(filter, options);
    res.send(roleAndPermission);
});

const createRoleAndPermission = catchAsync(async (req, res) => {
    const roleAndPermission = await roleAndPermissionService.createRoleAndPermission(req.body);
    res.status(httpStatus.CREATED).send(roleAndPermission);
});

const updateRoleAndPermission = catchAsync(async (req, res) => {
    const roleAndPermission = await roleAndPermissionService.updateRoleAndPermissionById(req.params.id, req.body);
    res.send(roleAndPermission);
});

const deleteRoleAndPermission = catchAsync(async (req, res) => {
    const roleAndPermission = await roleAndPermissionService.deleteRoleAndPermissionById(req.params.id);
    res.send(roleAndPermission);
});

module.exports = {
    createRoleAndPermission,
    updateRoleAndPermission,
    queryRoleAndPermissions,
    deleteRoleAndPermission,
    getAllPermissions
}