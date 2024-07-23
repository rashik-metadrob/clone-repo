import axios from './base.api';

export const getConfigByType = (type) => {
    return axios.get(`/config?type=${type}`).then(rs => {
        return rs.data
    })
}

export const uniqueConfig = (data) => {
    return axios.post(`/config`, data).then(rs => {
        return rs.data
    })
}

export const getSettings = () => {
    return axios.get(`/config/setting`).then(rs => {
        return rs.data
    })
}

const configApi = {
    getConfigByType,
    uniqueConfig,
    getSettings
}

export default configApi