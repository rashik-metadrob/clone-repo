import {BackSide, DoubleSide, FrontSide} from "three"
import { uuidv4 } from "./util"
import fonts from "../components/canvasContainer/components/descriptionBoard/fonts";

// #149 Reduce 35% speed
export const MOBILE_CAMERA_SPEED = 9.75;
export const DESKTOP_CAMERA_SPEED = 8.125;

export const UNIQUE_BROWSER_UUID = uuidv4();

export const XRMovementSpeed = 0.05;

// Used for exchange rate
export const CURRENCY_TEXT = {
    EUR: "€",
    USD: "$",
    INR: "₹"
}

export const ACCOUNT_VISIBLE_FOR = {
    METADROB_ACCOUNT: 1,
    STAFF_ACCOUNT: 2
}

export const STAFF_ACCOUNT_FOR = {
    METADROB: "Metadrob"
}

// Currency feature
const CURRENCY = {
    USD: "USD",
    EUR: "EUR",
    INR: "INR",
    AUD: "AUD",
    SGD: "SGD",
    CAD: "CAD",
    NZD: "NZD",
    GBP: "GBP",
    JPY: "JPY",
    MXN: "MXN",
    AED: "AED"
}
export const CURRENCY_LIST = [
    {
        code: "USD",
        name: "USD",
        symbol: "$"
    },
    {
        code: "EUR",
        name: "EUR",
        symbol: "€"
    },
    {
        code: "INR",
        name: "INR",
        symbol: "Rs."
    },
    {
        code: "AUD",
        name: "AUD",
        symbol: "AU$"
    },
    {
        code: "SGD",
        name: "SGD",
        symbol: "SG$"
    },
    {
        code: "CAD",
        name: "CAD",
        symbol: "CA$"
    },
    {
        code: "NZD",
        name: "NZD",
        symbol: "NZ$"
    },
    {
        code: "GBP",
        name: "GBP",
        symbol: "£"
    },
    {
        code: "JPY",
        name: "JPY",
        symbol: "¥"
    },
    {
        code: "MXN",
        name: "MXN",
        symbol: "MX$"
    },
    {
        code: "AED",
        name: "AED",
        symbol: "AED"
    }
]
//End currency feature
export const OBJECT_DETAIL_TYPE = {
    PRODUCT: "PRODUCT",
    DECORATIVE_WITH_MOLD: "DECORATIVE_WITH_MOLD",
    OTHER: "OTHER",
    TEXT: "TEXT",
    FOLDER: "FOLDER",
    PLACEHOLDER: "PLACEHOLDER"
}

export const DEFAULT_CURRENCY = "USD"
export const DEFAULT_MODEL_BLOCK = "3D"
export const MODEL_BLOCK = {
    "2D": "2D",
    "3D": "3D"
}

export const MODEL_BLOCK_OPTIONS = [
    {
        label: MODEL_BLOCK["2D"],
        value: MODEL_BLOCK["2D"]
    },
    {
        label: MODEL_BLOCK["3D"],
        value: MODEL_BLOCK["3D"]
    }
]

export const PUBLISH_ROLE = {
    SALE: "sale",
    CUSTOMER: "customer"
}

export const PLAYER_GENDER = {
    MALE: "male",
    FEMALE: "female"
}

export const PROJECT_MODE = {
    PUBLISH: "publish",
    UNSAVED: "unsaved",
    ARCHIVE: "archive"
}
export const PROJECT_MODE_TEXT = {
    [PROJECT_MODE.PUBLISH]: "Publish",
    [PROJECT_MODE.UNSAVED]: "Draft",
    [PROJECT_MODE.ARCHIVE]: "Archive"
}
export const PROJECT_TYPE = {
    PROJECT: "project",
    TEMPLATE: "template"
}
export const SOCIAL_TYPE = {
    FACEBOOK: "facebook",
    GOOGLE: "google"
}
export const USER_ROLE = {
    USER: "user",
    ADMIN: "admin",
    RETAILERS: "retailers",
    CUSTOMER: "customer",

    //Viewer only client
    VIEWER: "viewer"
}
export const PRODUCT_TYPES = {
    DECORATIVES: 0,
    PRODUCTS: 1,
    TEXT: 2,
    ANIMATION: 3,
    EFFECTS: 4,
    SOUND: 5,
    ELEMENT: 6,
    MEDIA: 7,
    PLACEHOLDER: 8,
}
export const PRODUCT_TAB_TYPES = {
    PRODUCTS: 1,
    ELEMENT: 6,
    MEDIA: 7,
    ASSETS: 8
}
export const TRACKING_TYPE = {
    STORE: "store",
    PRODUCT: "product"
}
export const TRACKING_ACTION_NAME = {
    STAY_IN_STORE: "STAY_IN_STORE",
    CLICK_PRODUCT: "CLICK_PRODUCT",
    ADD_TO_CART: "ADD_TO_CART",
    REMOVE_FROM_CART: "REMOVE_FROM_CART",
    USER_ENTER_STORE: "USER_ENTER_STORE",
    STAY_TO_BUILD_STORE: "STAY_TO_BUILD_STORE",
}

export const PROJECT_TAB_NO = {
    TEMPLATES: "1",
    PUBLISHED: "2",
    ARCHIEVES: "3",
    DRAFT: "4"
}

export const PROJECT_MENU_ACTION = {
    DELETE: "1",
    ARCHIEVE: "2",
    RESTORE: "3",
    UNPUBLISH: "4",
    EDIT: "5",
    QR: "6",
}

export const CONFIG_TYPE = {
    BANNER: "BANNER",
    OVERRIDE_MATERIAL: "OVERRIDE_MATERIAL",
    OVERRIDE_MATERIAL_MOBILE: "OVERRIDE_MATERIAL_MOBILE",
    ANTIALIAS_DESKTOP: "ANTIALIAS_DESKTOP",
    ANTIALIAS_MOBILE: "ANTIALIAS_MOBILE",
    SHOW_HDRI_DESKTOP: "SHOW_HDRI_DESKTOP",
    SHOW_HDRI_MOBILE: "SHOW_HDRI_MOBILE",
    PIXEL_RATIO_DESKTOP: "PIXEL_RATIO_DESKTOP",
    PIXEL_RATIO_MOBILE: "PIXEL_RATIO_MOBILE"
}

export const MATERIAL_VALUE_TYPES = {
    NUMBER: "NUMBER",
    COLOR: "COLOR",
    BOOL: "BOOL",
    SELECT: "SELECT",
    TEXTURE: "TEXTURE"
}

export const EDITOR_MATERIAL_KEYS_2D_DEFAULT_VALUE = {
    envMapIntensity: 1
}

