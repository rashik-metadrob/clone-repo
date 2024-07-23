import axios from './base.api';

const getHdris = (params) => {
    return axios.get(`/hdri`, {params}).then(rs => {
        return rs.data
    })
}

const getAllHdri = (params) => {
    return axios.get(`/hdri/all`, {params}).then(rs => {
        return rs.data
    })
}

const getHdriById = (id) => {
    return axios.get(`/hdri/${id}`).then(rs => {
        return rs.data
    })
}

const createHdri = (data) => {
    return axios.post(`/hdri`, data).then(rs => {
        return rs.data
    })
}

const deleteHdri = (id) => {
    return axios.delete(`/hdri?id=${id}`).then(rs => {
        return rs.data
    })
}

const updateHdri = (id, data) => {
    return axios.put(`/hdri/${id}`, data).then(rs => {
        return rs.data
    })
}

const hdriApi = {
    getAllHdri,
    getHdriById,
    createHdri,
    getHdris,
    deleteHdri,
    updateHdri
}
export default hdriApi

