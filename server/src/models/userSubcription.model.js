const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const constants = require("../utils/constant")

const userSubcriptionSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    key: {
      type: String,
      required: true,
    },
    /**
     * {
     * amount: number,
     * pricingId: string,
     * numOfDate: number, // Total days of pricing plan payper
     * createdDate: Date,
     * expiredDate: Date,
     * paymentGate: String // STRIPE, PAYPAL, SHOPIFY_BILLING
     * appPurchaseOneTime: Object// Only with SHOPIFY_BILLING
     * stripeIntentSecret: String // Only with STRIPE
     * paypalOrderId: String // Only with PAYPAL
     * isTrial: Boolean // Is trial period subscription
     * }
     */
    value: {
      type: Object,
      required: true,
    },
    paymentStatus: {
      type: Number,
      required: false,
      default: constants.PAYMENT_STATUS.NOT_PAYMENT
    },
    assignedBy: {
      type: String,
      enum: [constants.USER_SUBCRIPTION_ASSIGNED_BY.SUPER_ADMIN, constants.USER_SUBCRIPTION_ASSIGNED_BY.SYSTEM],
      default: constants.USER_SUBCRIPTION_ASSIGNED_BY.SYSTEM
    },
    active: {
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
userSubcriptionSchema.plugin(toJSON);
userSubcriptionSchema.plugin(paginate);

/**
 * @typedef UserSubscription
 */
const UserSubscription = mongoose.model('UserSubscription', userSubcriptionSchema);

module.exports = UserSubscription;