export const EDITOR_MATERIAL_KEYS_2D = [
    {
        key: "envMapIntensity",
        name: "Env Map Insensity",
        min: 0,
        max: 10,
        step: 1,
        valueType: MATERIAL_VALUE_TYPES.NUMBER
    },
]

export const EDITOR_MATERIAL_KEYS = [
    {
        key: "aoMapInsensity",
        name: "Ao Map Insensity",
        min: 0,
        max: 10,
        step: 1,
        valueType: MATERIAL_VALUE_TYPES.NUMBER
    },
    {
        key: "color",
        name: "Color",
        valueType: MATERIAL_VALUE_TYPES.COLOR
    },
    // {
    //     key: "colorWrite",
    //     name: "Color Write",
    //     valueType: MATERIAL_VALUE_TYPES.BOOL
    // },
    {
        key: "emissive",
        name: "Emissive",
        valueType: MATERIAL_VALUE_TYPES.COLOR
    },
    {
        key: "emissiveIntensity",
        name: "Emissive Intensity",
        min: 0,
        max: 1,
        step: 0.01,
        valueType: MATERIAL_VALUE_TYPES.NUMBER
    },
    {
        key: "envMapIntensity",
        name: "Env Map Insensity",
        min: 0,
        max: 10,
        step: 1,
        valueType: MATERIAL_VALUE_TYPES.NUMBER
    },
    // {
    //     key: "flatShading",
    //     name: "Flat Shading",
    //     valueType: MATERIAL_VALUE_TYPES.BOOL
    // },
    // {
    //     key: "fog",
    //     name: "Fog",
    //     valueType: MATERIAL_VALUE_TYPES.BOOL
    // },
    // {
    //     key: "lightMapIntensity",
    //     name: "Light Map Intensity",
    //     min: 0,
    //     max: 10,
    //     step: 1,
    //     valueType: MATERIAL_VALUE_TYPES.NUMBER
    // },
    {
        key: "metalness",
        name: "Metalness",
        min: 0,
        max: 1,
        step: 0.01,
        valueType: MATERIAL_VALUE_TYPES.NUMBER
    },
    {
        key: "opacity",
        name: "Opacity",
        min: 0,
        max: 1,
        step: 0.01,
        valueType: MATERIAL_VALUE_TYPES.NUMBER
    },
    {
        key: "roughness",
        name: "Roughness",
        min: 0,
        max: 1,
        step: 0.01,
        valueType: MATERIAL_VALUE_TYPES.NUMBER
    },
    {
        key: "side",
        name: "Side",
        options: [
            {
                label: "Front Side",
                value: FrontSide
            },
            {
                label: "Back Side",
                value: BackSide
            },
            {
                label: "Double Side",
                value: DoubleSide
            }
        ],
        valueType: MATERIAL_VALUE_TYPES.SELECT
    },
    // {
    //     key: "toneMapped",
    //     name: "Tone Mapped",
    //     valueType: MATERIAL_VALUE_TYPES.BOOL
    // },
    {
        key: "transparent",
        name: "Transparent",
        valueType: MATERIAL_VALUE_TYPES.BOOL
    },
    {
        key: "visible",
        name: "Visible",
        valueType: MATERIAL_VALUE_TYPES.BOOL
    },
    {
        key: "emissiveMap",
        name: "Texture",
        valueType: MATERIAL_VALUE_TYPES.TEXTURE
    },
]

export const CONFIG_TEXT = {
    NUM_OF_VISITS_IS_OUT: "The limit number of this retailer's store visits has reached. Contact this retailer for more detail.",
    KICK_BY_ADMIN: "You have been kicked by the administrator!",
    ROOM_FULL: "The room is full. Please come back later!",
    USER_IN_ACTIVE_SESSION: "You have already connected on this device!",
    KICK_BECAUSE_IDLE: "You have been kicked because you are inactive for more than 10 minutes",
    PLEASE_CHOOSE_PLAN: "Choose one of pricing plans to continue!",
    SUBCRIPT_PRICING_PLAN_SUCCESS: "Subcript pricing plan success!",
    NO_RATES: "No rates can be found!",
    KICK_AFTER_90S: "You will be kicked in 9'30s if you are inactive",
    REACH_LIMIT: "User has reached limit of the current plan!",
    REACH_LIMIT_DRAFT_STORE: "Can’t create more draft stores. Maximum limit reached.",
    USER_DONT_HAVE_PERMISSION_TO_EDIT_THIS_STORE: "You do not have permission to edit this store!",
    MOVED_TO_ARCHIVE: "Moved to Archive",
    MOVED_TO_DRAFT: "Store is Unpublished. Your Published stores are sent to draft.",
    DELETED_SUCCESSFULLY: "Deleted Successfully",
    PRODUCT_ADDED_SUCCESSFULLY: "Product added Successfully",
    SHOPIFY_PRODUCT_CAN_ONLY_BE_IMPORTED_FROM_SHOPIFY: "Shopify products can only be imported from shopify",
    CUSTOMERS_WILL_BE_REDIRECTED_HERE_WHEN_THEY_CLICK_BUY: "Customers will be redirected here when they click Buy.",
    KINDLY_OPEN_THE_STORE_EDITOR_ON_YOUR_DESKTOP: "Kindly open the Store Editor on your Desktop for a better experience",
    EXCEEDED_STORAGE_LIMIT_SUBJECT: "Exceeded the maximum capacity!",
    EXCEEDED_STORAGE_LIMIT_CONTENT: "Your storage is full. Upgrade the pricing plan to increase the storage.",
    YOU_DONT_HAVE_PERMISSION: "You do not have the authority to take that action."
}

export const IDLE_CONFIG = {
    NUM_OF_SEC_SHOW_MESSAGE: 30,
    NUM_OF_SEC_MAXIMUM: 600 // 10 minutes
}

export const USER_SUBCRIPTION_KEY = {
    "PRICING_PLAN": "PRICING_PLAN"
}

export const PAYMENT_STATUS = {
    "NOT_PAYMENT": 0,
    "SUCCEEDED": 1,
    "PROCESSING": 2,
    "FAIL": 3
}

export const PAYMENT_STATUS_TEXT = {
    0: 'Unpaid',
    1: 'Paid',
    2: 'Processing',
    3: 'Fail'
}

export const SHIPMENT_STATUS = {
    "NOT_SHIPMENT": 0,
    "CREATED": 1
}

export const SHIPMENT_STATUS_TEXT = {
    0: {
        text: 'Not Delivered',
        color: '#FF1F00'
    },
    1: {
        text: 'Delivered',
        color: '#24FF00'
    }
}

export const SHIPMENT_STATUS_OPTIONS = [
    {
        label: 'Not Delivered',
        value: 0,
    },
    {
        label: 'Delivered',
        value: 1,
    }
]

