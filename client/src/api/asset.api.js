import axios from './base.api';

const getAssets = (params) => {
    return axios.get(`/asset`, {params}).then(rs => {
        return rs.data
    })
}

const getPublicAssets = (params) => {
    return axios.get(`/asset/public`, {params}).then(rs => {
        return rs.data
    })
}

const getAllAsset = (params) => {
    return axios.get(`/asset/all`, {params}).then(rs => {
        return rs.data
    })
}

const getAssetById = (id) => {
    return axios.get(`/asset/${id}`).then(rs => {
        return rs.data
    })
}

const createAsset = (data) => {
    return axios.post(`/asset`, data).then(rs => {
        return rs.data
    })
}

const deleteAsset = (id, shouldDeleteFile = 0) => {
    return axios.delete(`/asset?id=${id}&shouldDeleteFile=${shouldDeleteFile}`).then(rs => {
        return rs.data
    })
}

const updateAsset = (id, data) => {
    return axios.put(`/asset/${id}`, data).then(rs => {
        return rs.data
    })
}

const assetApi = {
    getAllAsset,
    getAssetById,
    createAsset,
    getAssets,
    deleteAsset,
    updateAsset,
    getPublicAssets
}
export default assetApi

