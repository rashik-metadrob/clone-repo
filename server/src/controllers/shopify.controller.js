const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { shopifyService, productService, userService, projectService, userSubcriptionService } = require('../services');
const { PRODUCT_TYPES } = require('../config/productType');
const { MODEL_BLOCK, DATA_SOURCE, SHOPIFY_RECURRING_CHARGE_NAME } = require('../utils/constant');
const _ = require('lodash');
const { DATA_HELPER } = require('../utils/hepler');
const shopify = require('../shopify');
const authService = require('../services/auth.service');
const { CART_TYPES } = require('../config/productCartType');
const config = require('../config/config');

const addSession = catchAsync(async (req, res) => {
  const data = req.body;
  if (!data.shop || !data.host) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid data');
  }
  const result = await shopifyService.addSession(data);
  res.send({ errorCode: 0x0, data: result });
});

const getSession = catchAsync(async (req, res) => {
  const data = req.query;
  if (!data.shop || !data.host) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid data');
  }
  const result = await shopifyService.getSession(data);
  res.send({ errorCode: 0x0, data: result });
});

const exchangeAccessToken = catchAsync(async (req, res) => {
  const data = req.query;
  if (!data.shop || !data.code) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid data');
  }

  try {
    const result = await shopifyService.exchangeAccessToken(data);
    res.send({ errorCode: 0x0, data: result });
  } catch (error) {
    res.send({ errorCode: 0x1, err_msg: error });
  }
});

const deleteSession = catchAsync(async (req, res) => {
  const data = req.body;
  if (!data.shop || !data.host) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid data');
  }
  const result = await shopifyService.deleteSession(data);
  res.send({ errorCode: 0x0, data: result });
});

const importProductFromShop = catchAsync(async (req, res) => {
  const user = req.user;
  const data = req.query;
  if (!data.shop || !data.host) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid data');
  }

  const result = await shopifyService.getProducts(data);
  let returnData = []
  let newProducts = []
  if(result.data && result.data.products && result.data.products.length > 0){
    const shopifyProducts = result.data.products
    const productsFromShopify = shopifyProducts.map(el => {
      return {
        name: _.get(el, 'title', ""),
        image: _.get(el, ['image', 'src'], ""),
        gallery: _.get(el, 'images', []).map(o => {
          return {
            image: _.get(o, 'src', ""),
            id: DATA_HELPER.uuidv4(),
            source: DATA_SOURCE.SHOPIFY,
          }
        }).filter(o => o.image),
        objectUrl: _.get(el, ['image', 'src'], ""),
        description: _.get(el, 'description', ""),
        price: +(_.get(el, ["variants", "0", "price"], 0)),
        type: PRODUCT_TYPES.PRODUCTS,
        block: MODEL_BLOCK['2D'],
        tags: _.get(el, 'tags', "").split(",").map(o => o.trim()),
        source: DATA_SOURCE.SHOPIFY,
        shopifyProductId: _.get(el, 'id', ""),
        shopifyVariantMerchandiseId: `gid://shopify/ProductVariant/${_.get(el, ["variants", "0", "id"], "")}`,
        useThirdPartyCheckout: true,
        createdBy: user._id,
        availableForSale: _.get(el, 'availableForSale', false),
        cartType: CART_TYPES.SHOPIFY_CART
      }
    }).filter(el => el.name && el.image && el.objectUrl)

    returnData = productsFromShopify

    // newProducts = await productService.createMultiProduct(productsFromShopify)
  }
  res.send({ errorCode: 0x0, data: returnData});
});

