const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const _ = require('lodash')
const {productService, userService, authService, userSubcriptionService, projectService} = require("../services");
const shopify = require('../shopify');
const crypto = require('crypto');
const config = require('../config/config');
const { DATA_HELPER } = require('../utils/hepler');
const { DATA_SOURCE, MODEL_BLOCK, PAYMENT_STATUS, PROJECT_MODE, USER_SUBCRIPTION_KEY, SERVER_DATE_FORMAT, SHOPIFY_RECURRING_CHARGE_DAYS, USER_CONFIG_KEY } = require('../utils/constant');
const { PRODUCT_TYPES } = require('../config/productType');
const { CART_TYPES } = require('../config/productCartType');
const moment = require('moment');
const logger = require('../logger');

const onShopifyProductUpdated = catchAsync(async (req, res) => {
    try {
        // Note: the express.text() given above is an Express middleware that will read
        // in the body as a string, and make it available at req.body, for this path only.
        const rs = await shopify.api.webhooks.validate({
          rawBody: req.body, // is a string
          rawRequest: req,
          rawResponse: res,
        });

        if(rs.valid){
            req.body = JSON.parse(req.body)
            const productData = 
            _.pick(
                req.body, 
                [
                    'id', 
                    'admin_graphql_api_id', 
                    'variants', 
                    'tags',
                    'description',
                    'images',
                    'title'
                ]
            )
            if(productData.id && _.get(productData, ["variants", "0", "id"], "")){
                const shopifyProductId = productData.id
                const updateBody = {
                    tags: _.get(productData, 'tags', "").split(",").map(o => o.trim()),
                    price: +(_.get(productData, ["variants", "0", "price"], 0)),
                    shopifyVariantMerchandiseId: `gid://shopify/ProductVariant/${_.get(productData, ["variants", "0", "id"], "")}`,
                    description: _.get(productData, 'description', ""),
                    name: _.get(productData, 'title', ""),
                    image: _.get(productData, ['images', 0, 'src'], "")
                }

                await productService.updateManyProductSyncFromWebhooks(shopifyProductId, updateBody)
            }
            res.status(httpStatus.OK).send()
        } else {
            res.status(httpStatus.UNAUTHORIZED).send()
        }
    } catch (error) {
        res.status(httpStatus.OK).send()
    }
})

const onShopifyProductCreated = catchAsync(async (req, res) => {
    try {
        // Note: the express.text() given above is an Express middleware that will read
        // in the body as a string, and make it available at req.body, for this path only.
        const rs = await shopify.api.webhooks.validate({
          rawBody: req.body, // is a string
          rawRequest: req,
          rawResponse: res,
        });
        

        if(rs.valid){
            let user = await authService.getUserByShopifyShop(rs.domain);
            if(user) {
                req.body = JSON.parse(req.body)

                const newProduct = {
                    name: _.get(req.body, 'title', ""),
                    image: _.get(req.body, ['image', 'src'], ""),
                    gallery: _.get(req.body, 'images', []).map(o => {
                        return {
                            image: _.get(o, 'src', ""),
                            id: DATA_HELPER.uuidv4(),
                            source: DATA_SOURCE.SHOPIFY,
                        }
                    }).filter(o => o.image),
                    objectUrl: _.get(req.body, ['image', 'src'], ""),
                    description: _.get(req.body, 'description', ""),
                    price: +(_.get(req.body, ["variants", "0", "price"], 0)),
                    type: PRODUCT_TYPES.PRODUCTS,
                    block: MODEL_BLOCK['2D'],
                    tags: _.get(req.body, 'tags', "").split(",").map(o => o.trim()),
                    source: DATA_SOURCE.SHOPIFY,
                    shopifyProductId: _.get(req.body, 'id', ""),
                    shopifyVariantMerchandiseId: _.get(req.body, ["variants", "0", "admin_graphql_api_id"], ""),
                    useThirdPartyCheckout: true,
                    createdBy: user._id,
                    availableForSale: _.get(req.body, 'availableForSale', false),
                    cartType: CART_TYPES.SHOPIFY_CART
                }

                const product = await productService.getProductByShopifyProductId(newProduct.shopifyProductId.toString())
                if(product){
                    await productService.updateProductById(product.id, newProduct)
                } else {
                    if(newProduct.name && newProduct.objectUrl){
                        await productService.createProduct(newProduct)
                    } else {
                        res.status(httpStatus.BAD_REQUEST).send()
                        return
                    }
                }
            }
            
            res.status(httpStatus.OK).send()
        } else {
            res.status(httpStatus.UNAUTHORIZED).send()
        }
    } catch (error) {
        res.status(httpStatus.UNAUTHORIZED).send()
    }
})

