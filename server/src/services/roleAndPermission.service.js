const { RoleAndPermission } = require('../models');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const _ = require("lodash")

const createRoleAndPermission = async (body) => {
    const roleName = _.get(body, ['name'])

    const role = await getRoleAndPermissionByName(roleName)
    if(role) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Role already taken!');
    }

    return RoleAndPermission.create(body);
};

const queryRoleAndPermissions = async (filter, options) => {
    let filterRoleAndPermissions = {
        ...filter,
        isDeleted: { $ne: true }
    }
    const roleAndPermissions = await RoleAndPermission.paginate(filterRoleAndPermissions, options);
    return roleAndPermissions;
};

const getRoleAndPermissionById = async (id) => {
    const roleAndPermission = await RoleAndPermission.findById(id);
    return roleAndPermission;
};

const getRoleAndPermissionByName = async (name) => {
    const roleAndPermission = await RoleAndPermission.findOne({name});
    return roleAndPermission;
};

const deleteRoleAndPermissionById = async (id) => {
    const roleAndPermission = await getRoleAndPermissionById(id);
    if (!roleAndPermission) {
      throw new ApiError(httpStatus.NOT_FOUND, 'RoleAndPermission not found');
    }
    Object.assign(roleAndPermission, {isDeleted: true});
    await roleAndPermission.save();
    return roleAndPermission;
};

const updateRoleAndPermissionById = async (id, updateBody) => {
    const roleAndPermission = await getRoleAndPermissionById(id);
    if (!roleAndPermission) {
      throw new ApiError(httpStatus.NOT_FOUND, 'RoleAndPermission not found');
    }

    const updateData = _.pick(updateBody, ['name', 'description', 'permissions'])

    if(updateData.name != roleAndPermission.name) {
        const role = await getRoleAndPermissionByName(updateData.name)
        if(role) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Role already taken!');
        }
    }

    Object.assign(roleAndPermission, updateData);
    await roleAndPermission.save();
    return roleAndPermission;
};

module.exports = {
    createRoleAndPermission,
    queryRoleAndPermissions,
    deleteRoleAndPermissionById,
    updateRoleAndPermissionById,
    getRoleAndPermissionById,
}