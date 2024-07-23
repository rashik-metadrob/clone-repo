const CART_TYPES = {
    METADROB_CART: 1,
    SHOPIFY_CART: 2,
    WEB_LINK: 3
}
const allCartTypes = {
    1: "Metadrob cart",
    2: "Shopify cart",
    3: "Web link"
};

const cartTypes = Object.keys(allCartTypes).map(el => +el);

module.exports = {
    cartTypes,
    allCartTypes,
    CART_TYPES
};