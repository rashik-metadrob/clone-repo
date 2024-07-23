const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { addressTypes } = require('../config/addressType');

const addressSchema = mongoose.Schema(
    {
        type: {
            type: Number,
            enum: addressTypes,
            default: 0,
        },
        line1: {
            type: String,
            required: true,
        },
        line2: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        postalCode: {
            type: String,
            required: true,
        },
        countryAlpha2: {
            type: String,
            required: true,
        },
        companyName: {
            type: String,
            required: false,
            default: ""
        },
        contactName: {
            type: String,
            required: true,
        },
        contactPhone: {
            type: String,
            required: true,
        },
        contactEmail: {
            type: String,
            required: true,
        },
        alias: {
            type: String,
            required: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId
        },
        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    {
      timestamps: true,
    }
  );
  
  // add plugin that converts mongoose to json
  addressSchema.plugin(toJSON);
  addressSchema.plugin(paginate);
  
  /**
   * @typedef Address
   */
  const Address = mongoose.model('Address', addressSchema);
  
  module.exports = Address;