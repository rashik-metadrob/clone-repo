const TRACKING_TYPE = {
    STORE: "store",
    PRODUCT: "product"
}
const FREE_USER = "Free User"
const TRACKING_TYPE_ENUM = Object.keys(TRACKING_TYPE).map(el => TRACKING_TYPE[el])
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
const CURRENCY_LIST = [
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
const TRACKING_ACTION_NAME = {
    // Time customer stay in store
    STAY_IN_STORE: "STAY_IN_STORE",
    CLICK_PRODUCT: "CLICK_PRODUCT",
    ADD_TO_CART: "ADD_TO_CART",
    REMOVE_FROM_CART: "REMOVE_FROM_CART",
    USER_ENTER_STORE: "USER_ENTER_STORE",
    // Time retailer used to edit store
    STAY_TO_BUILD_STORE: "STAY_TO_BUILD_STORE",
}
const PROJECT_MODE = {
    PUBLISH: "publish",
    UNSAVED: "unsaved",
    ARCHIVE: "archive"
}
const USER_ROLE = {
    USER: "user",
    ADMIN: "admin",
    RETAILERS: "retailers",
    CUSTOMER: "customer"
}

const ROLE_AND_PERMISSION_DEFAULT = {
    ADMIN: "Admin",
    RETAILER: "Retailer",
    CUSTOMER: "Customer"
}

const USER_CONFIG_KEY = {
    NUM_OF_USER_ENTER_IN_MONTH: "NUM_OF_USER_ENTER_IN_MONTH",
    NUM_OF_DRAFT_STORE_IN_MONTH: "NUM_OF_DRAFT_STORE_IN_MONTH",
    NUM_OF_PRODUCTS_IN_MONTH: "NUM_OF_PRODUCTS_IN_MONTH",
    NUM_OF_PUBLISH_STORE_IN_MONTH: "NUM_OF_PUBLISH_STORE_IN_MONTH",
    USER_BRAND_LOGO: "USER_BRAND_LOGO"
}

const PRICING_PLAN_VALUE = {
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
    DEFAULT_STORE_CAPACITY: 300,
    PER_PERSION_IN_ROOM: {
        NO: false
    },
    NUM_OF_ROOMS_LOBBY_CHANNELS: {
        NO: false
    }
}

const NUMBER_OF_LIMIT_USER_IN_MONTH = 2000;

const PRICING_PLAN_FEATURES_KEY = {
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

const USER_SUBCRIPTION_KEY = {
    "PRICING_PLAN": "PRICING_PLAN"
}

const DEFAULT_PRODUCT = {
    DIMENSIONS: {
        "length": 20,
        "width": 20,
        "height": 20,
        "unit": "inch"
    },
    ACTUALWEIGHT: 10,
    BLOCK: "3D"
}

const PAYMENT_STATUS = {
    "NOT_PAYMENT": 0,
    "SUCCEEDED": 1,
    "PROCESSING": 2,
    "FAIL": 3
}

const SHIPMENT_STATUS = {
    "NOT_SHIPMENT": 0,
    "CREATED": 1
}

const PAYMENT_GATE = {
    STRIPE: "STRIPE",
    PAYPAL: "PAYPAL",
    SHOPIFY_BILLING: "SHOPIFY_BILLING",
    SHOPIFY_RECURRING_SUB: "SHOPIFY_RECURRING_SUB",
    ASSIGNED_BY_SYSTEM: "ASSIGNED_BY_SYSTEM"
}

const MESSAGE_TEXT = {
    USER_DIDNT_BUY_PRICING_PLAN: "User didn't buy pricing plan.",
    NO_PRICING_PLAN_CAN_BE_FOUND: "No pricing plan can be found.",
    REACH_LIMIT: "User has reached limit of the current plan!"
}

const FREE_PLAN = {
    "isFree": true,
    "name": "Drob Free",
    "description": "Everything you need to create your store,ship products, and process payments",
    "isRecommended": false,
    "pricing": {
      "yearly": 0,
      "monthly": 0
    },
    "features": [
        {
            "key": "TRIAL_PERIOD",
            "displayText": "Trial period",
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
    ],
    "includedInfomation": [
    ]
}

const PROJECT_TYPE = {
    PROJECT: "project",
    TEMPLATE: "template"
}

const CONTENT_TYPE = {
    GENERAL: 1,
    SPECIAL: 2
}

const STORE_THEME_TYPES = {
    TYPE_1: 1,
    TYPE_2: 2
}

const DATA_SOURCE = {
    SHOPIFY: "Shopify",
    UPLOAD: "Upload"
}

const CATEGORY_TYPE = {
    DECORATIVE: 1,
    PRODUCT: 2
}

const MODEL_BLOCK = {
    "2D": "2D",
    "3D": "3D"
}
const PRICING_PLAN_DISPLAY = {
    NONE: 'none',
    FIRST: 'first',
    SECOND: 'second',
    THIRD: 'third',
}

const RENDERER_CONFIG = {
    TONE_MAPPING_EXPOSURE: 1
}

const SERVER_FILTER_DATE_FORMAT = "YYYY-MM-DD"
const SERVER_DATE_FORMAT = "YYYY-MM-DDThh:mm:ss"

const PLAYER_GENDER = {
    MALE: "male",
    FEMALE: "female"
}

const ROLE_FOR = {
    SALE: "sale",
    CUSTOMER: "customer"
}

const WARNING_TEXTS = {
    "SHOPIFY_STORE_NOT_MATCH": "The Metadrob user doesn't match with registered Shopify store!",
    "CANT_GET_SHOPIFY_SESSION": "Can't get Shopify Session!"
}

const USER_SUBCRIPTION_ASSIGNED_BY = {
    SUPER_ADMIN: "Superadmin",
    SYSTEM: "System"
}

const SHOPIFY_RECURRING_CHARGE_NAME = "Metadrob Premium"
const SHOPIFY_RECURRING_CHARGE_AMOUNT = 1600
const SHOPIFY_RECURRING_CHARGE_DAYS = 30

const COMPRESS_DATA_TYPE = {
    PROJECT: "PROJECT",
    PRODUCT: "PRODUCT"
}

const UPLOADS_FOLDER = {
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
    AUDIO: "audio"
}

const MINIMUM_IMAGE_SIZE = 512

const COLLIDER_PREFIX = "Collider"
const FLOOR_PREFIXES = ["floor_", "_floor"]
const SPAWN_POINT_PREFIX = "Spawn_Point"

const IMAGE_FILE_EXTENSIONS = [ '.jpg', '.png', '.jepg', '.gif' ]
const AUDIO_FILE_EXTENSIONS = [ '.mp3', '.wav' ]
const VIDEO_FILE_EXTENSIONS = [ '.mp4' ]
const THREED_FILE_EXTENSIONS = [ '.glb', '.fbx', '.obj' ]

const CONFIG_TEXT = {
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
    PUBLISHED_STORE_BE_SENT_TO_DRAFT_SUBJECT: "",
    PUBLISHED_STORE_BE_SENT_TO_DRAFT_CONTENT: "Your plan is downgraded .All Published stores has been sent to the draft section!"
}

const CONFIG_TYPE = {
    BANNER: "BANNER",
    OVERRIDE_MATERIAL: "OVERRIDE_MATERIAL",
    OVERRIDE_MATERIAL_MOBILE: "OVERRIDE_MATERIAL_MOBILE",
    ANTIALIAS_DESKTOP: "ANTIALIAS_DESKTOP",
    ANTIALIAS_MOBILE: "ANTIALIAS_MOBILE",
    SHOW_HDRI_DESKTOP: "SHOW_HDRI_DESKTOP",
    SHOW_HDRI_MOBILE: "SHOW_HDRI_MOBILE",
    PIXEL_RATIO_DESKTOP: "PIXEL_RATIO_DESKTOP",
    PIXEL_RATIO_MOBILE: "PIXEL_RATIO_MOBILE",
    ZOHO_DESK_REFRESH_TOKEN: "ZOHO_DESK_REFRESH_TOKEN",
    ZOHO_DESK_ACCESS_TOKEN: "ZOHO_DESK_ACCESS_TOKEN"
}

const PERMISSIONS = {
    STORE_EDITOR: "store_editor",
    SALE_PERSON: "sale_person",
    UPLOAD_OTHERS: "upload_others",
    UPLOAD_MEDIA: "upload_media",
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
    ALL: "all"
}

const LIST_PERMISSIONS_OPTIONS = [
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

const CSV_FILE_SOURCE = {
    SHOPIFY: "SHOPIFY",
    MAGENTO: "MAGENTO",
    WOOCOMMERCE: "WOOCOMMERCE",
    AMAZON: "AMAZON"
}

const ACCOUNT_VISIBLE_FOR = {
    METADROB_ACCOUNT: 1,
    STAFF_ACCOUNT: 2
}

const STAFF_ACCOUNT_FOR = {
    METADROB: "Metadrob"
}

module.exports = {
    STAFF_ACCOUNT_FOR,
    ACCOUNT_VISIBLE_FOR,
    CSV_FILE_SOURCE,
    PERMISSIONS,
    LIST_PERMISSIONS_OPTIONS,
    CONFIG_TYPE,
    CONFIG_TEXT,
    IMAGE_FILE_EXTENSIONS,
    AUDIO_FILE_EXTENSIONS,
    VIDEO_FILE_EXTENSIONS,
    THREED_FILE_EXTENSIONS,
    SPAWN_POINT_PREFIX,
    COLLIDER_PREFIX,
    FLOOR_PREFIXES,
    MINIMUM_IMAGE_SIZE,
    COMPRESS_DATA_TYPE,
    PLAYER_GENDER,
    RENDERER_CONFIG,
    TRACKING_TYPE,
    TRACKING_TYPE_ENUM,
    TRACKING_ACTION_NAME,
    PROJECT_MODE,
    USER_ROLE,
    CURRENCY,
    CURRENCY_LIST,
    USER_CONFIG_KEY,
    NUMBER_OF_LIMIT_USER_IN_MONTH,
    PRICING_PLAN_FEATURES_KEY,
    USER_SUBCRIPTION_KEY,
    DEFAULT_PRODUCT,
    PAYMENT_STATUS,
    FREE_USER,
    PAYMENT_GATE,
    MESSAGE_TEXT,
    FREE_PLAN,
    PRICING_PLAN_VALUE,
    PROJECT_TYPE,
    CONTENT_TYPE,
    MODEL_BLOCK,
    SHIPMENT_STATUS,
    PRICING_PLAN_DISPLAY,
    DATA_SOURCE,
    SERVER_FILTER_DATE_FORMAT,
    WARNING_TEXTS,
    STORE_THEME_TYPES,
    ROLE_FOR,
    CATEGORY_TYPE,
    SERVER_DATE_FORMAT,
    USER_SUBCRIPTION_ASSIGNED_BY,
    SHOPIFY_RECURRING_CHARGE_NAME,
    SHOPIFY_RECURRING_CHARGE_AMOUNT,
    SHOPIFY_RECURRING_CHARGE_DAYS,
    UPLOADS_FOLDER,
    ROLE_AND_PERMISSION_DEFAULT
}
