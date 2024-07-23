import global from '../redux/global';
import axios from './base.api';

const getListUsers = (params) => {
    return axios.get(`/users`, {params}).then(rs => {
        return rs.data
    })
}

const getUserById = (id) => {
    return axios.get(`/users/${id}`).then(rs => {
        return rs.data
    })
}
const getUserPermissions = (id) => {
    return axios.get(`/users/permissions/${id}`).then(rs => {
        return rs.data
    })
}
const getUserShopifyCartIdById = (id) => {
    return axios.get(`/users/get-user-shopify-cart-id?userId=${id}`).then(rs => {
        return rs.data
    })
}

const deleteUser = (id) => {
    return axios.delete(`/users/${id}`).then(rs => {
        return rs.data
    })
}

const completeOnboarding = () => {
    return axios.put(`/users/onboarding`).then(rs => {
        return rs.data
    })
}

const getUserIP = () => {
    return axios.get(`/users/get-user-ip`).then(rs => {
        return rs.data
    })
}

const checkHasMultiplePlayerRole = (id) => {
    return axios.get(`/users/check-is-multiple-player?userId=${id}`).then(rs => {
        return rs.data
    })
}

const checkHasWhiteLabel = (id) => {
    return axios.get(`/users/check-has-white-label?userId=${id}`).then(rs => {
        return rs.data
    })
}

const checkIsActiveShopifyStore = (id) => {
    return axios.get(`/users/check-is-shopify-active-store?userId=${id}`).then(rs => {
        return rs.data
    })
}

const checkCanPublishStore = (id) => {
    return axios.get(`/users/check-can-publish-store?userId=${id}`).then(rs => {
        return rs.data
    })
}

const checkCanCreateNewStore = (id) => {
    return axios.get(`/users/check-can-create-store?userId=${id}`).then(rs => {
        return rs.data
    })
}

const checkCanCreateNewProduct = (id) => {
    return axios.get(`/users/check-can-create-product?userId=${id}`).then(rs => {
        return rs.data
    })
}

const getListTriedPlanIds = (id) => {
    return axios.get(`/users/get-list-tried-plans?userId=${id}`).then(rs => {
        return rs.data
    })
}

const getListUploadBlocks = () => {
    return axios.get(`/users/get-list-upload-blocks?isFromDrobA=${global.IS_DROB_A ? 1 : 0}`).then(rs => {
        return rs.data
    })
}

const getUploadLimitSize = () => {
    return axios.get(`/users/get-upload-file-limit-size`).then(rs => {
        return rs.data
    })
}

const countNewUsers = () => {
    return axios.get(`/users/count-new-users`).then(rs => {
        return rs.data
    })
}

const getNewUsers = () => {
    return axios.get(`/users/get-new-users`).then(rs => {
        return rs.data
    })
}

const updateLoggedInUser = (data) => {
    return axios.put(`/users/update-logged-in`, data).then(rs => {
        return rs.data
    })
}


const getActivePricingPlan = () => {
    return axios.get(`/users/get-active-plan`).then(rs => {
        return rs.data
    })
}

const checkIsUserHasDefaultPassword = () => {
    return axios.get(`/users/check-is-user-has-default-password`).then(rs => {
        return rs.data
    })
}

const updateLoggedInUserPassword = (data) => {
    return axios.put(`/users/update-logged-in-password`, data).then(rs => {
        return rs.data
    })
}

const sendEmail = (data) => {
    return axios.post(`/users/send-email`, data).then(rs => {
        return rs.data
    })
}

const getUserEmailBySearch = (search) => {
    return axios.get(`/users/get-emails`, {search}).then(rs => {
        return rs.data
    })
}

export const userApi = {
    getListUsers,
    deleteUser,
    completeOnboarding,
    getUserIP,
    checkHasMultiplePlayerRole,
    checkCanCreateNewStore,
    checkCanCreateNewProduct,
    getListUploadBlocks,
    checkCanPublishStore,
    countNewUsers,
    getNewUsers,
    updateLoggedInUser,
    getUserById,
    getActivePricingPlan,
    getUserShopifyCartIdById,
    checkIsActiveShopifyStore,
    getUploadLimitSize,
    checkHasWhiteLabel,
    getListTriedPlanIds,
    checkIsUserHasDefaultPassword,
    updateLoggedInUserPassword,
    sendEmail,
    getUserEmailBySearch,
    getUserPermissions
}