export const DEFAULT_PRODUCT = {
    DIMENSIONS: {
        "length": 20,
        "width": 20,
        "height": 20,
        "unit": "inch"
    },
    ACTUALWEIGHT: 10,
    BLOCK: "3D"
}

export const ADDRESS_TYPE = {
    SHIPPING_ADDRESS: 0,
    BILLING_ADDRESS: 1
}

export const PAYMENT_TYPE = {
    ORDER: "order",
    PRICING_PLAN: "pricing-plan",
    PAYPAL_PLAN_SUCCESS: "paypal-plan-success",
    PAYPAL_ORDER_SUCCESS: "paypal-order-success",
    PAYPAL_ORDER_FAIL: "paypal-order-fail",
    SHOPIFY_PLAN_SUCCESS: "shopify-plan-success",
}

export const ORDER_STATUS = {
    "CREATED" : {
        value: 0,
        color: "#2AA952",
        text: "Created"
    },
    "PAYMENT_FAIL": {
        value: 1,
        color: "#FF6500",
        text: "Payment fail"
    },
    "PAYMENT_SUCCESS": {
        value: 2,
        color: "#2AA952",
        text: "Payment success"
    },
    "DELIVERED": {
        value: 3,
        color: "#2AA952",
        text: "Delivered"
    },
    "OUT_OF_DELIVERED": {
        value: 4,
        color: "#FF6500",
        text: "Out of delivered"
    }
}

export const PAYMENT_GATE = {
    STRIPE: "STRIPE",
    PAYPAL: "PAYPAL",
    SHOPIFY_BILLING: "SHOPIFY_BILLING"
}

export const HDRI = {
    DEFAULT: "environments/2k.hdr",
    JUNGLE: "environments/jungle.hdr",
    LIVING_ROOM: "environments/living-room.hdr",
    CITY: "environments/city.hdr",
    SEA: "environments/sea.hdr",
    CUSTOM: "custom",
    FROM_SCENE: "fromScene"
}

export const TEXTURE = {
    CUSTOM: "custom",
    AVAILABLE: "available"
}

export const LOGO = {
    CUSTOM: "custom",
}

export const BACKGROUND = {
    CUSTOM: "custom",
}

export const USER_CONFIG_KEY = {
    NUM_OF_USER_ENTER_IN_MONTH: "NUM_OF_USER_ENTER_IN_MONTH",
    NUM_OF_DRAFT_STORE_IN_MONTH: "NUM_OF_DRAFT_STORE_IN_MONTH",
    NUM_OF_PRODUCTS_IN_MONTH: "NUM_OF_PRODUCTS_IN_MONTH",
    NUM_OF_PUBLISH_STORE_IN_MONTH: "NUM_OF_PUBLISH_STORE_IN_MONTH",
    // Brand logo of the owner
    USER_BRAND_LOGO: "USER_BRAND_LOGO",
    ODOO_CONFIG: "ODOO_CONFIG"
}

export const CONTENT_TYPE = {
    GENERAL: 1,
    SPECIAL: 2
}

export const SERVER_DATE_FORMAT = "YYYY-MM-DDThh:mm:ss"
export const TEMPLATE_TABLE_DATE_FORMAT = "DD MMMMYY"
export const RETAILER_TEMPLATE_TABLE_DATE_FORMAT = "DD MMMYY"
export const RETAILER_TEMPLATE_TABLE_IN_CARD_DATE_FORMAT = "DD MMMYY hh:mm A"

export const TEMPLATE_TABLE_DATE_YEAR = "MMMM DD YYYY"

export const FORM_STATUS = {
    NONE: "NONE",
    SUCCESS: "SUCCESS",
    FAIL: "FAIL",
    DATA_INVALID: "DATA_INVALID",
    UPLOAD_FAIL: "UPLOAD_FAIL"
}

export const FORM_STATUS_INFO = {
    NONE: {
        className: 'upload-form-none',
        text: ''
    },
    SUCCESS: {
        className: 'upload-form-success',
        text: 'Successfully!'
    },
    FAIL: {
        className: 'upload-form-fail',
        text: 'Failed!'
    },
    DATA_INVALID: {
        className: 'upload-form-data-invalid',
        text: 'Data invalid!'
    },
    UPLOAD_FAIL: {
        className: 'upload-form-upload-fail',
        text: 'Upload failed!'
    },
}

export const ANALYTICS_BY = {
    MONTH: "/mo",
    YEAR: "/ye"
}

export const PRICING_PLAN_VALUE = {
    NUM_OF_PRODUCTS: {
        UNLIMITED: "Unlimited"
    },
    "3D_PRODUCT_LIBRARY_ACCESS": {
        GENERAL: "General",
        GENERAL_AND_SPECIAL: "General + Special"
    },
    UPLOAD_LIMIT_OBJECTS: {
        BOTH_2D_AND_3D: "Both 2D and 3D",
        ONLY_2D: "Only 2D"
    },
    DEFAULT_UPLOAD_FILE_LIMIT: 1,
    DEFAULT_STORE_CAPACITY: 300
}

export const FORM_CONTROL_TYPE = {
    NUMBER: "NUMBER",
    COMBOBOX: "COMBOBOX",
    COMBOBOX_AND_NUMBER: "COMBOBOX_AND_NUMBER"
}

export const OPTION_YES = {
    value: true,
    label: "Yes"
}

export const OPTION_NO = {
    value: false,
    label: "No"
}

const OPTION_LIMITED_TIME = {
    value: "Limited Time",
    label: "Limited Time"
}

const OPTION_ADVANCED_REQWRDS = {
    value: "Advanced Rewards",
    label: "Advanced Rewards"
}

const OPTION_ADVANCE = {
    value: "Advance",
    label: "Advance"
}

const OPTION_BASIC = {
    value: "Basic",
    label: "Basic"
}

const OPTION_UNLIMITED = {
    value: PRICING_PLAN_VALUE.NUM_OF_PRODUCTS.UNLIMITED,
    label: PRICING_PLAN_VALUE.NUM_OF_PRODUCTS.UNLIMITED
}

const OPTIONS_DAYS = [
    {
        label: "1",
        value: 1
    },
    {
        label: "3",
        value: 3
    },
    {
        label: "5",
        value: 5
    },
    {
        label: "7",
        value: 7
    },
    {
        label: "15",
        value: 15
    }
]

