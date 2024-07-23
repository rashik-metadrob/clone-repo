const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { PLACEHOLDER_SIZES, placeholderSizes } = require('../config/placeholderSize');
const { DEFAULT_PRODUCT } = require('../utils/constant');

const placeholderSchema = mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: false,
      default: ""
    },
    createdBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
    placeholderType: {
      type: Number,
      required: false,
      enum: placeholderSizes,
      default: PLACEHOLDER_SIZES.SMALL
    },
    dimensions: {
      type: Object,
      required: false,
      default: DEFAULT_PRODUCT.DIMENSIONS
    }
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
placeholderSchema.plugin(toJSON);
placeholderSchema.plugin(paginate);

/**
 * @typedef Placeholder
 */
const Placeholder = mongoose.model('Placeholder', placeholderSchema);

module.exports = Placeholder;
