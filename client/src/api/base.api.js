import { notification } from "antd";
import axios from "axios";
import queryString from 'query-string';
import { getStorageRefreshToken, getStorageToken, removeAllUserData, setStorageRefreshToken, setStorageToken } from "../utils/storage";
import { encodeUrl } from "../utils/util";
import global from "../redux/global"
import routesConstant from "../routes/routesConstant";
import _ from "lodash"

export const baseUrl = process.env.REACT_APP_ENDPOINT

export const shouldIgnoreUnauthorizedTokenForViewerMode = () => {
  const ignoreUrls = ["/project/viewer/", "/demo/viewer/"]

  return _.some(ignoreUrls, (el) => window.location.href.includes(el))
}

export const shouldIgnoreUnauthorizedTokenForPublishMode = () => {
  const ignoreUrls = ["/publish/customer/"]

  return _.some(ignoreUrls, (el) => window.location.href.includes(el))
}

export const requestToken = async () => {
  // Handle for demo link for Viewer
  if(shouldIgnoreUnauthorizedTokenForViewerMode()){
    return Promise.reject()
  }

  try {
    // TODO: handle shopify here
    const res = await getRefreshToken();
    setStorageToken(res.data.access.token)
    setStorageRefreshToken(res.data.refresh.token)
    return Promise.resolve(res);
  } catch (e) {
    notification.warning({
      message: "Unauthorized error."
    })
    removeAllUserData();
    if(!shouldIgnoreUnauthorizedTokenForPublishMode()){
      if(global.IS_SHOPIFY){
        window.location.href = `${process.env.REACT_APP_HOMEPAGE}${routesConstant.shopify.path}`;
      } else {
        window.location.href = `${process.env.REACT_APP_HOMEPAGE}/login`;
      }
    }
    
    return Promise.reject(e);
  }
};

export const getRefreshToken = async () => {
  const refreshTokenLocal = getStorageRefreshToken();
  const data = {
      refreshToken: refreshTokenLocal,
  };
  let reqUrl = "/auth/refresh-tokens"
  if(global.IS_SHOPIFY){
    reqUrl += `?shop=${global.getShopifyShop()}`
  }
  return await axios({
    baseURL: baseUrl,
    url: reqUrl,
    headers: {
        'Content-Type': 'application/json',
    },
    method: 'POST',
    data,
  })
}

const httpClient = axios.create({
  baseURL: baseUrl,
  headers: {
      'content-type': 'application/json',
  },
  withCredentials: true,
  paramsSerializer: (params) => {
      return queryString.stringify(params);
  },
});

httpClient.interceptors.request.use(
(request) => {
  var config = {}
  if (request.config) {
    config = request.config
  }
  config.start = Date.now()
  request.config = config;

  var token = getStorageToken() ? getStorageToken() : null
  if (token) {
    request.headers.Authorization = `Bearer ${token}`
  }

  return request
})

httpClient.interceptors.response.use(
  (response) => {
      return response;
  },
  async (error) => {
    if (error.response && error.response.status === 401 && error.response?.data?.message === "Please authenticate" && error.response.config.url !== "/auth/login") {
      if(getStorageRefreshToken()){
        const res = await requestToken();

        const prevRequest = error?.config;
        return httpClient(prevRequest)
      } else {
        removeAllUserData();
        if(!shouldIgnoreUnauthorizedTokenForViewerMode() && !shouldIgnoreUnauthorizedTokenForPublishMode()){
          if(global.IS_SHOPIFY){
            window.location.href = `${process.env.REACT_APP_HOMEPAGE}${routesConstant.shopify.path}`;
          } else {
            window.location.href = `${process.env.REACT_APP_HOMEPAGE}/login?returnUrl=${encodeUrl(window.location.href)}`;
          }
        }
      }
    }
    return Promise.reject(error);
  },
);

export default httpClient