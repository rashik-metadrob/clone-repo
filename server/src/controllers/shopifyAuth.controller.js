const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const axios = require("axios")
const { authService, userService, tokenService, emailService, productCategoryService } = require('../services');
const config = require('../config/config');
const { User } = require('../models');
const _ = require('lodash');
const { WARNING_TEXTS } = require('../utils/constant');
const { roles } = require('../config/roles');
const shopify = require('../shopify');
const { ACCOUNT_SOURCES } = require('../config/accountSource');
const { GraphQLClient, gql } = require('graphql-request')

const retriveMetadrobUserFromShopifySession = catchAsync(async (req, res) => {
    // Example data
    // {
    //     "id": "offline_quickstart-28ce93ff.myshopify.com",
    //     "shop": "quickstart-28ce93ff.myshopify.com",
    //     "state": "830480681088223",
    //     "isOnline": false,
    //     "scope": "write_products",
    //     "accessToken": "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"
    // }
    try {
      const shopifySession = _.get(res, ['locals', 'shopify', 'session'])
      const shopifyInfo = _.pick(shopifySession, ["id", "shop"])

      if(shopifyInfo.id && shopifyInfo.shop) {
        const newUser = {
          password: config.defaultPassword,
          name: shopifyInfo.shop,
          role: "retailers",
          // ShopId is Shop domain
          shopifyShop: shopifyInfo.shop
        }
        if (await User.isShopifyShopTaken(newUser.shopifyShop)) {
          let user = await authService.getUserByShopifyShop(newUser.shopifyShop);
          if(!user.isShopifyShopActive){
            user = await userService.updateUserById(user._id, {isShopifyShopActive: true});
          }
          // Register webhook
          const response = await shopify.api.webhooks.register(
            {
              session: shopifySession,
            }
          )
          const added = await shopify.api.webhooks.getTopicsAdded()
          
          const tokens = await tokenService.generateAuthTokens(user);
          res.send({ user, tokens });
        } else {
          let user = await userService.createUser(newUser);

          // Register webhook
          const response = await shopify.api.webhooks.register(
            {
              session: shopifySession,
            }
          )
          const added = await shopify.api.webhooks.getTopicsAdded()

          const tokens = await tokenService.generateAuthTokens(user);
          res.send({ user, tokens });
        }
      } else {
        res.status(httpStatus.BAD_REQUEST).send({message: WARNING_TEXTS.CANT_GET_SHOPIFY_SESSION})
      }
    }
    catch (err) {
      console.log('GET USER ERR', _.get(err, ['message']))
      res.status(httpStatus.BAD_REQUEST).send({message: WARNING_TEXTS.CANT_GET_SHOPIFY_SESSION})
    }
});

const retriveRefreshTokenFromShopifySession = catchAsync(async (req, res) => {
  const shopifySession = _.get(res, ['locals', 'shopify', 'session'])
  const shopifyInfo = _.pick(shopifySession, ["id", "shop"])

  const user = await authService.getUserByShopifyShop(shopifyInfo.shop);
  if (user) {
    const tokens = await tokenService.generateAuthTokens(user, false);
    res.send({ ...tokens });
  } else {
    res.status(httpStatus.UNAUTHORIZED).send({message: 'Please authenticate'})
  }
})

const createNewUserOrActiveUser = async (req, res, next) => {
  const shopifySession = _.get(res, ['locals', 'shopify', 'session'])
  const shopifyInfo = _.pick(shopifySession, ["id", "shop"])
  const newUser = {
    password: config.defaultPassword,
    name: shopifyInfo.shop,
    role: "retailers",
    // ShopId is Shop domain
    shopifyShop: shopifyInfo.shop,
    source: ACCOUNT_SOURCES.SHOPIFY
  }

  const shop = await shopify.api.rest.Shop.all({
    session: shopifySession
  })
  if(shop){
    newUser.shopifyShopEmail = _.get(shop, ['data', 0, 'email'])
  }

  if(shopifyInfo.id && shopifyInfo.shop) {
    if (await User.isShopifyShopTaken(newUser.shopifyShop)) {
      let user = await authService.getUserByShopifyShop(newUser.shopifyShop);
      if(!user.isShopifyShopActive){
        user = await userService.updateUserById(
          user._id, 
          {
            isShopifyShopActive: true,
            source: ACCOUNT_SOURCES.SHOPIFY
          }
        );
      }
      // Register webhook
      await shopify.api.webhooks.register(
        {
          session: shopifySession,
        }
      )

      await handleStoreFrontApi(user, shopifySession, newUser)
      
      req.user = user
    } else {
      let user = await userService.createUser(newUser);

      // Register webhook
      const response = await shopify.api.webhooks.register(
        {
          session: shopifySession,
        }
      )
      const added = await shopify.api.webhooks.getTopicsAdded()

      await handleStoreFrontApi(user, shopifySession, newUser)

      req.user = user
    }

    console.log('NEXT AFTER CATCH')
    next()
  }
}

const handleStoreFrontApi = async (user, shopifySession, newUser) => {
  try {
    const allStorefrontAccessTokens = await shopify.api.rest.StorefrontAccessToken.all({
      session: shopifySession,
    });
  
    const storeFrontTokens = _.get(allStorefrontAccessTokens, ['data'], [])
    if(storeFrontTokens.length > 0){
      if(!_.some(storeFrontTokens, (el) => el.access_token == _.get(user, ['shopifyAccessToken'], ''))){
        user = await userService.updateUserById(
          user._id, 
          {
            shopifyAccessToken: _.get(storeFrontTokens, ['0', 'access_token'], ''), 
            shopifyStoreName: newUser.shopifyShop
          }
        )
      }
    } else {
      const storefrontAccessToken = new shopify.api.rest.StorefrontAccessToken({session: shopifySession});
      storefrontAccessToken.title = "Metadrob Store Front Access Token";
      await storefrontAccessToken.save({
        update: true,
      });
      user = await userService.updateUserById(
        user._id, 
        {
          shopifyAccessToken: _.get(storefrontAccessToken, ['access_token'], ''), 
          shopifyStoreName: newUser.shopifyShop
        }
      )
    }

    console.log("INIT STORE FRONT TOKEN SUCCESSFULLY!")
  } catch(err) {
    console.log("INIT STORE FRONT TOKEN FAIL!", _.get(err, ['message']))
  }
}

const syncCollectionFromShopify = async (req, res, next) => {
 
  const shopifySession = _.get(res, ['locals', 'shopify', 'session'])
  const graphQLClient = new shopify.api.clients.Graphql({session: shopifySession});

  const query = `
    query {
      collections(first: 100) {
        edges {
          node {
            id
            title
            handle
            updatedAt
            productsCount
            sortOrder
          }
        }
      }
    }
  `

  const datas = await graphQLClient.query({
    data: query,
  });
  // const collections = await shopify.api.rest.Collections.all({
  //   session: shopifySession
  // });
  console.log('collections', datas)

  
  const userId = req.user._id || req.user.id
  if(userId){

  }
  next()
}

module.exports = {
  retriveMetadrobUserFromShopifySession,
  retriveRefreshTokenFromShopifySession,
  createNewUserOrActiveUser,
  syncCollectionFromShopify
};