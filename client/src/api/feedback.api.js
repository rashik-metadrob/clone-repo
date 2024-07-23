import axios from './base.api';

export const sendFeedback = (data) => {
    return axios.post(`/feedback`, data).then(rs => {
        return rs.data
    })
}