const getAllProductFromShopifyByShopifySession = catchAsync(async (req, res) => {
  const count = await shopify.api.rest.Product.count({
    session: res.locals.shopify.session,
  });

  let data = await shopify.api.rest.Product.all({
    session: res.locals.shopify.session,
  });

  const shopifySession = _.get(res, ['locals', 'shopify', 'session'])
  const shopifyInfo = _.pick(shopifySession, ["id", "shop"])
  let user = await authService.getUserByShopifyShop(shopifyInfo.shop);

  const returnData = (_.get(data, ['data'], [])).map(el => {
    return {
      name: _.get(el, 'title', ""),
      image: _.get(el, ['image', 'src'], ""),
      gallery: _.get(el, 'images', []).map(o => {
        return {
          image: _.get(o, 'src', ""),
          id: DATA_HELPER.uuidv4(),
          source: DATA_SOURCE.SHOPIFY,
        }
      }).filter(o => o.image),
      objectUrl: _.get(el, ['image', 'src'], ""),
      description: _.get(el, 'description', ""),
      price: +(_.get(el, ["variants", "0", "price"], 0)),
      type: PRODUCT_TYPES.PRODUCTS,
      block: MODEL_BLOCK['2D'],
      tags: _.get(el, 'tags', "").split(",").map(o => o.trim()),
      source: DATA_SOURCE.SHOPIFY,
      shopifyProductId: _.get(el, 'id', ""),
      shopifyVariantMerchandiseId: _.get(el, ["variants", "0", "admin_graphql_api_id"], ""),
      useThirdPartyCheckout: true,
      createdBy: user._id,
      availableForSale: _.get(el, 'availableForSale', false),
      cartType: CART_TYPES.WEB_LINK,
      webLink: `${shopifyInfo.shop}/products/${_.get(el, 'handle', "")}`
    }
  }).filter(el => el.name && el.image && el.objectUrl)

  res.status(200).send({count, data: returnData});

});

const getPurchaseOneTimeUrlByShopifySession = catchAsync(async (req, res) => {
  const shopifySession = _.get(res, ['locals', 'shopify', 'session'])
  const { amount, currencyCode, name } = req.body

  const returnUrl = `https://${shopifySession.shop}/admin/apps/${process.env.SHOPIFY_API_KEY}`
  const client = new shopify.api.clients.Graphql({session: shopifySession});
  const data = await client.query({
    data: {
      "query": `mutation AppPurchaseOneTimeCreate($name: String!, $price: MoneyInput!, $returnUrl: URL!, $test: Boolean) {
        appPurchaseOneTimeCreate(name: $name, returnUrl: $returnUrl, price: $price, test: $test) {
          userErrors {
            field
            message
          }
          appPurchaseOneTime {
            createdAt
            id
          }
          confirmationUrl
        }
      }`,
      "variables": {
        "name": name,
        "returnUrl": returnUrl,
        "price": {
          "amount": amount,
          "currencyCode": currencyCode
        },
        "test": config.env != 'production'
      },
    },
  });

  res.send(data)
})

const getProducts = catchAsync(async (req, res) => {
  const data = req.query;
  if (!data.shop || !data.host) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid data');
  }
  const result = await shopifyService.getProducts(data);
  res.send({ errorCode: 0x0, data: result });
});

const getProductsByStoreFrontAPI = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user.shopifyAccessToken || !user.shopifyStoreName) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Your shopify store isn't set up!`);
  }
  const result = await shopifyService.getProductsByStoreFrontAPI(user.shopifyAccessToken, user.shopifyStoreName);
  let products = []
  if(result && _.get(result, ['products', 'edges'], []).length > 0){
    products = _.get(result, ['products', 'edges'], []).map(el => el.node).filter(el => el.id)
    
    products = products.map(el => {
      return {
        availableForSale: _.get(el, 'availableForSale', false),
        name: _.get(el, 'title', ""),
        image: _.get(el, ['images', 'nodes', '0', 'src'], ""),
        gallery: _.get(el, ['images', 'nodes'], []).map(o => {
          return {
            image: _.get(o, 'src', ""),
            id: DATA_HELPER.uuidv4(),
            source: DATA_SOURCE.SHOPIFY,
          }
        }).filter(o => o.image),
        objectUrl: _.get(el, ['images', 'nodes', 0, 'src'], ""),
        description: _.get(el, 'description', ""),
        price: +(_.get(el, ["variants", 'nodes', "0", "price", 'amount'], 0)),
        type: PRODUCT_TYPES.PRODUCTS,
        block: MODEL_BLOCK['2D'],
        tags: (_.get(el, 'tags', [])),
        source: DATA_SOURCE.SHOPIFY,
        // Set variant 0
        shopifyVariantMerchandiseId: _.get(el, ["variants", 'nodes', "0", "id"], ""),
        shopifyProductId: _.get(el, 'id', ""),
        useThirdPartyCheckout: true,
        createdBy: user._id,
        cartType: CART_TYPES.SHOPIFY_CART
      }
    }).filter(el => el.name && el.image && el.objectUrl && el.availableForSale)
  }
  
  res.send({ errorCode: 0x0, data: products });
});

