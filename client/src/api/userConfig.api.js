import axios from './base.api';

const userEnterRoom = (data) => {
    return axios.post(`/user-config/user-enter-room`, data).then(rs => {
        return rs.data
    })
}

const userCreateStore = (data) => {
    return axios.post(`/user-config/user-create-store`, data).then(rs => {
        return rs.data
    })
}

const userCreateProduct = (data) => {
    return axios.post(`/user-config/user-create-product`, data).then(rs => {
        return rs.data
    })
}

const userPublishStore = (data) => {
    return axios.post(`/user-config/user-publish-store`, data).then(rs => {
        return rs.data
    })
}

// Only used for unique config
const getConfig = (key) => {
    return axios.get(`/user-config?key=${key}`).then(rs => {
        return rs.data
    })
}

// userId: string;
// key: string;
// value: Object;
const createOrUpdateConfig = (data) => {
    return axios.post(`/user-config`, data).then(rs => {
        return rs.data
    })
}

const userConfigApi = {
    userEnterRoom,
    userCreateStore,
    userCreateProduct,
    userPublishStore,
    getConfig,
    createOrUpdateConfig
}

export default userConfigApi;