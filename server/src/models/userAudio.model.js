const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const userAudioSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    asset: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Asset"
    }
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userAudioSchema.plugin(toJSON);
userAudioSchema.plugin(paginate);

/**
 * @typedef UserAudio
 */
const UserAudio = mongoose.model('UserAudio', userAudioSchema);

module.exports = UserAudio;
