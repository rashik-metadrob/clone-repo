import axios from './base.api';

const log = (level = "info", data) => {
    return axios.post(`/logger/log`, {level, data}).then(rs => {
        return rs.data
    })
}

const loggerApi = {
    log
}

export default loggerApi