export const PRICING_PLAN_FEATURES_KEY = {
    "TRIAL_PERIOD": "TRIAL_PERIOD",
    "THEMES": "THEMES",
    "NUM_OF_STORES_DRAFT": "NUM_OF_STORES_DRAFT",
    "NUM_OF_PRODUCTS": "NUM_OF_PRODUCTS",
    "STAFF_ACCOUNTS": "STAFF_ACCOUNTS",
    "3D_PRODUCT_LIBRARY_ACCESS": "3D_PRODUCT_LIBRARY_ACCESS",
    "UPLOAD_LIMIT_OBJECTS": "UPLOAD_LIMIT_OBJECTS",
    "MULTIPLAYER": "MULTIPLAYER",
    "PER_PERSION_IN_ROOM": "PER_PERSION_IN_ROOM",
    "NUM_OF_ROOMS_LOBBY_CHANNELS": "NUM_OF_ROOMS_LOBBY_CHANNELS",
    "WAITING_ROOM": "WAITING_ROOM",
    "CUSTOM_ROOM_CREATION_PER_MONTH": "CUSTOM_ROOM_CREATION_PER_MONTH",
    "ANALYTICS": "ANALYTICS",
    "WHITE_LABELLING": "WHITE_LABELLING",
    "PLUGIN": "PLUGIN",
    "ABANDON_CARD_RECOVERY": "ABANDON_CARD_RECOVERY",
    "STAFF_TRAINING": "STAFF_TRAINING",
    "SUPPORT_24-7": "SUPPORT_24-7",
    "NUM_OF_STORE_CAN_PUBLISH": "NUM_OF_STORE_CAN_PUBLISH",
    "DEDICATED_SUPPORT_STAFF": "DEDICATED_SUPPORT_STAFF",
    "PRODUCT_INTEGRATION_AND_STORE_CREATION": "PRODUCT_INTEGRATION_AND_STORE_CREATION",
    "LOYALTY_POINTS_FOR_MONTHLY_BASIC": "LOYALTY_POINTS_FOR_MONTHLY_BASIC",
    "REFERRAL_BONUS": "REFERRAL_BONUS",
    "BUY_MORE_ROOM": "BUY_MORE_ROOM",
    "UPLOAD_2D_FILE_SIZE_LIMIT": "UPLOAD_2D_FILE_SIZE_LIMIT",
    "UPLOAD_3D_FILE_SIZE_LIMIT": "UPLOAD_3D_FILE_SIZE_LIMIT",
    "UPLOAD_MEDIA_FILE_SIZE_LIMIT": "UPLOAD_MEDIA_FILE_SIZE_LIMIT",
    "STORE_CAPACITY": "STORE_CAPACITY"
}

export const PRICING_PLAN_FEATURES_FIELDS = [
    {
        "key": "TRIAL_PERIOD",
        "displayText": "Trial priod",
        isHighLight: false,
        valueType: FORM_CONTROL_TYPE.COMBOBOX,
        options: OPTIONS_DAYS
    },
    {
        "key": "THEMES",
        "displayText": "Themes",
        "description": "Build an online store with METADROB’s no-code virtual store creation tool.",
        valueType: FORM_CONTROL_TYPE.COMBOBOX,
        options: [OPTION_YES, OPTION_NO]
    },
    {
        "key": "NUM_OF_STORES_DRAFT",
        "displayText": "Number of Stores Draft",
        isHighLight: true,
        valueType: FORM_CONTROL_TYPE.NUMBER
    },
    {
        "key": "NUM_OF_PRODUCTS",
        "displayText": "Number of Products",
        valueType: FORM_CONTROL_TYPE.COMBOBOX_AND_NUMBER,
        options: [OPTION_UNLIMITED]
    },
    {
        "key": "STAFF_ACCOUNTS",
        "displayText": "Staff Accounts",
        "description": "Build an online store with METADROB’s no-code virtual store creation tool.",
        valueType: FORM_CONTROL_TYPE.COMBOBOX,
        options: [
            {
                value: 2,
                label: "2 Accounts"
            },
            {
                value: 3,
                label: "3 Accounts"
            },
            {
                value: 8,
                label: "8 Accounts"
            }
        ]
    },
    {
        "key": "3D_PRODUCT_LIBRARY_ACCESS",
        "displayText": "3D Product Library Access",
        "description": "Build an online store with METADROB’s no-code virtual store creation tool.",
        valueType: FORM_CONTROL_TYPE.COMBOBOX,
        options: [
            {
                value: PRICING_PLAN_VALUE["3D_PRODUCT_LIBRARY_ACCESS"].GENERAL,
                label: PRICING_PLAN_VALUE["3D_PRODUCT_LIBRARY_ACCESS"].GENERAL
            },
            {
                value: PRICING_PLAN_VALUE["3D_PRODUCT_LIBRARY_ACCESS"].GENERAL_AND_SPECIAL,
                label: PRICING_PLAN_VALUE["3D_PRODUCT_LIBRARY_ACCESS"].GENERAL_AND_SPECIAL
            },
        ]
    },
    {
        "key": "UPLOAD_LIMIT_OBJECTS",
        "displayText": "Upload Limit of Objects",
        valueType: FORM_CONTROL_TYPE.COMBOBOX,
        options: [
            {
                value: PRICING_PLAN_VALUE.UPLOAD_LIMIT_OBJECTS.ONLY_2D,
                label: PRICING_PLAN_VALUE.UPLOAD_LIMIT_OBJECTS.ONLY_2D
            },
            {
                value: PRICING_PLAN_VALUE.UPLOAD_LIMIT_OBJECTS.BOTH_2D_AND_3D,
                label: PRICING_PLAN_VALUE.UPLOAD_LIMIT_OBJECTS.BOTH_2D_AND_3D
            },
        ]
    },
    {
        "key": "MULTIPLAYER",
        "displayText": "Multiplayer",
        valueType: FORM_CONTROL_TYPE.COMBOBOX,
        options: [OPTION_YES, OPTION_NO]
    },
    {
        "key": "PER_PERSION_IN_ROOM",
        "displayText": "Per person in Room",
        valueType: FORM_CONTROL_TYPE.COMBOBOX_AND_NUMBER,
        options: [OPTION_NO]
    },
    {
        "key": "NUM_OF_ROOMS_LOBBY_CHANNELS",
        "displayText": "Numbers of rooms/lobby/channels",
        valueType: FORM_CONTROL_TYPE.COMBOBOX_AND_NUMBER,
        options: [OPTION_NO]
    },
    {
        "key": "WAITING_ROOM",
        "displayText": "Waiting room",
        valueType: FORM_CONTROL_TYPE.COMBOBOX,
        options: [OPTION_YES, OPTION_NO]
    },
    {
        "key": "CUSTOM_ROOM_CREATION_PER_MONTH",
        "displayText": "Custom room creation (per month)",
        valueType: FORM_CONTROL_TYPE.COMBOBOX_AND_NUMBER,
        options: [OPTION_NO]
    },
    {
        "key": "ANALYTICS",
        "displayText": "Analytics",
        valueType: FORM_CONTROL_TYPE.COMBOBOX,
        options: [OPTION_BASIC, OPTION_ADVANCE]
    },
    {
        "key": "WHITE_LABELLING",
        "displayText": "White labelling",
        valueType: FORM_CONTROL_TYPE.COMBOBOX,
        options: [OPTION_YES, OPTION_NO]
    },
    {
        "key": "PLUGIN",
        "displayText": "Plugin",
        valueType: FORM_CONTROL_TYPE.COMBOBOX,
        options: [OPTION_YES, OPTION_NO]
    },
    {
        "key": "ABANDON_CARD_RECOVERY",
        "displayText": "Abandon Card Recovery",
        valueType: FORM_CONTROL_TYPE.COMBOBOX,
        options: [OPTION_YES, OPTION_NO]
    },
    {
        "key": "STAFF_TRAINING",
        "displayText": "Staff training",
        valueType: FORM_CONTROL_TYPE.COMBOBOX,
        options: [OPTION_YES, OPTION_NO]
    },
    {
        "key": "SUPPORT_24-7",
        "displayText": "24/7 support",
        valueType: FORM_CONTROL_TYPE.COMBOBOX,
        options: [OPTION_YES, OPTION_NO]
    },
    {
        "key": "NUM_OF_STORE_CAN_PUBLISH",
        "displayText": "Number of store can Publish",
        valueType: FORM_CONTROL_TYPE.NUMBER
    },
    {
        "key": "DEDICATED_SUPPORT_STAFF",
        "displayText": "Dedicated Support Staff",
        valueType: FORM_CONTROL_TYPE.COMBOBOX,
        options: [OPTION_YES, OPTION_NO]
    },
    {
        "key": "PRODUCT_INTEGRATION_AND_STORE_CREATION",
        "displayText": "Product Integration and store creation",
        valueType: FORM_CONTROL_TYPE.COMBOBOX,
        options: [OPTION_YES, OPTION_LIMITED_TIME, OPTION_NO]
    },
    {
        "key": "LOYALTY_POINTS_FOR_MONTHLY_BASIC",
        "displayText": "Loyalty points/rewards for monthly basis",
        valueType: FORM_CONTROL_TYPE.COMBOBOX,
        options: [OPTION_YES, OPTION_NO, OPTION_ADVANCED_REQWRDS]
    },
    {
        "key": "REFERRAL_BONUS",
        "displayText": "Referral bonus/points",
        valueType: FORM_CONTROL_TYPE.COMBOBOX,
        options: [OPTION_YES, OPTION_NO]
    },
    {
        "key": "BUY_MORE_ROOM",
        "displayText": "Buy more rooms",
        valueType: FORM_CONTROL_TYPE.COMBOBOX,
        options: [OPTION_YES, OPTION_NO]
    },
    {
        "key": "UPLOAD_2D_FILE_SIZE_LIMIT",
        "displayText": "Upload 2D file size limit (Mb)",
        valueType: FORM_CONTROL_TYPE.NUMBER
    },
    {
        "key": "UPLOAD_3D_FILE_SIZE_LIMIT",
        "displayText": "Upload 3D file size limit (Mb)",
        valueType: FORM_CONTROL_TYPE.NUMBER
    },
    {
        "key": "UPLOAD_MEDIA_FILE_SIZE_LIMIT",
        "displayText": "Upload media file size limit (Mb)",
        valueType: FORM_CONTROL_TYPE.NUMBER
    },
    {
        "key": "STORE_CAPACITY",
        "displayText": "Store capacity (Mb)",
        valueType: FORM_CONTROL_TYPE.NUMBER,
        defaultValue: PRICING_PLAN_VALUE.DEFAULT_STORE_CAPACITY
    },
]

