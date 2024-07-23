const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const configSchema = mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },
    content: {
      type: Object,
      required: true,
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
configSchema.plugin(toJSON);
configSchema.plugin(paginate);

/**
 * @typedef Config
 */
const Config = mongoose.model('Config', configSchema);

module.exports = Config;
