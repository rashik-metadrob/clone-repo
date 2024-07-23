import axios from './base.api';

const getUserAudios = () => {
    return axios.get(`/user-audio`).then(rs => {
        return rs.data
    })
}

const addUserAudio = (data) => {
    return axios.post(`/user-audio`, data).then(rs => {
        return rs.data
    })
}

const deleteUserAudio = (id) => {
    return axios.delete(`/user-audio/${id}`).then(rs => {
        return rs.data
    })
}

const userAudioApi = {
    getUserAudios,
    addUserAudio,
    deleteUserAudio
}

export default userAudioApi