export const DEFAULT_PLAN = {
    "name": "",
    "description": "",
    "isRecommended": false,
    "pricing": {
      "yearly": 0,
      "monthly": 0
    },
    "features": [
        {
            "key": "TRIAL_PERIOD",
            "displayText": "Trial priod",
            "value": 1
        },
        {
            "key": "THEMES",
            "displayText": "Themes",
            "description": "Build an online store with METADROB’s no-code virtual store creation tool.",
            "value": true
        },
        {
            "key": "NUM_OF_STORES_DRAFT",
            "displayText": "Number of Stores Draft",
            "value": 5
        },
        {
            "key": "NUM_OF_PRODUCTS",
            "displayText": "Number of Products",
            "value": 30
        },
        {
            "key": "STAFF_ACCOUNTS",
            "displayText": "Staff Accounts",
            "description": "Build an online store with METADROB’s no-code virtual store creation tool.",
            "value": 2
        },
        {
            "key": "3D_PRODUCT_LIBRARY_ACCESS",
            "displayText": "3D Product Library Access",
            "description": "Build an online store with METADROB’s no-code virtual store creation tool.",
            "value": "General"
        },
        {
            "key": "UPLOAD_LIMIT_OBJECTS",
            "displayText": "Upload Limit of Objects",
            "value": "Only 2D"
        },
        {
            "key": "MULTIPLAYER",
            "displayText": "Multiplayer",
            "value": false
        },
        {
            "key": "PER_PERSION_IN_ROOM",
            "displayText": "Per person in Room",
            "value": false
        },
        {
            "key": "NUM_OF_ROOMS_LOBBY_CHANNELS",
            "displayText": "Numbers of rooms/lobby/channels",
            "value": false
        },
        {
            "key": "WAITING_ROOM",
            "displayText": "Waiting room",
            "value": false
        },
        {
            "key": "CUSTOM_ROOM_CREATION_PER_MONTH",
            "displayText": "Custom room creation (per month)",
            "value": false
        },
        {
            "key": "ANALYTICS",
            "displayText": "Analytics",
            "value": "Basic"
        },
        {
            "key": "WHITE_LABELLING",
            "displayText": "White labelling",
            "value": false
        },
        {
            "key": "PLUGIN",
            "displayText": "Plugin",
            "value": true
        },
        {
            "key": "ABANDON_CARD_RECOVERY",
            "displayText": "Abandon Card Recovery",
            "value": false
        },
        {
            "key": "STAFF_TRAINING",
            "displayText": "Staff training",
            "value": false
        },
        {
            "key": "SUPPORT_24-7",
            "displayText": "24/7 support",
            "value": true
        },
        {
            "key": "NUM_OF_STORE_CAN_PUBLISH",
            "displayText": "Number of store can Publish",
            "value": 1
        },
        {
            "key": "DEDICATED_SUPPORT_STAFF",
            "displayText": "Dedicated Support Staff",
            "value": false
        },
        {
            "key": "PRODUCT_INTEGRATION_AND_STORE_CREATION",
            "displayText": "Product Integration and store creation",
            "value": false
        },
        {
            "key": "LOYALTY_POINTS_FOR_MONTHLY_BASIC",
            "displayText": "Loyalty points/rewards for monthly basis",
            "value": false
        },
        {
            "key": "REFERRAL_BONUS",
            "displayText": "Referral bonus/points",
            "value": true
        },
        {
            "key": "BUY_MORE_ROOM",
            "displayText": "Buy more rooms",
            "value": false
        },
        {
            "key": "UPLOAD_2D_FILE_SIZE_LIMIT",
            "displayText": "Upload 2D file size limit (Mb)",
            "value": 1
        },
        {
            "key": "UPLOAD_3D_FILE_SIZE_LIMIT",
            "displayText": "Upload 3D file size limit (Mb)",
            "value": 1
        },
        {
            "key": "UPLOAD_MEDIA_FILE_SIZE_LIMIT",
            "displayText": "Upload media file size limit (Mb)",
            "value": 1
        },
        {
            "key": "STORE_CAPACITY",
            "displayText": "Store capacity (Mb)",
            "value": PRICING_PLAN_VALUE.DEFAULT_STORE_CAPACITY
        },
    ],
    "includedInfomation": [
    ]
}

