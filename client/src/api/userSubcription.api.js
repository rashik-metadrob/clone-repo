import axios from './base.api';

const createSubcription = (data) => {
    return axios.post(`/user-subcription`, data).then(rs => {
        return rs.data
    })
}
const assignPricingPlan = (data) => {
    return axios.post(`/user-subcription/admin-assign-pricing-plan`, data).then(rs => {
        return rs.data
    })
}

const getSubcription = (params) => {
    return axios.get(`/user-subcription`, {params}).then(rs => {
        return rs.data
    })
}

const updateSubcription = (id, data) => {
    return axios.put(`/user-subcription/${id}`, data).then(rs => {
        return rs.data
    })
}

const checkUserSubcriptPricingPlan = (data) => {
    return axios.get(`/user-subcription/check-user-subcript-pricing-plan`).then(rs => {
        return rs.data
    })
}

const getLastPlanPurchased = (data) => {
    return axios.get(`/user-subcription/last-plan-purchased`).then(rs => {
        return rs.data
    })
}

const countPremiumUsers = (data) => {
    return axios.get(`/user-subcription/count-premium-users`).then(rs => {
        return rs.data
    })
}

const getPlanSubcriptionHistory = (userId) => {
    return axios.get(`/user-subcription/history?userId=${userId}`).then(rs => {
        return rs.data
    })
}

const userSubcriptionApi = {
    createSubcription,
    checkUserSubcriptPricingPlan,
    getSubcription,
    updateSubcription,
    getLastPlanPurchased,
    countPremiumUsers,
    assignPricingPlan,
    getPlanSubcriptionHistory
}

export default userSubcriptionApi;