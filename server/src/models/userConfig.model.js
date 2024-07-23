const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const userConfigSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    key: {
      type: String,
      required: true,
    },
    value: {
      type: Object,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userConfigSchema.plugin(toJSON);
userConfigSchema.plugin(paginate);

/**
 * @typedef UserConfig
 */
const UserConfig = mongoose.model('UserConfig', userConfigSchema);

module.exports = UserConfig;
