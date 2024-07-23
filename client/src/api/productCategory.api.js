import axios from './base.api';

const getListProductCategories = (params) => {
    return axios.get(`/product-category/get-categories`, {params}).then(rs => {
        return rs.data
    })
}

const createProductCategory = (body) => {
    return axios.post(`/product-category/create`, body).then(rs => {
        return rs.data
    })
}

const getListDecorativeCategories = (params) => {
    return axios.get(`/product-category/all-decorative-categories`, {params}).then(rs => {
        return rs.data
    })
}

const getAllCustomerCategories = (params) => {
    return axios.get(`/product-category/get-all-customer-categories`, {params}).then(rs => {
        return rs.data
    })
}

export const productCategoryApi = {
    getListProductCategories,
    createProductCategory,
    getListDecorativeCategories,
    getAllCustomerCategories
}