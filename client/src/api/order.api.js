import axios from './base.api';

const createOrder = (data) => {
    return axios.post(`/order/create`, data).then(rs => {
        return rs.data
    })
}

const updateOrder = (id, data) => {
    return axios.put(`/order/${id}`, data).then(rs => {
        return rs.data
    })
}

const getByIntentSecret = (id) => {
    return axios.get(`/order/intent/${id}`).then(rs => {
        return rs.data
    })
}

const getByPaypalPaymentId = (id) => {
    return axios.get(`/order/paypal-payment/${id}`).then(rs => {
        return rs.data
    })
}

const getGrossIncome = () => {
    return axios.get(`/order/gross-income`).then(rs => {
        return rs.data
    })
}

const getRetailerGrossIncome = () => {
    return axios.get(`/order/retailer-gross-income`).then(rs => {
        return rs.data
    })
}

const getOrdersLast7Days = (params) => {
    return axios.get(`/order/count-orders-last-7-days`, {params}).then(rs => {
        return rs.data
    })
}

const getListOrders = (params) => {
    return axios.get(`/order`, {params}).then(rs => {
        return rs.data
    })
}

const orderApi = {
    createOrder,
    getByIntentSecret,
    updateOrder,
    getByPaypalPaymentId,
    getGrossIncome,
    getOrdersLast7Days,
    getListOrders,
    getRetailerGrossIncome
}

export default orderApi;