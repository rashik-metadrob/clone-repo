import axios from './base.api';

const createNotification = (data) => {
    return axios.post(`/notification`, data).then(rs => {
        return rs.data
    })
}

const getNotifications = (params) => {
    return axios.get(`/notification`, {params}).then(rs => {
        return rs.data
    })
}

const viewNotification = (id) => {
    return axios.put(`/notification/view/${id}`).then(rs => {
        return rs.data
    })
}

const notificationApi = {
    createNotification,
    getNotifications,
    viewNotification
}

export default notificationApi