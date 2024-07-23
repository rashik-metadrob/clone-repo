const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const CONSTANTS = require("../utils/constant")

const trackingSchema = mongoose.Schema(
    {
      trackingContainerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      trackings: {
        type: Array,
        required: true,
        trim: true,
        default: []
      },
      containerCreatedBy: {
        type: mongoose.Schema.Types.ObjectId
      },
      type: {
        type: String,
        required: true,
        enum: CONSTANTS.TRACKING_TYPE_ENUM,
        default: 'store',
      }
    },
    {
      timestamps: true,
    }
  );
  
  // add plugin that converts mongoose to json
  trackingSchema.plugin(toJSON);
  trackingSchema.plugin(paginate);
  
  /**
   * @typedef Tracking
   */
  const Tracking = mongoose.model('Tracking', trackingSchema);
  
  module.exports = Tracking;