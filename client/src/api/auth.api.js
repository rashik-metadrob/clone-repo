import global from '../redux/global';
import axios from './base.api';

const register = (data) => {
    return axios.post(`/auth/register`, data).then(rs => {
        return rs.data
    })
}

const login = (data) => {
    const shopifyHost = window.shopifyHost
    const shopifyShop = window.shopifyShop

    let url = '/auth/login'
    if(shopifyHost && shopifyShop) {
        url = `/auth/login?shopifyHost=${shopifyHost}&shopifyShop=${shopifyShop}`
    }

    return axios.post(url, data).then(rs => {
        return rs.data
    })
}
const loginWidthFaceBook = (data) => {
    const shopifyHost = window.shopifyHost
    const shopifyShop = window.shopifyShop

    let url = `/auth/facebook?isDrobA=${global.IS_DROB_A ? 1 : 0}`
    if(shopifyHost && shopifyShop) {
        url = `/auth/facebook?shopifyHost=${shopifyHost}&shopifyShop=${shopifyShop}&isDrobA=${global.IS_DROB_A ? 1 : 0}`
    }

    return axios.post(url, data).then(rs => {
        return rs.data
    })
}

const loginWidthGoogle = (data) => {
    const shopifyHost = window.shopifyHost
    const shopifyShop = window.shopifyShop

    let url = `/auth/google?isDrobA=${global.IS_DROB_A ? 1 : 0}`
    if(shopifyHost && shopifyShop) {
        url = `/auth/google?shopifyHost=${shopifyHost}&shopifyShop=${shopifyShop}&isDrobA=${global.IS_DROB_A ? 1 : 0}`
    }

    return axios.post(url, data).then(rs => {
        return rs.data
    })
}

const logout = (data) => {
    return axios.post(`/auth/logout`, data).then(rs => {
        return rs.data
    })
}

const sendForgotPasswordEmail = (data) => {
    return axios.post(`/auth/forgot-password`, data).then(rs => {
        return rs.data
    })
}

const resetPassword = (token, data) => {
    return axios.post(`/auth/reset-password?token=${token}`, data).then(rs => {
        return rs.data
    })
}

const verifyEmail = (token, data) => {
    return axios.post(`/auth/verify-email?token=${token}`, data).then(rs => {
        return rs.data
    })
}

const authApi = {
    register,
    login,
    logout,
    loginWidthFaceBook,
    loginWidthGoogle,
    sendForgotPasswordEmail,
    resetPassword,
    verifyEmail
}

export default authApi