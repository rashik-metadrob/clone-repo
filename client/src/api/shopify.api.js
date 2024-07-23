import axios from "./base.api";

export function addSession(data) {
  return axios.post(`/shopify/add-session`, data).then((rs) => {
    return rs.data;
  });
};

export function getSession(data) {
  const queryParams = new URLSearchParams(data);
  return axios.get(`/shopify/get-session?${queryParams.toString()}`).then((rs) => {
    return rs.data;
  });
};

const importProductsFromShopify = (data) => {
  const queryParams = new URLSearchParams(data);
  return axios.get(`/shopify/import-product-from-shopify?${queryParams.toString()}`, {}).then(rs => {
      return rs.data
  })
}

const getProductsByStoreFrontAPI = (data) => {
  const queryParams = new URLSearchParams(data);
  return axios.get(`/shopify/get-products-by-store-front?${queryParams.toString()}`, {}).then(rs => {
      return rs.data
  })
}

const createShopifyCartByStoreFrontAPI = (data, storeId) => {
  return axios.post(`/shopify/create-cart-by-store-front?storeId=${storeId}`, data).then(rs => {
      return rs.data
  })
}

const getShopifyCartByStoreFrontAPI = (shopifyCartId, storeId) => {
  return axios.get(`/shopify/get-cart-by-store-front?shopifyCartId=${shopifyCartId}&storeId=${storeId}`).then(rs => {
      return rs.data
  })
}

const updateShopifyCartItemsByStoreFrontAPI = (shopifyCartId, data, storeId) => {
  return axios.put(`/shopify/update-cart-by-store-front?shopifyCartId=${shopifyCartId}&storeId=${storeId}`, data).then(rs => {
      return rs.data
  })
}

const addShopifyCartItemsByStoreFrontAPI = (shopifyCartId, data, storeId) => {
  return axios.put(`/shopify/add-cart-by-store-front?shopifyCartId=${shopifyCartId}&storeId=${storeId}`, data).then(rs => {
      return rs.data
  })
}

const removeShopifyCartItemsByStoreFrontAPI = (shopifyCartId, data, storeId) => {
  return axios.put(`/shopify/remove-cart-by-store-front?shopifyCartId=${shopifyCartId}&storeId=${storeId}`, data).then(rs => {
      return rs.data
  })
}

const getCheckoutUrlByStoreFrontAPI = (shopifyCartId, storeId) => {
  return axios.get(`/shopify/get-checkout-url-by-store-front?shopifyCartId=${shopifyCartId}&storeId=${storeId}`).then(rs => {
      return rs.data
  })
}

const shopifyApi = {
  importProductsFromShopify,
  getProductsByStoreFrontAPI,
  createShopifyCartByStoreFrontAPI,
  getShopifyCartByStoreFrontAPI,
  updateShopifyCartItemsByStoreFrontAPI,
  addShopifyCartItemsByStoreFrontAPI,
  getCheckoutUrlByStoreFrontAPI,
  removeShopifyCartItemsByStoreFrontAPI
} 
export default shopifyApi