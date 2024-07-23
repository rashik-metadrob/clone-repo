//use global instead of redux because redux can only be used in Component

import loggerApi from "../api/logger.api"
import moment from "moment"

export function isShopify(){
    const host = new URLSearchParams(window.location.search).get("host")
    const shop = new URLSearchParams(window.location.search).get("shop")
    const match = /myshopify.com/.test(host) || /myshopify.com/.test(shop)
    loggerApi.log('info', {
        tag: "SHOPIFY INNIT INFO",
        host,
        shop,
        match,
        timestamps: moment().toString()
    })
    console.log('ishopify', host, shop, match)
    return match
}

export const getShopifyShop = () => {
    const shop = new URLSearchParams(window.location.search).get("shop")
    return shop
}

export const isMetadrobDrobAPage = () => {
    return window.location.href.includes("/da/")
}

export const isMetadrobVSPage = () => {
    return window.location.href.includes("/vs/")
}

export const inIframe = () => {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}

const IS_DROB_A = false

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    IS_DROB_A,
    IS_SHOPIFY: isShopify(),
    getShopifyShop: getShopifyShop(), 
    inIframe
}