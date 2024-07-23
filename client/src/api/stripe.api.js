import axios from './base.api';

export const getIntentSecret = (data) => {
    return axios.post(`stripe/secret`, data).then(rs => {
        return rs.data
    })
}