const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { DATA_SOURCE, CATEGORY_TYPE } = require('../utils/constant');

const productCategorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
    isDefaultCategory: {
      type: Boolean,
      default: false
    },
    type: {
      type: Number,
      required: false,
      enum: [CATEGORY_TYPE.DECORATIVE, CATEGORY_TYPE.PRODUCT],
      default: CATEGORY_TYPE.DECORATIVE
    },
    source: {
      type: String,
      required: false,
      enum: [DATA_SOURCE.SHOPIFY, DATA_SOURCE.UPLOAD],
      default: DATA_SOURCE.UPLOAD
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
productCategorySchema.plugin(toJSON);
productCategorySchema.plugin(paginate);

/**
 * @typedef ProductCategory
 */
const ProductCategory = mongoose.model('ProductCategory', productCategorySchema);

module.exports = ProductCategory;
