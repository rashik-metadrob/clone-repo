import axios from './base.api';

// Ver 1, old version
// const getPaypalApproveUrl = (orderId) => {
//     return axios.get(`/paypal/get-approve-url?orderId=${orderId}`).then(rs => {
//         return rs.data
//     })
// }

const createOrder = (id) => {
    return axios.post(`/paypal/orders/${id}`).then(rs => {
        return rs.data
    })
}

const createOrderForPricingPlan = (id) => {
    return axios.post(`/paypal/pricing-plan/${id}`).then(rs => {
        return rs.data
    })
}

const capture = (orderID) => {
    return axios.get(`/paypal/orders/${orderID}/capture`).then(rs => {
        return rs.data
    })
}
const paypalApi = {
    // getPaypalApproveUrl,
    createOrder,
    capture,
    createOrderForPricingPlan
}

export default paypalApi;