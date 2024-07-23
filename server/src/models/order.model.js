const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { PAYMENT_GATE, PAYMENT_STATUS, SHIPMENT_STATUS } = require('../utils/constant');

const orderSchema = mongoose.Schema(
  {
    billingAddress: {
      type: Object,
      required: true,
    },
    shippingAddress: {
        type: Object,
        required: true,
    },
    delivery: {
        type: Object,
        required: true,
    },
    items: {
        type: Array,
        required: true,
    },
    rateSetting: {
        type: Object,
        required: true,
    },
    cartAmount: {
      type: Number,
      required: true,
    },
    deliveryAmount: {
        type: Number,
        required: true,
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    paymentGate: {
        type: String,
        required: true,
        default: PAYMENT_GATE.STRIPE
    },
    paymentStatus: {
        type: Number,
        enum: [PAYMENT_STATUS.NOT_PAYMENT, PAYMENT_STATUS.PROCESSING, PAYMENT_STATUS.FAIL, PAYMENT_STATUS.SUCCEEDED],
        required: true,
    },
    shipmentStatus: {
        type: Number,
        enum: [SHIPMENT_STATUS.NOT_SHIPMENT, SHIPMENT_STATUS.CREATED],
        required: true,
    },
    stripeIntentSecret: {
        type: String,
        required: false,
    },
    //OrderId
    paypalOrderId: {
        type: String,
        required: false,
    },
    isDeleted: {
        type: Boolean,
        required: false,
        default: false
    },
    easyshipShipmentId: {
        type: String,
        required: false,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    }
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
orderSchema.plugin(toJSON);
orderSchema.plugin(paginate);

/**
 * @typedef Order
 */
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