const lookupRetailerUserBeforeHandleRoute = catchAsync(async (req, res, next) => {
  if(!req.query.storeId){
    throw new ApiError(httpStatus.BAD_REQUEST, `StoreId can't be null`);
  } else {
    const store = await projectService.getProjectById(req.query.storeId)
    if(!store || !store.createdBy){
      throw new ApiError(httpStatus.BAD_REQUEST, `Can't lookup store!`);
    } else {
      const user = await userService.getUserById(store.createdBy)
      if(!user){
        throw new ApiError(httpStatus.BAD_REQUEST, `Can't lookup retailer of store!`);
      } else {
        req.retailerUser = user

        next()
      }
    }
  }
})

const createShopifyCartByStoreFrontAPI = catchAsync(async (req, res) => {
  const user = req.retailerUser;
  if (!user.shopifyAccessToken || !user.shopifyStoreName) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Your shopify store isn't set up!`);
  }
  if (!req.body.products) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Products can't be null`);
  }
  // {merchandiseId: ...., quantity: 1}
  const products = _.get(req.body, 'products', [])

  const result = await shopifyService.createShopifyCartByStoreFrontAPI(products, user.shopifyAccessToken, user.shopifyStoreName);

  res.send(result)
})

const getShopifyCartByStoreFrontAPI = catchAsync(async (req, res) => {
  const user = req.retailerUser;
  if (!user.shopifyAccessToken || !user.shopifyStoreName) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Your shopify store isn't set up!`);
  }
  if(!req.query.shopifyCartId) {
    throw new ApiError(httpStatus.BAD_REQUEST, `ShopifyCartId can't not be null!`);
  }
  const result = await shopifyService.getShopifyCartByStoreFrontAPI(req.query.shopifyCartId, user.shopifyAccessToken, user.shopifyStoreName);

  res.send(result)
})

const updateShopifyCartItemsByStoreFrontAPI = catchAsync(async (req, res) => {
  const user = req.retailerUser;
  if (!user.shopifyAccessToken || !user.shopifyStoreName) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Your shopify store isn't set up!`);
  }
  if(!req.query.shopifyCartId) {
    throw new ApiError(httpStatus.BAD_REQUEST, `ShopifyCartId can't not be null!`);
  }
  if (!req.body.product) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Product can't be null`);
  }
  // {lineId: ...., quantity: 1}
  const product = _.get(req.body, "product", null)

  const result = await shopifyService.updateShopifyCartItemsByStoreFrontAPI(req.query.shopifyCartId, product, user.shopifyAccessToken, user.shopifyStoreName);

  res.send(result)
})

const addShopifyCartItemsByStoreFrontAPI = catchAsync(async (req, res) => {
  const user = req.retailerUser;
  if (!user.shopifyAccessToken || !user.shopifyStoreName) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Your shopify store isn't set up!`);
  }
  if(!req.query.shopifyCartId) {
    throw new ApiError(httpStatus.BAD_REQUEST, `ShopifyCartId can't not be null!`);
  }
  if (!req.body.product) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Product can't be null`);
  }
  // {merchandiseId: ...., quantity: 1}
  const product = _.get(req.body, "product", null)

  const result = await shopifyService.addShopifyCartItemsByStoreFrontAPI(req.query.shopifyCartId, product, user.shopifyAccessToken, user.shopifyStoreName);

  res.send(result)
})

