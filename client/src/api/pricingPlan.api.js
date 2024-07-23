import axios from './base.api';

const getPricingPlans = (data) => {
    return axios.get(`/pricing-plan/all`, data).then(rs => {
        return rs.data
    })
}

const getMetadrobPricingPlans = (data) => {
    return axios.get(`/pricing-plan/metadrob`, data).then(rs => {
        return rs.data
    })
}

const getShopifyPricingPlan = (data) => {
    return axios.get(`/pricing-plan/shopify-plan`, data).then(rs => {
        return rs.data
    })
}

const getPricingPlanById = (id) => {
    return axios.get(`/pricing-plan/${id}`).then(rs => {
        return rs.data
    })
}

const createPricingPlan = (data) => {
    return axios.post(`/pricing-plan`, data).then(rs => {
        return rs.data
    })
}

const updatePricingPlan = (id, data) => {
    return axios.put(`/pricing-plan/${id}`, data).then(rs => {
        return rs.data
    })
}

export const deletePricingPlan = (id) => {
    return axios.delete(`/pricing-plan?id=${id}`).then(rs => {
        return rs.data
    })
}

const getAvailablePricingPlans = (params = {}) => {
    return axios.get(`/pricing-plan/get-available`, {params}).then(rs => {
        return rs.data
    })
}

const pricingPlanApi = {
    getPricingPlans,
    createPricingPlan,
    updatePricingPlan,
    deletePricingPlan,
    getAvailablePricingPlans,
    getPricingPlanById,
    getShopifyPricingPlan,
    getMetadrobPricingPlans
}

export default pricingPlanApi;