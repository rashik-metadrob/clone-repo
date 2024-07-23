import axios from './base.api';

const createAddress = (data) => {
    return axios.post(`/address/create`, data).then(rs => {
        return rs.data
    })
}

const getAllAddress = (params) => {
    return axios.get(`/address/all`, {params}).then(rs => {
        return rs.data
    })
}

const getAddressById = (id) => {
    return axios.get(`/address?id=${id}`).then(rs => {
        return rs.data
    })
}

export const updateAddress = (id, data) => {
    return axios.put(`/address?id=${id}`, data).then(rs => {
        return rs.data
    })
}

const deleteAddress = (id) => {
    return axios.delete(`/address?id=${id}`).then(rs => {
        return rs.data
    })
}

const addressApi = {
    createAddress,
    getAllAddress,
    deleteAddress,
    getAddressById,
    updateAddress
}

export default addressApi;