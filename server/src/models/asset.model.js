const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { assetTypes, ASSET_TYPES } = require('../config/assetType');

const assetSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    attribute: {
      type: Object,
      required: false,
      default: {}
    },
    thumnail: {
      type: String,
      required: false,
      trim: true,
    },
    tags: {
      type: Array,
      required: false,
      default: [],
    },
    // File name or custom value
    filePath: {
      type: String,
      required: true,
      trim: true,
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
    size: {
      type: Number,
      default: 0,
    },
    isDisabled: {
      type: Boolean,
      required: false,
      default: false
    },
    type: {
      type: Number,
      enum: assetTypes,
      default: 6,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
assetSchema.plugin(toJSON);
assetSchema.plugin(paginate);

/**
 * @typedef Asset
 */
const Asset = mongoose.model('Asset', assetSchema);

module.exports = Asset;