export const USER_ROUTE_PREFIX = {
    RETAILER_EDIT_PROJECT: `/project/${USER_ROLE.RETAILERS}/`,
    ADMIN_EDIT_PROJECT: `/project/${USER_ROLE.ADMIN}/`
}

export const AVAILABLE_ANIMATION = {
    LOOP_FOREVER: 1,
    LOOP_ONE: 2,
    PLAY_NEVER: 3
}

export const RENDERER_CONFIG = {
    TONE_MAPPING_EXPOSURE: 1
}

export const DRAWER_BAG_TABS = {
    MY_ORDERS: "MY_ORDERS",
    MY_SHOPIFY_ORDERS: "MY_SHOPIFY_ORDERS",
    SAVE_FOR_LATER: "SAVE_FOR_LATER"
}

export const CART_MODE = {
    METADROD: "METADROD",
    SHOPIFY: "SHOPIFY"
}

export const SERVER_FILTER_DATE_FORMAT = "YYYY-MM-DD"

export const TEXT_CONFIG_RESOLUTION = 100

export const TEXT_ALIGN = {
    LEFT: "LEFT",
    CENTER: "CENTER",
    RIGHT: "RIGHT"
}

export const TEXT_DECORATION = {
    NORMAL: "NORMAL",
    LOWERCASE: "LOWERCASE",
    UPPERCASE: "UPPERCASE"
}

export const EDIT_TEMPLATE_MODE = {
    EDIT_TEMPLATE: "edit-model",
    CLONE_TEMPLATE: "clone-template"
}

export const ASSET_TYPES = {
    TEXTURE: 0,
    GALLERY: 1,
    LOGO: 2,
    BACKGROUND: 3,
    BRAND_LOGO: 4,
    STORE_THEME_BACKGROUND: 5,
    MEDIA: 6,
    TUTORIAL_VIDEO: 7,
    MUSIC: 8,
    TEXTURE_MEDIA: 9,
    FONT: 10
}

export const ASSET_TYPES_TEXTS = {
    0: "Texture",
    1: "Gallery",
    2: "Logo",
    3: "Background",
    4: "Brand logo",
    5: "Store theme background",
    6: "Media",
    7: "Tutorial video",
    8: "Music",
    9: "Texture media",
    10: "Font"
}

export const DASHBOARD_SIDEBAR_WIDTH_BREAKPOINT = 768
export const DASHBOARD_SIDEBAR_WIDTH = 283

export const CART_TYPES = {
    METADROB_CART: 1,
    SHOPIFY_CART: 2,
    WEB_LINK: 3
}

export const INTERACTIVE_MODE = {
    LIVE: "LIVE",
    INDIVIDUAL: "INDIVIDUAL"
}

export const SHIFT_KEY_CODE = 16;
export const RUNNING_SPEED = 3;
export const WALKING_SPEED = 1;

export const PLAYER_ACTION_NAME = {
    IDLE: "idle",
    WALK: "walk",
    RUN: "run",
    WAVING: "waving",
    DISMISSING: "dismissing",
    AGREEING: "agreeing"
}

export const ACTION_KEYS = {
    WAVING: 72,
    DISMISSING: 10000,
    AGREEING: 10001,
}

export const ACTION_TIME = {
    WAVING: 1500,
    DISMISSING: 3299,
    AGREEING: 4733,
}

export const DRAWER_THEME_WIDTH = 400

export const STORE_THEME_TYPES = {
    TYPE_1: 1,
    TYPE_2: 2
}

export const STORE_THEME_CSS_STYLES = {
    [STORE_THEME_TYPES.TYPE_1]: {
        logoJustifyContent: 'start',
        storeContentLayoutCss: {
            display: 'flex',
            flexDirection: 'row',
            gap: 40,
            alignItems: 'end',
            justifyContent: 'space-between',
            width: '100%',
            textAlign: 'left',
            flexWrap: 'wrap'
        },
        textMaxWidth: '550px',
        progressJustify: 'start'
    },
    [STORE_THEME_TYPES.TYPE_2]: {
        logoJustifyContent: 'center',
        storeContentLayoutCss: {
            display: 'flex',
            flexDirection: 'column',
            gap: 32,
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            textAlign: 'center'
        },
        textMaxWidth: '80%',
        progressJustify: 'center'
    }
}

export const FONTS_OPTIONS = [
    {
        label: "Inter Bold",
        value: fonts.InterBold
    },
    {
        label: "Inter Medium",
        value: fonts.InterMedium
    },
    {
        label: "Inter Regular",
        value: fonts.InterRegular
    }
]

