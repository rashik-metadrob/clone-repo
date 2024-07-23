const mongoose = require('mongoose');
const { toJSON } = require('./plugins');
const { tokenTypes } = require('../config/tokens');
const { invitationStatus, INVITATION_STATUS } = require('../config/invitationStatus');

const invitationSchema = mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    roleId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'RoleAndPermission',
      required: true,
    },
    expires: {
      type: Date,
      required: true,
    },
    status: {
      type: Number,
      enum: invitationStatus,
      default: INVITATION_STATUS.NOT_ANSWER,
    },
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
invitationSchema.plugin(toJSON);

/**
 * @typedef Invitation
 */
const Invitation = mongoose.model('Invitation', invitationSchema);

module.exports = Invitation;
