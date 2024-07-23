const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { PRICING_PLAN_DISPLAY } = require('../utils/constant');

const pricingPlanSchema = mongoose.Schema(
  {
    isFree: {
      type: Boolean,
      required: false,
      default: false
    },
    isDrobA: {
      type: Boolean,
      required: false,
      default: false
    },
    // This plan is aplly for Shopify version
    isDefaultForShopify: {
      type: Boolean,
      required: false,
      default: false
    },
    name: {
      type: String,
      required: true,
      default: ""
    },
    description: {
      type: String,
      required: false,
      default: ""
    },
    display: {
      type: String,
      required: false,
      // enum: [PRICING_PLAN_DISPLAY.NONE, PRICING_PLAN_DISPLAY.FIRST, PRICING_PLAN_DISPLAY.SECOND, PRICING_PLAN_DISPLAY.THIRD],
      default: PRICING_PLAN_DISPLAY.NONE
    },
    isRecommended: {
      type: Boolean,
      required: false,
      default: false
    },
    pricing: {
      type: Object,
      required: true,
    },
    features: {
      type: mongoose.Schema.Types.Array,
      required: true,
    },
    includedInfomation: {
      type: mongoose.Schema.Types.Array,
      required: true
    },
    isDeleted: {
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
pricingPlanSchema.plugin(toJSON);
pricingPlanSchema.plugin(paginate);

/**
 * @typedef PricingPlan
 */
const PricingPlan = mongoose.model('PricingPlan', pricingPlanSchema);

module.exports = PricingPlan;
