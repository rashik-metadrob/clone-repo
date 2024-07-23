const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { productTypes, PRODUCT_TYPES } = require('../config/productType');
const { CURRENCY, DEFAULT_PRODUCT, CONTENT_TYPE, MODEL_BLOCK, DATA_SOURCE } = require('../utils/constant');
const { availableAnimations, AVAILABLE_ANIMATION } = require('../config/availableAnimation');
const { cartTypes, CART_TYPES } = require('../config/productCartType');
const { placeholderSizes, PLACEHOLDER_SIZES } = require('../config/placeholderSize');

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    // Image can't be null when product is PLACEHOLDER
    image: {
      type: String,
      required: false,
      trim: true,
    },
    gallery: {
      type: Array,
      required: false,
      default: []
    },
    isDisabled: {
      type: Boolean,
      required: false,
      default: false
    },
    objectUrl: {
      type: String,

      // No required objectUrl when prod is Placeholder
      required: false,
      trim: true,
    },
    isCompressing: {
      type: Boolean,
      default: false
    },
    sku: {
      type: String,
      required: false,
      default: "",
    },
    description: {
      type: String,
      required: false,
      trim: true,
      default: ""
    },
    specification: {
      type: String,
      required: false,
      trim: true,
      default: ""
    },
    price: {
      type: Number,
      required: false,
      default: 0
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
    discount: {
      type: Number,
      required: false,
      default: 0
    },
    displayCurrency: {
      type: String,
      required: false,
      default: CURRENCY.USD
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false
    },
    type: {
      type: Number,
      enum: productTypes,
      default: PRODUCT_TYPES.DECORATIVES,
    },
    cartType: {
      type: Number,
      enum: cartTypes,
      default: CART_TYPES.METADROB_CART,
    },
    // Only used webLink for product has cartType equal WEB_LINK
    webLink: {
      type: String,
      required: false,
      default: ""
    },
    availableAnimation: {
      type: Number,
      required: false,
      enum: availableAnimations,
      default: AVAILABLE_ANIMATION.PLAY_NEVER,
    },
    // List ObjectId of pricing plans
    plans: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "PricingPlan"
    }],
    // List ObjectId of product category
    // Only used for PLACEHOLDER
    includedCategoriesIds: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductCategory"
    }],
    contentType: {
      type: Number,
      required: false,
      enum: [CONTENT_TYPE.GENERAL, CONTENT_TYPE.SPECIAL],
      default: CONTENT_TYPE.GENERAL
    },
    block: {
      type: String,
      enum: [MODEL_BLOCK['2D'], MODEL_BLOCK['3D']],
      default: DEFAULT_PRODUCT.BLOCK
    },
    tags: {
      type: Array,
      required: false,
      default: []
    },
    dimensions: {
      type: Object,
      required: false,
      default: DEFAULT_PRODUCT.DIMENSIONS
    },
    actualWeight: {
      type: Number,
      required: false,
      default: DEFAULT_PRODUCT.ACTUALWEIGHT
    },
    shopifyVariantMerchandiseId: {
      type: String,
      required: false,
      default: ""
    },
    shopifyProductId: {
      type: String,
      required: false,
      default: ""
    },
    source: {
      type: String,
      required: false,
      enum: [DATA_SOURCE.SHOPIFY, DATA_SOURCE.UPLOAD],
      default: DATA_SOURCE.UPLOAD
    },
    useThirdPartyCheckout: {
      type: Boolean,
      required: false,
      default: false
    },
    attributes: {
      type: Object,
      required: false,
      default: null
    },
    // Unique string to define imported product from csv file
    uniqueId: {
      type: String,
      required: false,
      default: ""
    },
    // Only used for placeholder
    placeholderType: {
      type: Number,
      required: false,
      enum: placeholderSizes,
      default: PLACEHOLDER_SIZES.SMALL
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId
    },
    size: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
productSchema.plugin(toJSON);
productSchema.plugin(paginate);

/**
 * @typedef Product
 */
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
