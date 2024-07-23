const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { tokenTypes } = require('../config/tokens');
const { PRODUCT_TYPES } = require('../config/productType');

const textSchema = mongoose.Schema(
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
    type: {
      type: Number,
      required: false,
      default: PRODUCT_TYPES.TEXT
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
    isDisabled: {
      type: Boolean,
      required: false,
      default: false
    },
    texts: {
      type: Array,
      required: true,
      default: []
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
textSchema.plugin(toJSON);
textSchema.plugin(paginate);

/**
 * @typedef Text
 */
const Text = mongoose.model('Text', textSchema);

module.exports = Text;
