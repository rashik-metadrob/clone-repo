const { BillingInterval, LATEST_API_VERSION, BillingReplacementBehavior } = require("@shopify/shopify-api");
const { shopifyApp } = require("@shopify/shopify-app-express");
const { restResources } = require("@shopify/shopify-api/rest/admin/2023-04");
const dotenv = require('dotenv')
dotenv.config()
const DB_PATH = `${process.cwd()}/database.sqlite`;
const {MongoDBSessionStorage} = require('@shopify/shopify-app-session-storage-mongodb');
const config = require("./config/config");
const { SHOPIFY_RECURRING_CHARGE_NAME, SHOPIFY_RECURRING_CHARGE_AMOUNT } = require("./utils/constant");

// The transactions with Shopify will always be marked as test transactions, unless NODE_ENV is production.
// See the ensureBilling helper to learn more about billing in this template.
const billingConfig = {
  "My Shopify One-Time Charge": {
    // This is an example configuration that would do a one-time charge for $5 (only USD is currently supported)
    amount: 5.0,
    currencyCode: "USD",
    interval: BillingInterval.OneTime,
  },
};

console.log('__INIT SHOPIFY__', process.env.SHOPIFY_API_KEY, process.env.SHOPIFY_API_SECRET)
const shopify = shopifyApp({
  api: {
    apiVersion: LATEST_API_VERSION,
    restResources,
    billing: {
      [SHOPIFY_RECURRING_CHARGE_NAME]: {
        replacementBehavior: BillingReplacementBehavior.ApplyImmediately,
        trialDays: 14,
        lineItems: [
          {
            interval: BillingInterval.Every30Days,
            amount: SHOPIFY_RECURRING_CHARGE_AMOUNT,
            currencyCode: "USD",
          }
        ],
      },
    }, // or replace with billingConfig above to enable example billing
    scopes: [
      'write_products', 
      // 'unauthenticated_read_checkouts', 
      // 'unauthenticated_write_checkouts', 
      // 'unauthenticated_read_customers', 
      // 'unauthenticated_write_customers', 
      // 'unauthenticated_read_customer_tags',
      // 'unauthenticated_read_content',
      // 'unauthenticated_read_metaobjects',
      // 'unauthenticated_read_product_inventory',
      // 'unauthenticated_read_product_listings',
      // 'unauthenticated_read_product_pickup_locations',
      // 'unauthenticated_read_product_tags',
      // 'unauthenticated_read_selling_plans'
    ],
    apiKey: process.env.SHOPIFY_API_KEY,
    apiSecretKey: process.env.SHOPIFY_API_SECRET,
    hostName: process.env.HOST_NAME,
  },
  auth: {
    path: "/shopify/auth",
    callbackPath: "/shopify/auth/callback",
  },
  webhooks: {
    path: "/v1/webhooks",
  },
  // This should be replaced with your preferred storage strategy
  sessionStorage: new MongoDBSessionStorage(
    config.mongoose.url,
    config.mongoose.databaseName
  ),
});

module.exports = shopify;
