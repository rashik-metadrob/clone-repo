import axios from './base.api';

const testConnection = (data) => {
    return axios.post(`/odoo/test-connection`, data).then(rs => {
        return rs.data
    })
}

const odooApi = {
    testConnection
}
export default odooApi

