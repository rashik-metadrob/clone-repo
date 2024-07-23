
// import {shopifyApi, LATEST_API_VERSION} from '@shopify/shopify-api';
// import axios from 'axios';

require('@shopify/shopify-api/adapters/node');
const {shopifyApi, LATEST_API_VERSION} = require('@shopify/shopify-api')
const axios = require('axios')
const { GraphQLClient, gql } = require('graphql-request')
const _ = require("lodash")

const { ShopifySession } = require('../models');
const ApiError = require('../utils/ApiError');
const config = require('../config/config');



const addSession = async (data) => {
    const existSession = await ShopifySession.findOne({shop: data.shop, host: data.host});
    let accessToken = ''

    try {
        accessToken = await exchangeAccessToken(data)
    } catch (error) {
        console.log(error)
    }

    if (existSession) {
        Object.assign(existSession, data);

      if(accessToken){
        existSession.accessToken = accessToken
        await registerWebhooks(data.shop, accessToken)
      }

      if(!existSession.isRegisteredWebhooks){
        await registerWebhooks(data.shop, accessToken)
      }
      
      return existSession.save();
    }
    else{
      await registerWebhooks(data.shop, accessToken)
      return ShopifySession.create({...data, accessToken});
    }
};
// Register webhook
async function registerWebhooks(shop, accessToken) {
  return axios.post(
    `https://${shop}/admin/api/2023-10/webhooks.json`, 
    {
      "webhook":{
        "address":`${config.serverUrl}/v1/webhooks/product-updated`,
        "topic":"products/update",
        "format":"json"
      }
    },
    { headers: { 'X-Shopify-Access-Token': accessToken }}
  ).then(async data => {
    const existSession = await ShopifySession.findOne({shop: shop, accessToken: accessToken});
    if(existSession){
      Object.assign(existSession, {isRegisteredWebhooks: true});
      await existSession.save()
    }
  }).catch(async err => {
    if(_.get(err, ['response', 'status'], 0) == 422){
      const existSession = await ShopifySession.findOne({shop: shop, accessToken: accessToken});
      if(existSession){
        Object.assign(existSession, {isRegisteredWebhooks: true});
        await existSession.save()
      }
    }
  })
}

async function getProducts({shop, host}){
    const session = await ShopifySession.findOne({shop, host})
    if(!session){
        throw new ApiError(httpStatus.BAD_REQUEST, 'session not found');
    }

    return axios.get(`https://${shop}/admin/api/2023-10/products.json`, { headers: { 'X-Shopify-Access-Token': session.accessToken }})
}

const getSession = async ({shop, host}) => {
  const existSession = await ShopifySession.findOne({shop, host})
  if(existSession && !existSession.isRegisteredWebhooks){
    await registerWebhooks(shop, existSession.accessToken)
  }
    
  return existSession
};

const deleteSession = async ({shop, host}) => {
    return ShopifySession.deleteMany({ shop, host });
};

function exchangeAccessToken({shop, code}){
    const query = new URLSearchParams({
        client_id: process.env.SHOPIFY_API_KEY,
        client_secret: process.env.SHOPIFY_API_SECRET,
        code: code
    }).toString()
    const host = `https://${shop}/admin/oauth/access_token?${query}`
    return axios.post(host, {}).then(rs => {
        console.log('result exchange access token', rs.data);
        return rs.data.access_token
    })
}

const getProductsByStoreFrontAPI = async (storefrontAccessToken, shop) => {
    const endpoint = `https://${shop}/api/2023-10/graphql.json`
    const graphQLClient = new GraphQLClient(endpoint, {
        headers: {
          'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
        },
    })
    const query = gql`
        {
            products(first: 250) {
                edges {
                    cursor
                    node {
                        availableForSale
                        createdAt
                        description
                        id
                        tags
                        title
                        images(first: 250) {
                            nodes {
                                id
                                src
                            }
                        }
                        variants(first: 250) {
                            nodes {
                                id
                                sku
                                title
                                weight
                                weightUnit
                                price {
                                    amount
                                    currencyCode
                                }
                            }
                        }
                    }
                }
            }
        }
    `
    
    const data = await graphQLClient.request(query)

    return data
};