export const PERSONAL_QUESTIONS = [
    {
        id: 1,
        title: 'Which of these describes you best?',
        subTitle: 'How would you define yourself',
        answer: [
            {
                id: 1,
                value: 'New to Retail business',
                text: 'New to Retail business'
            },
            {
                id: 2 ,
                value: 'Retailer, I’m already selling online or in person',
                text: 'Retailer, I’m already selling online or in person'
            },
            {
                id: 3,
                value: 'A Brand Owner.',
                text: 'A Brand Owner.'
            }
        ],
        personalInfoKey: 'personalType'
    },
    {
        id: 5,
        title: 'Which industry are you from?',
        subTitle: 'Which industry your business belong to?',
        answer: [
            {
                id: 1,
                value: 'Home Decor',
                text: 'Home Decor'
            },
            {
                id: 2 ,
                value: 'Fashion',
                text: 'Fashion'
            },
            {
                id: 3,
                value: 'Furniture',
                text: 'Furniture'
            },
            {
                id: 4,
                value: 'Apparels',
                text: 'Apparels'
            },
        ],
        personalInfoKey: 'industry'
    },
    {
        id: 2,
        title: 'Where do you want to integrate the virtual store?',
        subTitle: '(How do you want to use our solution?)',
        answer: [
            {
                id: 1,
                value: 'Integrate with an existing E-commerce platform',
                text: 'Integrate with an existing E-commerce platform'
            },
            {
                id: 2 ,
                value: 'Run a complete virtual store on your own domain.',
                text: 'Run a complete virtual store on your own domain.'
            },
            {
                id: 3,
                value: 'Integrate with Metaverse (Decentraland, Roblox, etc.).',
                text: 'Integrate with Metaverse (Decentraland, Roblox, etc.).'
            },
            {
                id: 4,
                value: 'Integrate with other custom-made E-commerce stores.',
                text: 'Integrate with other custom-made E-commerce stores.'
            }
        ],
        personalInfoKey: 'intergrateFor'
    },
    {
        id: 4,
        title: 'Have you tried “Virtual Store” before?',
        // subTitle: 'Which Service is best fit for you?',
        answer: [
            {
                id: 1,
                value: 'Yes',
                text: 'Yes'
            },
            {
                id: 2 ,
                value: 'No',
                text: 'No'
            },
        ],
        personalInfoKey: 'tried'
    },
    {
        id: 3,
        title: 'Where do you want to sell your products?',
        subTitle: 'Where do you want to use our solution?',
        answer: [
            {
                id: 1,
                value: 'Worldwide',
                text: 'Worldwide'
            },
            {
                id: 2 ,
                value: 'Specific Region',
                text: 'Specific Region'
            },
        ],
        personalInfoKey: 'salesArea'
    },
]

export const EVENT_NAME = {
    HIGHTLIGHT_OBJECT: "HIGHTLIGHT_OBJECT"
}

export const MODAL_INFO_TABS = {
    OVERVIEW: "OVERVIEW",
    SPECIFICATION: "SPECIFICATION"
}

export const TRIAL_EXPIRED_DAYS = 30

export const PHOTON_EVENT_CODES = {
    DEFAULT: 0,
    RAISE: 1
}
export const ADMIN_ASSIGN_EXPIRED_DAYS = 90

export const CATEGORY_TYPE = {
    DECORATIVE: 1,
    PRODUCT: 2
}

export const PROFILE_MODE = {
    VIEW: "VIEW",
    EDIT: "EDIT"
}

export const APP_SOURCES = {
    METADROB: 1,
    DROBA: 2,
}

export const PLANS_TYPES = {
    DIGITAL_SHOWCASE: 1,
    E_COMMERCE: 2,
    EXISTING_E_COMMERCE: 3
}

export const MODAL_STORE_EDITOR_WIDTH = 377

export const OBJECT_LIST_ACTION_MODE = {
    SEARCH: "SEARCH"
}

export const TREE_DATA_NODE_TYPE = {
    FOLDER: "FOLDER",
    DECORATIVE: "DECORATIVE",
    TEXT: "TEXT",
    PRODUCT: "PRODUCT",
    OTHER: "OTHER",
    PLACEHOLDER: "PLACEHOLDER"
}

export const TRAVERSE_TREE_DATA_ACTION_NAME = {
    ADD_NEW_GROUP: "ADD_NEW_GROUP",
    UNGROUP: "UNGROUP"
}

export const FAR_CAMERA_DISTANCE = 8

export const PUBLISH_CAMERA_MODE = {
    STANDARD: "STANDARD",
    FOCUS_OBJECT: "FOCUS_OBJECT"
}

export const APP_EVENTS = {
    FOCUS_TO_PUBLISH_OBJECT: "FOCUS_TO_PUBLISH_OBJECT",
    RESET_PLAYER_AVATAR_TO_INIT_STATE: "RESET_PLAYER_AVATAR_TO_INIT_STATE"
}

export const UPLOADS_FOLDER = {
    BANNER: "banners",
    PLACEHOLDER_THUMNAIL: "placeholder-thumnails",
    MEDIA: "medias",
    MEDIA_THUMNAIL: "media-thumnails",
    PRODUCT: "products",
    PRODUCT_THUMNAIL: "product-thumnails",
    TEMPLATE: "templates",
    TEMPLATE_THUMNAIL: "template-thumnails",
    ANIMATION: "animations",
    ANIMATION_THUMNAIL: "animation-thumnails",
    DECORTATIVE: "decoratives",
    DECORATIVE_THUMNAIL: "decorative-thumnails",
    HDRI: "hdris",
    HDRI_THUMNAILS: "hdri-thumnails",
    STORE_THEME_BACKGROUND: "store-theme-backgrounds",
    STORE_THEME_BACKGROUND_THUMNAIL: "store-theme-background-thumnails",
    BRAND_LOGO: "brand-logos",
    BRAND_LOGO_THUMNAIL: "brand-logo-thumnails",
    AVATAR: "avatars",
    WALL_THUMNAIL: "wall-thumnails",
    ATTACHMENT: "attachments",
    ASSET_THUMNAIL: "asset-thumnails",
    GALLERY: "galleries",
    ASSET: "assets",
    TEXTURE: "textures",
    TEXTURE_THUMNAIL: "texture-thumnails",
    AUDIO: "audio",
    FONT: "fonts"
}

export const DIMENSION_UNITS = [
    {
        label: "Inch",
        value: "inch"
    },
    {
        label: "Cm",
        value: "cm"
    }
]

export const PLACEHOLDER_SIZES = [
    {
        label: "Small",
        value: 1,
        size: 0.5
    },
    {
        label: "Medium",
        value: 2,
        size: 1
    },
    {
        label: "Large",
        value: 3,
        size: 1.5
    },
    {
        label: "Extra large",
        value: 4,
        size: 2
    }
]

export const FRAME_3D_DEPTH = 0.05

export const USER_MENU_ACTION = {
    VIEW_HISTORY: 1,
    CONTACT_VIA_EMAIL: 2
}

export const MUSIC_AND_AUDIO_SOURCE = {
    YOUR_AUDIO: "YOUR_AUDIO",
    SPOTIFY: "SPOTIFY"
}

export const MUSIC_AND_AUDIO_TAB = {
    YOUR_AUDIO: "YOUR_AUDIO",
    SPOTIFY: "SPOTIFY",
    CLOUD_SOUND: "CLOUD_SOUND"
}

export const DRAG_FOLDER_BOX_NAME = "DRAG_FOLDER_BOX"

export const COLLIDER_PREFIX = "Collider_"
export const FLOOR_PREFIXES = ["floor_", "_floor"]
export const HIDDEN_PREFIXES = ["_hidden"]
export const SPAWN_POINT_PREFIX = "Spawn_Point"

export const NOTIFICATION_TYPES = {
    EXCEEDED_STORAGE_LIMIT: 1,
    PUBLISHED_STORE_BE_SENT_TO_DRAFT: 2
}

