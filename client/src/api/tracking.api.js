import axios from './base.api';

export const createTracking = (data) => {
    return axios.post(`/tracking`, data).then(rs => {
        return rs.data
    })
}
export const getStayInStoreData = () => {
    return axios.get(`/tracking/get-stay-in-store`).then(rs => {
        return rs.data
    })
}
export const getListFeaturedItems = (params) => {
    return axios.get(`/tracking/get-list-feature-items`, {params}).then(rs => {
        return rs.data
    })
}
export const getListMostAddedItem = (params) => {
    return axios.get(`/tracking/get-list-most-added-items`, {params}).then(rs => {
        return rs.data
    })
}
export const getListMostRemovedItem = (params) => {
    return axios.get(`/tracking/get-list-most-removed-items`, {params}).then(rs => {
        return rs.data
    })
}

export const countUserEnterByWeek = (params) => {
    return axios.get(`/tracking/count-user-enter-by-week`, {params}).then(rs => {
        return rs.data
    })
}

export const countUserEnter = (params) => {
    return axios.get(`/tracking/count-user-enter`, {params}).then(rs => {
        return rs.data
    })
}

const countTotalTimeSpentToBuildStore = (params) => {
    return axios.get(`/tracking/count-total-time-spent-to-buid-store`, {params}).then(rs => {
        return rs.data
    })
}

const countTotalTimeSpentToExploringStore = (params) => {
    return axios.get(`/tracking/count-total-time-spent-to-exploring-store`, {params}).then(rs => {
        return rs.data
    })
}

const countTotalTimeInteractivityThisMonth = (params) => {
    return axios.get(`/tracking/count-total-time-interactivity-last-7-days`, {params}).then(rs => {
        return rs.data
    })
}

const countTotalTimeSpentToExploringStoreByRetailer = (params) => {
    return axios.get(`/tracking/count-total-time-spent-to-exploring-store-by-retailer`, {params}).then(rs => {
        return rs.data
    })
}

const trackingApi = {
    countTotalTimeSpentToBuildStore,
    countTotalTimeSpentToExploringStore,
    countTotalTimeInteractivityThisMonth,
    countTotalTimeSpentToExploringStoreByRetailer
}
export default trackingApi