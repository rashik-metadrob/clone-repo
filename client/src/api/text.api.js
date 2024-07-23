import axios from './base.api';

const createText = (data) => {
    return axios.post(`/text`, data).then(rs => {
        return rs.data
    })
}

const getTexts = (params) => {
    return axios.get(`/text`, {params}).then(rs => {
        return rs.data
    })
}

const getPublicTexts = (params) => {
    return axios.get(`/text/get-public-texts`, {params}).then(rs => {
        return rs.data
    })
}

const deleteText = (id) => {
    return axios.delete(`/text?id=${id}`).then(rs => {
        return rs.data
    })
}

const updateText = (id, data) => {
    return axios.put(`/text/${id}`, data).then(rs => {
        return rs.data
    })
}

const textApi = {
    createText,
    getTexts,
    deleteText,
    updateText,
    getPublicTexts
}

export default textApi