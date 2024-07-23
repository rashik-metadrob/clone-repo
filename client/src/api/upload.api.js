import _ from 'lodash';
import { store } from '../redux';
import { bytesToMegabytes } from '../utils/util';
import axios from './base.api';
import { CONFIG_TEXT, NOTIFICATION_TYPES, PRICING_PLAN_VALUE, USER_ROLE } from '../utils/constants';
import notificationApi from './notification.api';

export const uploadFile = (formData, shouldResize = 0, folder = '', width = 0, height = 0, shouldCheckCapacity = true) => {
    if(store){
        const state = store.getState()
        const user = _.get(state, ['app', 'user'])
        const userStorageInfo = _.get(state, ['userStorage', 'userStorageInfo'])
        if(user && userStorageInfo && user.role === USER_ROLE.RETAILERS && shouldCheckCapacity){
            const freeSpace = _.get(userStorageInfo, ['maximumStorage'], PRICING_PLAN_VALUE.DEFAULT_STORE_CAPACITY) - _.get(userStorageInfo, ['total'], 0)
            if(freeSpace <= 0){
                // Push notification require upgrade
                notificationApi.createNotification({
                    subject: CONFIG_TEXT.EXCEEDED_STORAGE_LIMIT_SUBJECT,
                    content: CONFIG_TEXT.EXCEEDED_STORAGE_LIMIT_CONTENT,
                    type: NOTIFICATION_TYPES.EXCEEDED_STORAGE_LIMIT,
                    to: user.id
                })
                return {
                    status: 500,
                    data: {
                        message: "Exceeded the maximum capacity!"
                    }
                }
            }
        }
    }

    let url = `/upload?shouldResize=${shouldResize}&folder=${folder}`
    if(width > 0){
        url += `&width=${width}`
    }
    if(height > 0){
        url += `&height=${height}`
    }

   
    return axios.post(url, formData, 
    {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }).then(rs => {
        return rs.data
    }).catch(rs => {
        return rs.response
    })
}

export const uploadTextImageFileBase64 = (base64) => {
    return axios.post(`/upload/base64`, {base64}).then(rs => {
        return rs.data
    }).catch(rs => {
        return rs.response
    })
}