const onShopifyAppUninstalled = catchAsync(async (req, res) => {
    try {
        // Note: the express.text() given above is an Express middleware that will read
        // in the body as a string, and make it available at req.body, for this path only.
        const rs = await shopify.api.webhooks.validate({
          rawBody: req.body, // is a string
          rawRequest: req,
          rawResponse: res,
        });

        if(rs.valid){
            req.body = JSON.parse(req.body)
            
            const shopData = _.pick(
                req.body, 
                [
                    'id', 
                    'domain',
                ]
            )

            let user = await userService.getUserByShopifyShop(shopData.domain)
            // Deactive shop if owner uninstall app
            if(user && user.isShopifyShopActive){
                user = await userService.updateUserById(user._id, {isShopifyShopActive: false});
            }
            if(user) {
                await userSubcriptionService.unactiveSubcription(USER_SUBCRIPTION_KEY.PRICING_PLAN, user.id)
            }

            res.status(httpStatus.OK).send()
        } else {
            res.status(httpStatus.UNAUTHORIZED).send()
        }
    } catch (error) {
        res.status(httpStatus.OK).send()
    }
})

const onWebHook = catchAsync(async (req, res) => {
    try {
        // Note: the express.text() given above is an Express middleware that will read
        // in the body as a string, and make it available at req.body, for this path only.
        const rs = await shopify.api.webhooks.validate({
          rawBody: req.body, // is a string
          rawRequest: req,
          rawResponse: res,
        });

        if(rs.valid){
            console.log('rs', rs.topic, rs.domain)
            req.body = JSON.parse(req.body)
            res.status(httpStatus.OK).send()
        } else {
            res.status(401).send("Couldn't verify incoming Webhook request!");
        }
    } catch (error) {
        console.log(error.message);
        res.status(httpStatus.BAD_REQUEST).send()
    }
})

const onAppPurchaseOneTimeUpdate = catchAsync(async (req, res) => {
    try {
        // Note: the express.text() given above is an Express middleware that will read
        // in the body as a string, and make it available at req.body, for this path only.
        const rs = await shopify.api.webhooks.validate({
          rawBody: req.body, // is a string
          rawRequest: req,
          rawResponse: res,
        });

        if(rs.valid){
            req.body = JSON.parse(req.body)

            const appPurchaseOneTimeData = _.get(req.body, ['app_purchase_one_time'])
            if(appPurchaseOneTimeData){
                const appPurchaseOneTimeId = _.get(appPurchaseOneTimeData, ['admin_graphql_api_id'])
                const appPurchaseOneTimeStatus = _.get(appPurchaseOneTimeData, ['status'])
                if(appPurchaseOneTimeId && appPurchaseOneTimeStatus == "ACTIVE"){
                    const filter = {
                        "value.appPurchaseOneTime.id": appPurchaseOneTimeId
                    }
                    const sub = await userSubcriptionService.queryUserSubcription(filter)
                    if(sub) {
                        // Deactive current subcription before active a new subcription
                        await userSubcriptionService.unactiveSubcription(USER_SUBCRIPTION_KEY.PRICING_PLAN, sub.userId)

                        await userSubcriptionService.updateUserSubcriptionById(sub.id, { paymentStatus: PAYMENT_STATUS.SUCCEEDED, active: true })

                        const userData = _.get(sub, ['value', 'userData'])
                        const { isPublishProject, projectId } = userData

                        if(isPublishProject && projectId) {
                            await projectService.updateProjectMode(projectId, { mode: PROJECT_MODE.PUBLISH })
                        }
                    }
                }
            }   

            res.status(httpStatus.OK).send()
        } else {
            res.status(401).send("Couldn't verify incoming Webhook request!");
        }
    } catch (error) {
        console.log(error.message);
        res.status(httpStatus.BAD_REQUEST).send()
    }
})

const onAppSubcriptionsUpdate = catchAsync(async (req, res) => {
    try {
        // Note: the express.text() given above is an Express middleware that will read
        // in the body as a string, and make it available at req.body, for this path only.
        const rs = await shopify.api.webhooks.validate({
          rawBody: req.body, // is a string
          rawRequest: req,
          rawResponse: res,
        });

        if(rs.valid){
            req.body = JSON.parse(req.body)

            logger.log("info", `onAppSubcriptionsUpdate ${JSON.stringify(req.body)}`)

            const appSubscriptionData = _.get(req.body, ['app_subscription'])
            if(appSubscriptionData){
                const appSubscriptionId = _.get(appSubscriptionData, ['admin_graphql_api_id'])
                const status = _.get(appSubscriptionData, ['status'])
                if(status == "ACTIVE") {
                    const filter = {
                        "value.appSubscription.id": appSubscriptionId
                    }

                    const sub = await userSubcriptionService.queryUserSubcription(filter)
                    if(sub) {
                        // Deactive current subcription before active a new subcription
                        await userSubcriptionService.unactiveSubcription(USER_SUBCRIPTION_KEY.PRICING_PLAN, sub.userId)

                        await userSubcriptionService.updateUserSubcriptionById(
                            sub.id, { 
                                paymentStatus: PAYMENT_STATUS.SUCCEEDED, 
                                active: true,
                                value: {
                                    ..._.get(sub, ['value'], {}),
                                    expiredDate: moment(new Date()).add(SHOPIFY_RECURRING_CHARGE_DAYS, 'days').toISOString()
                                }
                            }
                        )
                    }
                } else if(status == "CANCELLED") {
                    const filter = {
                        "value.appSubscription.id": appSubscriptionId
                    }

                    const sub = await userSubcriptionService.queryUserSubcription(filter)
                    if(sub) {
                        // Deactive current subcription before active a new subcription
                        await userSubcriptionService.unactiveSubcription(USER_SUBCRIPTION_KEY.PRICING_PLAN, sub.userId)

                        await userSubcriptionService.updateUserSubcriptionById(
                            sub.id, {
                                active: false,
                            }
                        )
                    }
                }
            }
            res.status(httpStatus.OK).send()
        } else {
            res.status(401).send("Couldn't verify incoming Webhook request!");
        }
    } catch (error) {
        console.log(error.message);
        res.status(httpStatus.BAD_REQUEST).send()
    }
})

