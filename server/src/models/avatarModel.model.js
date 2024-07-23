const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { PLAYER_GENDER, ROLE_FOR } = require('../utils/constant');

const avatarModelSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    // 120 x 120
    thumnail: {
      type: String,
      required: true,
    },
    roleFor: {
        type: String,
        required: false,
        default: ROLE_FOR.CUSTOMER,
        enum: [ROLE_FOR.CUSTOMER, ROLE_FOR.SALE]
    },
    gender: {
        type: String,
        required: false,
        default: PLAYER_GENDER.MALE,
        enum: [PLAYER_GENDER.MALE, PLAYER_GENDER.FEMALE]
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: false
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
avatarModelSchema.plugin(toJSON);
avatarModelSchema.plugin(paginate);

/**
 * @typedef AvatarModel
 */
const AvatarModel = mongoose.model('AvatarModel', avatarModelSchema);

module.exports = AvatarModel;
