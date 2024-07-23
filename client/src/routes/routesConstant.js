import global from "../redux/global"

const routesConstant = {
    home: {
        path: "/",
        name: "Home"
    },
    invitation: {
        path: "/invitation",
        name: "Invitation"
    },
    login: {
        path: "/login",
        name: "Login"
    },
    adminLogin: {
        path: "/admin-login",
        name: "Admin login"
    },
    shopifyAdminLogin: {
        path: "/admin-shopify-login",
        name: "Shopify Admin login"
    },
    forgotPassword: {
        path: "/forgot-password",
        name: "Forgot password"
    },
    verifyEmail: {
        path: "/verify-email",
        name: "Verify email"
    },
    resetPassword: {
        path: "/reset-password",
        name: "Reset password"
    },
    register: {
        path: "/register",
        name: "Register"
    },
    dashboardHome: {
        path: "/dashboard/home",
        name: "Home"
    },
    dashboardSupport: {
        path: "/dashboard/support",
        name: "Support"
    },
    dashboardOrders: {
        path: "/dashboard/orders",
        name: "Orders"
    },
    dashboardTutorial: {
        path: "/dashboard/tutorial",
        name: "Tutorial"
    },
    dashboardProduct: {
        path: "/dashboard/products",
        name: "Product"
    },
    dashboardCustomers: {
        path: "/dashboard/customers",
        name: "Customers"
    },
    dashboardCreateProduct: {
        path: "/dashboard/products/create",
        name: "Product"
    },
    dashboardInvite: {
        path: "/dashboard/invite",
        name: "Staff"
    },
    dashboardEditProduct: {
        path: "/dashboard/products/edit/:id",
        name: "Product"
    },
    dashboardEditMedia: {
        path: "/dashboard/medias/edit/:id",
        name: "Media"
    },
    dashboardDiscounts: {
        path: "/dashboard/discounts",
        name: "Discounts"
    },
    dashboardAnalytics: {
        path: "/dashboard/analytics",
        name: "Analytics"
    },
    dashboardMarketing: {
        path: "/dashboard/marketing",
        name: "Marketing"
    },
    dashboardPlugins: {
        path: "/dashboard/plugins",
        name: "Plugins"
    },
    dashboardRooms: {
        path: "/dashboard/rooms",
        name: "Rooms"
    },
    dashboardStore: {
        path: "/dashboard/store",
        name: "Store"
    },
    dashboardShopifyManager: {
        path: "/dashboard/shopify-manager",
        name: "ShopifyManager"
    },
    customer: {
        path: "/customer",
        name: "Customer"
    },
    customerProfile: {
        path: "/customer/profile",
        name: "Profile"
    },
    shopifyAdmin: {
        path: "/admin-shopify",
        name: "Shopify Admin|Home"
    },
    admin: {
        path: "/admin",
        name: "Admin|Home"
    },
    adminHome: {
        path: "/admin/home",
        name: "Admin|Home"
    },
    shopifyAdminHome: {
        path: "/admin-shopify/home",
        name: "Shopify Admin|Home"
    },
    adminCreateTemplate: {
        path: "/admin/template/create",
        name: "Admin|CreateTemplate"
    },
    adminCreateBanner: {
        path: "/admin/banner/create",
        name: "Admin|CreateBanner"
    },
    adminUpload: {
        path: "/admin/upload",
        name: "Admin|Upload"
    },
    shopifyAdminUpload: {
        path: "/admin-shopify/upload",
        name: "Shopify Admin|Upload"
    },
    adminUsers: {
        path: "/admin/users",
        name: "Admin|Users"
    },
    shopifyAdminUsers: {
        path: "/admin-shopify/users",
        name: "Shopify Admin|Users"
    },
    adminPricingPlan: {
        path: "/admin/pricing-plan",
        name: "Admin|PricingPlan"
    },
    adminApi: {
        path: "/admin/api",
        name: "Admin|Api"
    },
    adminStore: {
        path: "/admin/store",
        name: "Admin|Store"
    },
    shopifyAdminStore: {
        path: "/admin-shopify/store",
        name: "Shopify Admin|Store"
    },
    adminUploadTemplate: {
        path: "/admin/upload/template",
        name: "Admin|Upload"
    },
    shopifyAdminUploadTemplate: {
        path: "/admin-shopify/upload/template",
        name: "Admin|Upload"
    },
    adminUploadCreateTemplate: {
        path: "/admin/upload/template/create",
        name: "Admin|Upload"
    },
    shopifyAdminUploadCreateTemplate: {
        path: "/admin-shopify/upload/template/create",
        name: "Shopify Admin|Upload"
    },
    adminUploadDecorative: {
        path: "/admin/upload/decorative",
        name: "Admin|Upload"
    },
    shopifyAdminUploadDecorative: {
        path: "/admin-shopify/upload/decorative",
        name: "Shopify Admin|Upload"
    },
    adminUploadCreateDecorative: {
        path: "/admin/upload/decorative/create",
        name: "Admin|Upload"
    },
    shopifyAdminUploadCreateDecorative: {
        path: "/admin-shopify/upload/decorative/create",
        name: "Shopify Admin|Upload"
    },
    adminUploadAnimation: {
        path: "/admin/upload/animation",
        name: "Admin|Upload"
    },
    shopifyAdminUploadAnimation: {
        path: "/admin-shopify/upload/animation",
        name: "Shopify Admin|Upload"
    },
    adminUploadCreateAnimation: {
        path: "/admin/upload/animation/create",
        name: "Admin|Upload"
    },
    shopifyAdminUploadCreateAnimation: {
        path: "/admin-shopify/upload/animation/create",
        name: "Shopify Admin|Upload"
    },
    adminUploadHdri: {
        path: "/admin/upload/hdri",
        name: "Admin|Upload"
    },
    shopifyAdminUploadHdri: {
        path: "/admin-shopify/upload/hdri",
        name: "Shopify Admin|Upload"
    },
    adminUploadCreateHdri: {
        path: "/admin/upload/hdri/create",
        name: "Admin|Upload"
    },
    shopifyAdminUploadCreateHdri: {
        path: "/admin-shopify/upload/hdri/create",
        name: "Shopify Admin|Upload"
    },
    adminPlan: {
        path: "/admin/plan",
        name: "Admin|PricingPlan"
    },
    shopifyAdminPlan: {
        path: "/admin-shopify/plan",
        name: "Shopify Admin|PricingPlan"
    },
    adminUploadTutorialVideo: {
        path: "/admin/upload/tutorial-video",
        name: "Admin|Upload"
    },
    shopifyAdminUploadTutorialVideo: {
        path: "/admin-shopify/upload/tutorial-video",
        name: "Shopify Admin|Upload"
    },
    adminUploadPlaceholder: {
        path: "/admin/upload/placeholder",
        name: "Admin|Upload"
    },
    shopifyAdminUploadPlaceholder: {
        path: "/admin-shopify/upload/placeholder",
        name: "Shopify Admin|Upload"
    },
    adminUploadText: {
        path: "/admin/upload/text",
        name: "Admin|Upload"
    },
    shopifyAdminUploadText: {
        path: "/admin-shopify/upload/text",
        name: "Shopify Admin|Upload"
    },
    adminAddEditPlan: {
        path: "/admin/plan/:formMode/:planId",
        name: "Admin|PricingPlan"
    },
    adminMarketing: {
        path: "/admin/marketing",
        name: "Admin|Marketing"
    },
    adminSetting: {
        path: "/admin/settings",
        name: "Admin|Settings"
    },
    adminTickets: {
        path: "/admin/tickets",
        name: "Admin|Tickets"
    },
    shopifyAdminSetting: {
        path: "/admin-shopify/settings",
        name: "Shopify Admin|Settings"
    },
    adminCollaboration: {
        path: "/admin/collaboration",
        name: "Admin|Collaboration"
    },
    adminEditTemplate: {
        path: "/admin/template/:editTemplateMode/:id",
        name: "Admin|EditTemplate"
    },
    shopifyAdminEditTemplate: {
        path: "/admin-shopify/template/:editTemplateMode/:id",
        name: "Admin|EditTemplate"
    },
    adminEditDecorative: {
        path: "/admin/decorative/edit/:id",
        name: "Admin|EditTemplate"
    },
    shopifyAdminEditDecorative: {
        path: "/admin-shopify/decorative/edit/:id",
        name: "Shopify Admin|EditTemplate"
    },
    adminRoleAndPermission: {
        path: "/admin/role-and-permission",
        name: "Admin|Role and Permission"
    },
    dashboardProfile: {
        path: "/dashboard/profile",
        name: "Profile"
    },

    // Handle first login
    retailerFirstLogin: {
        path: "/retailer-first-login",
        name: "Metadrob"
    },
    shopifyFirstLogin: {
        path: "/embeded-shopify-first-login",
        name: "Metadrob"
    },
    firstLogin: {
        path: global.IS_SHOPIFY ? "/embeded-shopify-first-login" : "/retailer-first-login",
        name: "Metadrob"
    },

    //Shopify
    shopify: {
        path: "/home-shopify",
        name: "Metadrob"
    }
}

export default routesConstant