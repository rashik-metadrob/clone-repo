import axios from './base.api';

const getUserStorageInfo = () => {
    return axios.get(`/user-storage`).then(rs => {
        return rs.data
    })
}

const userStorageApi = {
    getUserStorageInfo
}

export default userStorageApi