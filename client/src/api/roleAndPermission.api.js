import axios from './base.api';

const getRoleAndPermissions = (params) => {
    return axios.get(`/role-and-permission`, {params}).then(rs => {
        return rs.data
    })
}

const getAllPermissions = () => {
    return axios.get(`/role-and-permission/permissions`).then(rs => {
        return rs.data
    })
}

const createRoleAndPermission = (data) => {
    return axios.post(`/role-and-permission`, data).then(rs => {
        return rs.data
    })
}

const updateRoleAndPermissionById = (id, data) => {
    return axios.put(`/role-and-permission/${id}`, data).then(rs => {
        return rs.data
    })
}

const deleteRoleAndPermissionById = (id) => {
    return axios.delete(`/role-and-permission/${id}`).then(rs => {
        return rs.data
    })
}

const roleAndPermissionApi = {
    getRoleAndPermissions,
    createRoleAndPermission,
    updateRoleAndPermissionById,
    deleteRoleAndPermissionById,
    getAllPermissions,
}

export default roleAndPermissionApi