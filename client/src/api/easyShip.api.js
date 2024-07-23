import axios from './base.api';

const getRates = (data) => {
    return axios.post(`/easy-ship/rates`, data).then(rs => {
        return rs.data
    })
}
const getCouriers = () => {
    return axios.get(`/easy-ship/couriers`).then(rs => {
        return rs.data
    })
}
const createShipment = (data) => {
    return axios.post(`/easy-ship/shipment/create`, data).then(rs => {
        return rs.data
    })
}

const easyShipApi = {
    getRates,
    createShipment,
    getCouriers
}

export default easyShipApi;