const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const hdriSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    thumnail: {
      type: String,
      required: false,
      trim: true,
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
    isDisabled: {
      type: Boolean,
      required: false,
      default: false
    },
    size: {
      type: Number,
      default: 0,
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
hdriSchema.plugin(toJSON);
hdriSchema.plugin(paginate);

/**
 * @typedef Hdri
 */
const Hdri = mongoose.model('Hdri', hdriSchema);

module.exports = Hdri;
