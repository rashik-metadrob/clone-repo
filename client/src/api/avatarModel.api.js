import axios from './base.api';

const getAllAvatarModels = (params) => {
    return axios.get(`/avatar-model/all`, {params}).then(rs => {
        return rs.data
    })
}

const avatarModelApi = {
    getAllAvatarModels
}
export default avatarModelApi