const removeShopifyCartItemsByStoreFrontAPI = catchAsync(async (req, res) => {
  const user = req.retailerUser;
  if (!user.shopifyAccessToken || !user.shopifyStoreName) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Your shopify store isn't set up!`);
  }
  if(!req.query.shopifyCartId) {
    throw new ApiError(httpStatus.BAD_REQUEST, `ShopifyCartId can't not be null!`);
  }
  if (!req.body.lineIds) {
    throw new ApiError(httpStatus.BAD_REQUEST, `LineIds can't be null`);
  }
  // {LineIds: [""]}
  const lineIds = _.get(req.body, "lineIds", [])

  const result = await shopifyService.removeShopifyCartItemsByStoreFrontAPI(req.query.shopifyCartId, lineIds, user.shopifyAccessToken, user.shopifyStoreName);

  res.send(result)
})

const getCheckoutUrlByStoreFrontAPI = catchAsync(async (req, res) => {
  const user = req.retailerUser;
  if (!user.shopifyAccessToken || !user.shopifyStoreName) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Your shopify store isn't set up!`);
  }
  if(!req.query.shopifyCartId) {
    throw new ApiError(httpStatus.BAD_REQUEST, `ShopifyCartId can't not be null!`);
  }
  const result = await shopifyService.getCheckoutUrlByStoreFrontAPI(req.query.shopifyCartId, user.shopifyAccessToken, user.shopifyStoreName);

  res.send(result)
})

const requestSubscriptionForUser = catchAsync(async (req, res) => {
  const session = _.get(res, ['locals', 'shopify', 'session'])

  const hasPayment = await shopify.api.billing.check({
    session,
    plans: [SHOPIFY_RECURRING_CHARGE_NAME],
    isTest: true, //config.env !== 'production',
    returnObject: true,
  });

  if (hasPayment.hasActivePayment) {
    await userSubcriptionService.createActiveUserSubcriptionForShopifyAppSubcription(session.shop, _.get(hasPayment, ['appSubscriptions', 0], null))

    const user = await userService.getUserByShopifyShop(session.shop)
    let plan = null
    if(user) {
      const data = await userService.getPricingPlanDetail(user.id)
      plan = _.get(data, ['plan'], null)
    }
    
    res.send({
      plan: plan
    })
  } else {
    // Either request payment now (if single plan) or redirect to plan selection page (if multiple plans available), e.g.
    const confirmationUrl = await shopify.api.billing.request({
      session,
      plan: SHOPIFY_RECURRING_CHARGE_NAME,
      isTest: true, //config.env !== 'production',
      returnObject: true
    });

    await userSubcriptionService.createUserSubcriptionForShopifyAppSubcription(session.shop, _.get(confirmationUrl, ['appSubscription'], null))

    res.send({
      confirmationUrl: confirmationUrl.confirmationUrl
    })
  }
})

module.exports = {
  getSession,
  addSession,
  deleteSession,
  exchangeAccessToken,
  importProductFromShop,
  getProductsByStoreFrontAPI,
  createShopifyCartByStoreFrontAPI,
  getShopifyCartByStoreFrontAPI,
  updateShopifyCartItemsByStoreFrontAPI,
  addShopifyCartItemsByStoreFrontAPI,
  getCheckoutUrlByStoreFrontAPI,
  lookupRetailerUserBeforeHandleRoute,
  removeShopifyCartItemsByStoreFrontAPI,
  getAllProductFromShopifyByShopifySession,
  getPurchaseOneTimeUrlByShopifySession,
  requestSubscriptionForUser
};
