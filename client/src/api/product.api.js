import { PRODUCT_TYPES } from '../utils/constants';
import axios from './base.api';

export const getProducts = (params) => {
    return axios.get(`/product`, {params}).then(rs => {
        return rs.data
    })
}

export const getListPublicDecorarive = (params) => {
    return axios.get(`product/get-public-products`, {params}).then(rs => {
        return rs.data
    })
}
export const getListPublicDecorariveForViewer = (params) => {
    return axios.get(`product/get-public-products-for-viewer`, {params}).then(rs => {
        return rs.data
    })
}
export const getListPublicProduct = (data) => {
    return axios.get(`product/get-public-products?limit=${data.limit || 10}&page=${data.page || 1}&type=${PRODUCT_TYPES.PRODUCTS}`).then(rs => {
        return rs.data
    })
}

export const getListProductTypes = (data) => {
    return axios.get(`product/get-list-product-types`).then(rs => {
        return rs.data
    })
}

export const getListProductCurrencies = (data) => {
    return axios.get(`product/get-list-product-currencies`).then(rs => {
        return rs.data
    })
}

export const createProduct = (data) => {
    return axios.post(`/product`, data).then(rs => {
        return rs.data
    })
}

export const createMultiProducts = (data) => {
    return axios.post(`/product/multiple`, data).then(rs => {
        return rs.data
    })
}

export const getProductById = (id) => {
    return axios.get(`/product/get-product?id=${id}`).then(rs => {
        return rs.data
    })
}

export const updateProduct = (id, data) => {
    return axios.put(`/product?id=${id}`, data).then(rs => {
        return rs.data
    })
}

export const deleteProduct = (id) => {
    return axios.delete(`/product?id=${id}`).then(rs => {
        return rs.data
    })
}

export const getProductByShopifyVariantMerchandiseId = (shopifyVariantMerchandiseId) => {
    return axios.get(`/product/get-product-by-merchandise?shopifyVariantMerchandiseId=${shopifyVariantMerchandiseId}`).then(rs => {
        return rs.data
    })
}

const getProductsOfTheMonth = () => {
    return axios.get(`/product/products-of-the-month`).then(rs => {
        return rs.data
    })
}

const getAllProducts = () => {
    return axios.get(`/product/get-all-products`).then(rs => {
        return rs.data
    })
}

const importProductFromCsvFile = (data) => {
    return axios.post(`/product/import-from-csv`, data).then(rs => {
        return rs.data
    })
}

const productApi = {
    getProductsOfTheMonth,
    getAllProducts,
    importProductFromCsvFile
}

export default productApi