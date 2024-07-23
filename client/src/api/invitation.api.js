import axios from './base.api';

const sendAnInvitation = (data) => {
    return axios.post(`/invitation`, data).then(rs => {
        return rs.data
    })
}

const getInvitation = (code) => {
    return axios.get(`/invitation`, {params: {code}}).then(rs => {
        return rs.data
    })
}

const acceptInvitation = (code) => {
    return axios.put(`/invitation/accept/${code}`).then(rs => {
        return rs.data
    })
}

const rejectInvitation = (code) => {
    return axios.put(`/invitation/reject/${code}`).then(rs => {
        return rs.data
    })
}

const invitationApi = {
    sendAnInvitation,
    getInvitation,
    rejectInvitation,
    acceptInvitation
}

export default invitationApi