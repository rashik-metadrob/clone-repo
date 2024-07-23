const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');
const { PLAYER_GENDER, ACCOUNT_VISIBLE_FOR, STAFF_ACCOUNT_FOR } = require('../utils/constant');
const { accountSources, ACCOUNT_SOURCES } = require('../config/accountSource');
const { appSources, APP_SOURCES } = require('../config/appSource');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    socialId: {
      type: String,
      required: false,
    },
    gender: {
      type: String,
      required: false,
      default: PLAYER_GENDER.MALE,
      enum: [PLAYER_GENDER.MALE, PLAYER_GENDER.FEMALE]
    },
    phone: {
      type: String,
      required: false,
      default: "",
    },
    address: {
      type: String,
      required: false,
      default: "",
    },
    personalInfo: {
      type: Object,
      required: false,
      default: null,
    },
    socialType: {
      type: String,
      enum: ["Facebook", "Google"]
    },
    email: {
      type: String,
      required: false,
      // unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
      private: true, // used by the toJSON plugin
    },
    role: {
      type: String,
      enum: roles,
      default: 'retailers',
    },
    userRoles: {
      type: [
        {
          roleId: {
            type: mongoose.Schema.Types.ObjectId,
            default: null,
            ref: "RoleAndPermission"
          },
          // Owner
          invitedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
          },
          isSuperAdminRole: {
            type: Boolean,
            default: false
          }
        }
      ]
    },
    // Id of invitedBy or metadrob account
    staffAccountFor: {
      type: String,
      required: false,
      default: STAFF_ACCOUNT_FOR.METADROB
    },

    avatar: {
      type: String,
      required: false,
    },
    socialAvatar: {
      type: String,
      required: false,
      default: ""
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
    isOnboarding: {
      type: Boolean,
      default: false
    },
    // Store front token
    shopifyAccessToken: {
      type: String,
      required: false,
      default: ""
    },
    // Store front store name
    shopifyStoreName: {
      type: String,
      required: false,
      default: ""
    },
    // Active shopify cart id
    shopifyCartId:  {
      type: String,
      required: false,
      default: ""
    },
    // Is complete enter information of profile
    isCompleteEnterProfile: {
      type: Boolean,
      required: false,
      default: false
    },

    // The shopifyId get from session when embedded app
    shopifyShop: {
      type: String,
      required: false,
      default: ""
    },
    // Only used for account source is SHOPIFY
    shopifyShopEmail: {
      type: String,
      required: false,
      default: ""
    },
    isShopifyShopActive: {
      type: Boolean,
      required: false,
      default: true
    },
    companyName: {
      type: String,
      required: false,
    },
    industry: {
      type: String,
      required: false,
    },
    productType: {
      type: String,
      required: false,
    },

    // Source
    source: {
      type: Number,
      enum: accountSources,
      default: ACCOUNT_SOURCES.METADROB,
    },

    // Where the account come from
    appSource: {
      type: Number,
      enum: appSources,
      default: APP_SOURCES.METADROB,
    },

    // Tried pricing plans
    triedPlanIds: {
      type: Array,
      required: false,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

userSchema.statics.isSocialIdTaken = async function (socialId, excludeUserId) {
  const user = await this.findOne({ socialId, _id: { $ne: excludeUserId } });
  return !!user;
};

userSchema.statics.isShopifyShopTaken = async function (shopifyShop, excludeUserId) {
  const user = await this.findOne({ shopifyShop, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

/**
 * @typedef User
 */
const User = mongoose.model('User', userSchema);

module.exports = User;
