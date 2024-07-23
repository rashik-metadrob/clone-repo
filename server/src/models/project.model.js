const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { PROJECT_MODE, PROJECT_TYPE, CONTENT_TYPE, STORE_THEME_TYPES, CURRENCY, DEFAULT_PRODUCT, MODEL_BLOCK } = require('../utils/constant');
const { AVAILABLE_ANIMATION } = require('../config/availableAnimation');
const { cartTypes, CART_TYPES } = require('../config/productCartType');
const ProductInProject = mongoose.Schema({
  objectId: {
    type:  mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Product"
  },
  attributes: {
    type: Object,
    required: false,
  },
  availableAnimation: {
    type: Number,
    required: false,
    default: AVAILABLE_ANIMATION.PLAY_NEVER
  },
  axesHelper: {
    type: Boolean,
    required: false,
    default: false
  },
  block: {
    type: String,
    required: false,
    default: MODEL_BLOCK['3D']
  },
  isLock: {
    type: Boolean,
    required: false,
    default: false
  },
  isDisabled: {
    type: Boolean,
    required: false,
    default: false
  },
  cartType: {
    type: Number,
    enum: cartTypes,
    default: CART_TYPES.METADROB_CART,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false
  },
  description: {
    type: String,
    required: false,
    trim: true,
    default: ""
  },
  dimensions: {
    type: Object,
    required: false,
    default: DEFAULT_PRODUCT.DIMENSIONS
  },
  discount: {
    type: Number,
    required: false,
    default: 0
  },
  displayCurrency: {
    type: String,
    required: false,
    default: CURRENCY.USD
  },
  gallery: {
    type: Array,
    required: false,
    default: []
  },
  id: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: false
  },
  includedCategoriesIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProductCategory"
  }],
  lastPrice: {
    type: Number,
    required: false,
    default: 0
  },
  media: {
    type: Object,
    required: false
  },
  name: {
    type: String,
    required: false
  },
  objectUrl: {
    type: String,
    required: false
  },
  placeholderType: {
    type: Number,
    required: false,
  },
  position: {
    type: Object,
    required: false
  },
  price: {
    type: Number,
    required: false,
    default: 0,
  },
  rotation: {
    type: Object,
    required: false
  },
  scale: {
    type: Object,
    required: false
  },
  selectedGalleryId: {
    type: String,
    required: false
  },
  selectedProductToShow: {
    type: Object,
    required: false
  },
  shopifyProductId: {
    type: String,
    required: false
  },
  shopifyVariantMerchandiseId: {
    type: String,
    required: false
  },
  specification: {
    type: String,
    required: false
  },
  type: {
    type: Number,
    required: true
  },
  useThirdPartyCheckout: {
    type: Boolean,
    required: false,
    default: false
  },
  uniformScale: {
    type: Number,
    required: false,
    default: 0,
  },
  webLink: {
    type: String,
    required: false
  },
  url: {
    type: String,
    required: false
  },
})
const PublishStoreDataOfProject = mongoose.Schema({
  listProducts: {
    type: [ProductInProject],
    required: true,
    trim: true,
    default: []
  },
  listTexts: {
    type: Array,
    required: false,
    default: []
  },
  treeData: {
    type: Array,
    required: false,
    default: []
  },
  background:{
    type: String,
    required: false,
    default: ""
  },
  brandLogo:{
    type: String,
    required: false,
    default: ""
  },
  storeThemeType: {
    type: Number,
    required: false,
    enum: [STORE_THEME_TYPES.TYPE_1, STORE_THEME_TYPES.TYPE_2],
    default: STORE_THEME_TYPES.TYPE_1
  },
  storeNameStyle: {
    type: Object,
    required: false,
    default: null
  },
  elementMaterials: {
    type: Object,
    required: false,
    default: {}
  },
  name: {
    type: String,
    required: false,
    default: ''
  },
  description: {
    type: String,
    default: "",
  },
})
const projectSchema = mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      /**
       * {
       *  transformHistories: Array,
       *  media: {
       *    selectedMaterial: String, //Material name,
       *    isAutoPlay: Boolean,
       *    isSpatialAudio: Boolean,
       *    listMedias: Array,
       *  }
       * ...
       * }
       */
      listProducts: {
        type: [ProductInProject],
        required: true,
        trim: true,
        default: []
      },
       /**
       * {
       *  transformHistories: Array,
       * ...
       * }
       */
      listTexts: {
        type: Array,
        required: false,
        trim: true,
        default: []
      },
      treeData: {
        type: Array,
        required: false,
        default: []
      },
      background:{
        type: String,
        required: false,
        default: ""
      },
      brandLogo:{
        type: String,
        required: false,
        default: ""
      },
      storeThemeType: {
        type: Number,
        required: false,
        enum: [STORE_THEME_TYPES.TYPE_1, STORE_THEME_TYPES.TYPE_2],
        default: STORE_THEME_TYPES.TYPE_1
      },
      storeNameStyle: {
        type: Object,
        required: false,
        default: null
      },
      publishStoreData: {
        type: PublishStoreDataOfProject,
        required: false,
        default: {}
      },
      templateAvailableAnimation: {
        type: Number,
        required: false,
        default: AVAILABLE_ANIMATION.LOOP_FOREVER
      },
      image:{
        type: String,
        required: true
      },
      // Only template need template isn't euqal null
      template:{
        type: String,
        required: true
      },
      cameras: {
        type: [
          {
            assetId: {
              type: mongoose.Schema.Types.ObjectId,
              required: false,
              ref: "Asset"
            },
            name: {
              type: String,
              required: false,
              default: ""
            },
            thumnail: {
              type: String,
              required: false,
              default: ""
            },
          }
        ],
        default: []
      },
      // Can be null, fromScene or HrdiId
      hdr: {
        type: String,
        required: false,
        default: ""
      },
      isAttachHdriToBackground: {
        type: Boolean,
        required: false,
        default: false
      },
      isLock: {
        type: Boolean,
        default: false
      },
      isDisabled: {
        type: Boolean,
        required: false,
        default: false
      },
      isBlank: {
        type: Boolean,
        default: false,
      },
      templateToneMappingExposure: {
        type: Number,
        required: false,
        default: 1
      },
      materials: {
        type: Object,
        required: false,
        default: {}
      },
      elementMaterials: {
        type: Object,
        required: false,
        default: {}
      },
      templateId:{
        ref: "Project",
        type: mongoose.Schema.Types.ObjectId
      },
      description: {
        type: String,
        default: "",
      },
      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      isCompressing: {
        type: Boolean,
        default: false
      },
      isDeleted: {
        type: Boolean,
        default: false
      },
      // List ObjectId of pricing plans
      plans: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "PricingPlan"
      }],
      contentType: {
        type: Number,
        required: false,
        enum: [CONTENT_TYPE.GENERAL, CONTENT_TYPE.SPECIAL],
        default: CONTENT_TYPE.GENERAL
      },
      mode: {
        type: String,
        required: true,
        enum: [PROJECT_MODE.PUBLISH, PROJECT_MODE.UNSAVED, PROJECT_MODE.ARCHIVE],
        default: PROJECT_MODE.UNSAVED
      },
      /*
        {
          updateAt: Date,
          description: String,
          updateBody: String,
        }
      */
      updateLogs: {
        type: Array,
        required: false,
        default: []
      },
      type: {
        type: String,
        required: true,
        enum: [
          PROJECT_TYPE.PROJECT, PROJECT_TYPE.TEMPLATE
        ],
        default: PROJECT_TYPE.PROJECT,
      },
      size: {
        type: Number,
        default: 0,
      },
    },
    {
      timestamps: true,
    }
);
  
// add plugin that converts mongoose to json
projectSchema.plugin(toJSON);
projectSchema.plugin(paginate);

/**
 * @typedef Project
 */
const Project = mongoose.model('Project', projectSchema);

module.exports = Project;