const getShopifyCartByStoreFrontAPI = async ( shopifyCartId, storefrontAccessToken, shop) => {
  const endpoint = `https://${shop}/api/2023-10/graphql.json`
  const graphQLClient = new GraphQLClient(endpoint, {
      headers: {
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
      },
  })

  const query = gql`
  query {
    cart(
      id: "${shopifyCartId}"
    ) {
      id
      createdAt
      updatedAt
      lines(first: 250) {
        edges {
          node {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
              }
            }
            attributes {
              key
              value
            }
          }
        }
      }
      attributes {
        key
        value
      }
      cost {
        totalAmount {
          amount
          currencyCode
        }
        subtotalAmount {
          amount
          currencyCode
        }
        totalTaxAmount {
          amount
          currencyCode
        }
        totalDutyAmount {
          amount
          currencyCode
        }
      }
      buyerIdentity {
        email
        phone
        customer {
          id
        }
        countryCode
        deliveryAddressPreferences {
          ... on MailingAddress {
            address1
            address2
            city
            provinceCode
            countryCodeV2
            zip
          }
        }
      }
    }
  }
  `

  const data = await graphQLClient.request(query)

  return data
}

const createShopifyCartByStoreFrontAPI = async (products, storefrontAccessToken, shop) => {
    const endpoint = `https://${shop}/api/2023-10/graphql.json`
    const graphQLClient = new GraphQLClient(endpoint, {
        headers: {
          'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
        },
    })

    let productDatas = ''

    products.forEach((el, index) => {
        productDatas += `{quantity: ${el.quantity}, merchandiseId: "${el.merchandiseId}"}${index != products.length - 1 ? ',' : ''}`
    })

    const query = gql`mutation {
        cartCreate(
          input: {
            lines: [
              ${productDatas}
            ],
            # The information about the buyer that's interacting with the cart.
            buyerIdentity: {
              # email: "example@example.com",
              # countryCode: CA,
              # An ordered set of delivery addresses associated with the buyer that's interacting with the cart. The rank of the preferences is determined by the order of the addresses in the array. You can use preferences to populate relevant fields in the checkout flow.
              # deliveryAddressPreferences: {
                # deliveryAddress: {
                #   address1: "150 Elgin Street",
                #   address2: "8th Floor",
                #   city: "Ottawa",
                #   province: "Ontario",
                #   country: "CA",
                #   zip: "K2P 1L4"
                # },
              # }
            }
            attributes: {
              key: "cart_attribute",
              value: "This is a cart attribute"
            }
          }
        ) {
          cart {
            id
            createdAt
            updatedAt
            lines(first: 250) {
              edges {
                node {
                  id
                  merchandise {
                    ... on ProductVariant {
                      id
                    }
                  }
                }
              }
            }
            buyerIdentity {
              deliveryAddressPreferences {
                __typename
              }
            }
            attributes {
              key
              value
            }
            # The estimated total cost of all merchandise that the customer will pay at checkout.
            cost {
              totalAmount {
                amount
                currencyCode
              }
              # The estimated amount, before taxes and discounts, for the customer to pay at checkout.
              subtotalAmount {
                amount
                currencyCode
              }
              # The estimated tax amount for the customer to pay at checkout.
              totalTaxAmount {
                amount
                currencyCode
              }
              # The estimated duty amount for the customer to pay at checkout.
              totalDutyAmount {
                amount
                currencyCode
              }
            }
          },
          userErrors {
            code
            field
            message
          }
        }
    }`
    
    const data = await graphQLClient.request(query)

    return data
}

