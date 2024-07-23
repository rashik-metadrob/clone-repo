const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const shopifySessionSchema = mongoose.Schema(
  {
    shop: {
      type: String,
      required: true,
      trim: true
    },
    host: {
      type: String,
      required: true,
      trim: true
    },
    code: {
      type: String,
      required: false,
      trim: true
    },
    accessToken: {
      type: String,
      required: false,
      trim: true
    },
    isRegisteredWebhooks: {
      type: Boolean,
      required: false,
      default: false
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
shopifySessionSchema.plugin(toJSON);
shopifySessionSchema.plugin(paginate);

const ShopifySession = mongoose.model('ShopifySession', shopifySessionSchema);

module.exports = ShopifySession;