const handleWebhookRequest = async (
    topic,
    shop,
    webhookRequestBody,
    webhookId,
    apiVersion,
  ) => {
    const sessionId = shopify.session.getOfflineId(shop);
    console.log(
        '---WEBHOOK', 
        sessionId,  
        topic,
        shop,
        webhookRequestBody,
        webhookId,
        apiVersion,
    )
    // Run your webhook-processing code here!
};

const verifyWebhook = catchAsync(async (req, res, next) => {
    let hmac = "";

    _.entries(_.get(req, ['headers'], {})).forEach(([key, value]) => {
        if(key.toLowerCase() == 'x-shopify-hmac-sha256'){
            hmac = value
        }
    });

    const genHash = crypto
        .createHmac("sha256", config.shopify.shopifyClientSecret)
        .update(req.body)
        .digest("base64");
    // const genHash = await createSHA256HMAC(config.shopify.shopifyClientSecret, JSON.stringify(req.body), 'base64')

    if (!safeCompare(genHash, hmac)) {
        res.status(401).send("Couldn't verify incoming Webhook request!");
    } else {
        req.body = JSON.parse(req.body.toString())
        next()
    }
})

const safeCompare = (strA, strB) => {
    if (typeof strA === typeof strB) {
      const enc = new TextEncoder();
      const buffA = enc.encode(JSON.stringify(strA));
      const buffB = enc.encode(JSON.stringify(strB));
  
      if (buffA.length === buffB.length) {
        return timingSafeEqual(buffA, buffB);
      }
    } else {
        return false
    }
    return false;
};

function timingSafeEqual(bufA, bufB) {
    const viewA = new Uint8Array(bufA);
    const viewB = new Uint8Array(bufB);
    let out = 0;
    for (let i = 0; i < viewA.length; i++) {
      out |= viewA[i] ^ viewB[i];
    }
    return out === 0;
}

async function createSHA256HMAC(
    secret,
    payload,
    returnFormat = 'base64',
){
    const cryptoLib =
      typeof crypto.webcrypto === 'undefined'
        ? crypto
        : crypto.webcrypto;
  
    const enc = new TextEncoder();
    const key = await cryptoLib.subtle.importKey(
      'raw',
      enc.encode(secret),
      {
        name: 'HMAC',
        hash: {name: 'SHA-256'},
      },
      false,
      ['sign'],
    );
  
    const signature = await cryptoLib.subtle.sign(
      'HMAC',
      key,
      enc.encode(payload),
    );
    return returnFormat === 'base64'
      ? asBase64(signature)
      : asHex(signature);
}

function asHex(buffer) {
    return [...new Uint8Array(buffer)]
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('');
}

const LookupTable =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
function asBase64(buffer) {
    let output = '';
  
    const input = new Uint8Array(buffer);
    for (let i = 0; i < input.length; ) {
      const byte1 = input[i++];
      const byte2 = input[i++];
      const byte3 = input[i++];
  
      const enc1 = byte1 >> 2;
      const enc2 = ((byte1 & 0b00000011) << 4) | (byte2 >> 4);
      let enc3 = ((byte2 & 0b00001111) << 2) | (byte3 >> 6);
      let enc4 = byte3 & 0b00111111;
  
      if (isNaN(byte2)) {
        enc3 = 64;
      }
      if (isNaN(byte3)) {
        enc4 = 64;
      }
  
      output +=
        LookupTable[enc1] +
        LookupTable[enc2] +
        LookupTable[enc3] +
        LookupTable[enc4];
    }
    return output;
}

const onShopifyDataRequest = catchAsync(async (req, res) => {
    res.status(httpStatus.OK).send()
})

const onShopifyCustomersRedact = catchAsync(async (req, res) => {
    res.status(httpStatus.OK).send()
})

const onShopifyShopRedact = catchAsync(async (req, res) => {
    res.status(httpStatus.OK).send()
})

module.exports = {
    onShopifyProductUpdated,
    onShopifyDataRequest,
    onShopifyCustomersRedact,
    onShopifyShopRedact,
    handleWebhookRequest,
    onShopifyAppUninstalled,
    onWebHook,
    onShopifyProductCreated,
    verifyWebhook,
    onAppPurchaseOneTimeUpdate,
    onAppSubcriptionsUpdate
};