const updateShopifyCartItemsByStoreFrontAPI = async (shopifyCartId, product, storefrontAccessToken, shop) => {
  const endpoint = `https://${shop}/api/2023-10/graphql.json`
  const graphQLClient = new GraphQLClient(endpoint, {
      headers: {
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
      },
  })

  const query = gql`
    mutation {
      cartLinesUpdate(
        cartId: "${shopifyCartId}"
        lines: {
          id: "${product.lineId}"
          quantity: ${product.quantity}
        }
      ) {
        cart {
          id
          lines(first: 250) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                  }
                }
              }
            }
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
            subtotalAmount {
              amount
              currencyCode
            }
            totalTaxAmount {
              amount
              currencyCode
            }
            totalDutyAmount {
              amount
              currencyCode
            }
          }
        },
        userErrors {
          code
          field
          message
        }
      }
    }
  `

  const data = await graphQLClient.request(query)

  return data
}

const removeShopifyCartItemsByStoreFrontAPI = async (shopifyCartId, lineIds, storefrontAccessToken, shop) => {
  const endpoint = `https://${shop}/api/2023-10/graphql.json`
  const graphQLClient = new GraphQLClient(endpoint, {
      headers: {
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
      },
  })

  let lineDatas = ``

  lineIds.forEach((el, index) => {
    lineDatas += `"${el}"${index != lineIds.length - 1 ? ',' : ''}`
  })

  const query = gql`
    mutation {
      cartLinesRemove(
        cartId: "${shopifyCartId}"
        lineIds: [${lineDatas}]
      ) {
        cart {
          id
          lines(first: 250) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                  }
                }
              }
            }
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
            subtotalAmount {
              amount
              currencyCode
            }
            totalTaxAmount {
              amount
              currencyCode
            }
            totalDutyAmount {
              amount
              currencyCode
            }
          }
        },
        userErrors {
          code
          field
          message
        }
      }
    }
  `

  const data = await graphQLClient.request(query)

  return data
}

const addShopifyCartItemsByStoreFrontAPI = async (shopifyCartId, product, storefrontAccessToken, shop) => {
  const endpoint = `https://${shop}/api/2023-10/graphql.json`
  const graphQLClient = new GraphQLClient(endpoint, {
      headers: {
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
      },
  })

  const query = gql`
    mutation {
      cartLinesAdd(
        cartId: "${shopifyCartId}"
        lines: {
          merchandiseId: "${product.merchandiseId}"
          quantity: ${product.quantity}
        }
      ) {
        cart {
          id
          lines(first: 250) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                  }
                }
              }
            }
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
            subtotalAmount {
              amount
              currencyCode
            }
            totalTaxAmount {
              amount
              currencyCode
            }
            totalDutyAmount {
              amount
              currencyCode
            }
          }
        },
        userErrors {
          code
          field
          message
        }
      }
    }
  `

  const data = await graphQLClient.request(query)

  return data
}

const getCheckoutUrlByStoreFrontAPI = async (shopifyCartId, storefrontAccessToken, shop) => {
  const endpoint = `https://${shop}/api/2023-10/graphql.json`
  const graphQLClient = new GraphQLClient(endpoint, {
      headers: {
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
      },
  })

  const query = gql`
    query checkoutURL {
      cart(id: "${shopifyCartId}") {
        checkoutUrl
      }
    }
  `

  const data = await graphQLClient.request(query)

  return data
}

module.exports = {
    addSession,
    getSession,
    deleteSession,
    exchangeAccessToken,
    getProducts,
    getProductsByStoreFrontAPI,
    createShopifyCartByStoreFrontAPI,
    getShopifyCartByStoreFrontAPI,
    updateShopifyCartItemsByStoreFrontAPI,
    addShopifyCartItemsByStoreFrontAPI,
    getCheckoutUrlByStoreFrontAPI,
    removeShopifyCartItemsByStoreFrontAPI
};