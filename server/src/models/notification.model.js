const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { notificationTypes } = require('../config/notificationType');

const notificationSchema = mongoose.Schema(
    {
        subject: {
            type: String,
            required: false,
            trim: true,
        },
        content: {
            type: String,
            trim: true,
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        isViewed: {
            type: Boolean,
            default: false
        },
        type: {
            type: Number,
            required: true,
            enum: notificationTypes
        },
        to: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// add plugin that converts mongoose to json
notificationSchema.plugin(toJSON);
notificationSchema.plugin(paginate);

/**
 * @typedef Notification
 */
const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