export const DEFAULT_AVATAR = "default-assets/avatars/Default-Avatar.png"

export const PERMISSIONS = {
    STORE_EDITOR: "store_editor",
    SALE_PERSON: "sale_person",
    UPLOAD_OTHERS: "upload_others",
    UPLOAD_MEDIA: "upload_media",
    ALL: "all",
    SUPER_ADMIN_MANAGE_USERS: "super_admin_manage_users",
    SUPER_ADMIN_MANAGE_TICKETS: "super_admin_manage_tickets",
    SUPER_ADMIN_MANAGE_ROLES: "super_admin_manage_roles",
    SUPER_ADMIN_MANAGE_APIS: "super_admin_manage_apis",
    SUPER_ADMIN_MANAGE_STORES: "super_admin_manage_stores",
    SUPER_ADMIN_MANAGE_TEMPLATES: "super_admin_manage_templates",
    SUPER_ADMIN_MANAGE_DECORATIVES: "super_admin_manage_decoratives",
    SUPER_ADMIN_MANAGE_ANIMATIONS: "super_admin_manage_animations",
    SUPER_ADMIN_MANAGE_HDRIS: "super_admin_manage_hdris",
    SUPER_ADMIN_MANAGE_TEXTS: "super_admin_manage_texts",
    SUPER_ADMIN_MANAGE_TUTORIAL_VIDEOS: "super_admin_manage_tutorial_videos",
    SUPER_ADMIN_MANAGE_PLACEHOLDERS: "super_admin_manage_placeholders",
    SUPER_ADMIN_MANAGE_PLANS: "super_admin_manage_plans",
    SUPER_ADMIN_MANAGE_MARKETING: "super_admin_manage_maketing",
    SUPER_ADMIN_MANAGE_COLLABORATION: "super_admin_manage_collaboration",
    SUPER_ADMIN_MANAGE_SETTINGS: "super_admin_manage_settings",
}

export const CSV_FILE_SOURCE = {
    SHOPIFY: "SHOPIFY",
    MAGENTO: "MAGENTO",
    WOOCOMMERCE: "WOOCOMMERCE",
    AMAZON: "AMAZON"
}

export const CSV_SHOPIFY_FIELDS = {
    HANDLE: "Handle",
    NAME: "Title",
    OBJECT_URL: "Image Src",
    DESCRIPTION: "Body (HTML)",
    PRICE: "Variant Price",
    TAGS: "Tags",
    STATUS: "Status"
}

export const CSV_WOOCOMMERCE_FIELDS = {
    ID: "ID",
    NAME: "Name",
    OBJECT_URL: "Images",
    DESCRIPTION: "Description",
    PRICE: "Regular price",
    SALE_PRICE: "Sale price",
    TAGS: "Tags",
    LENGTH: "Length (cm)",
    WIDTH: "Width (cm)",
    HEIGHT: "Height (cm)",
    WEIGHT: "Weight (kg)",
}

export const DATA_SOURCE = {
    SHOPIFY: "Shopify",
    IMPORT: "Import",
    UPLOAD: "Upload"
}

export const IMPORT_CSV_STEPS = {
    UPLOAD: 0,
    MATCH: 1,
    REPAIR: 2
}

export const IMPORT_CSV_PRODUCT_FIELD = [
    {
        field: 'uniqueId',
        label: 'UniqueId',
        isRequired: true,
    },
    {
        field: 'name',
        label: 'Name',
        isRequired: true,
    },
    {
        field: 'image',
        label: 'Image',
        isRequired: true,
    },
    // {
    //     field: 'objectUrl',
    //     label: 'Object Url',
    //     isRequired: true,
    // },
    {
        field: 'description',
        label: 'Description'
    },
    {
        field: 'price',
        label: 'Price',
        isRequired: true,
    },
    {
        field: 'discount',
        label: 'Discount',
    },
    {
        field: 'tags',
        label: 'Tags'
    }
]

export const LIST_PERMISSIONS_OPTIONS = [
    {
        "code": PERMISSIONS.STORE_EDITOR,
        "name": "Store editor",
        isForRetailer: true
    },
    {
        "code": PERMISSIONS.SALE_PERSON,
        "name": "Sale person",
        isForRetailer: true
    },
    {
        "code": PERMISSIONS.UPLOAD_OTHERS,
        "name": "Upload others",
        isForRetailer: true
    },
    {
        "code": PERMISSIONS.UPLOAD_MEDIA,
        "name": "Upload media",
        isForRetailer: true
    },
    {
        "code": PERMISSIONS.SUPER_ADMIN_MANAGE_USERS,
        "name": "Super admin manage users"
    },
    {
        "code": PERMISSIONS.SUPER_ADMIN_MANAGE_TICKETS,
        "name": "Super admin manage tickets"
    },
    {
        "code": PERMISSIONS.SUPER_ADMIN_MANAGE_ROLES,
        "name": "Super admin manage roles"
    },
    {
        "code": PERMISSIONS.SUPER_ADMIN_MANAGE_APIS,
        "name": "Super admin manage apis"
    },
    {
        "code": PERMISSIONS.SUPER_ADMIN_MANAGE_STORES,
        "name": "Super admin manage stores"
    },
    {
        "code": PERMISSIONS.SUPER_ADMIN_MANAGE_TEMPLATES,
        "name": "Super admin manage templates"
    },
    {
        "code": PERMISSIONS.SUPER_ADMIN_MANAGE_DECORATIVES,
        "name": "Super admin manage decoratives"
    },
    {
        "code": PERMISSIONS.SUPER_ADMIN_MANAGE_ANIMATIONS,
        "name": "Super admin manage animations"
    },
    {
        "code": PERMISSIONS.SUPER_ADMIN_MANAGE_HDRIS,
        "name": "Super admin manage hdris"
    },
    {
        "code": PERMISSIONS.SUPER_ADMIN_MANAGE_TEXTS,
        "name": "Super admin manage texts"
    },
    {
        "code": PERMISSIONS.SUPER_ADMIN_MANAGE_TUTORIAL_VIDEOS,
        "name": "Super admin manage tutorial videos"
    },
    {
        "code": PERMISSIONS.SUPER_ADMIN_MANAGE_PLACEHOLDERS,
        "name": "Super admin manage placeholders"
    },
    {
        "code": PERMISSIONS.SUPER_ADMIN_MANAGE_MARKETING,
        "name": "Super admin manage plans"
    },
    {
        "code": PERMISSIONS.SUPER_ADMIN_MANAGE_COLLABORATION,
        "name": "Super admin manage collaboration"
    },
    {
        "code": PERMISSIONS.SUPER_ADMIN_MANAGE_SETTINGS,
        "name": "Super admin manage settings"
    }
]