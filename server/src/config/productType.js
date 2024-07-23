const PRODUCT_TYPES = {
    DECORATIVES: 0,
    PRODUCTS: 1,
    TEXT: 2,
    ANIMATION: 3,
    EFFECTS: 4,
    SOUND: 5,
    ELEMENT: 6,
    MEDIA: 7,
    PLACEHOLDER: 8
}
const allProductTypes = {
    0: "Decoratives",
    1: "Products",
    2: "Text",
    3: "Animation",
    4: "Effects",
    5: "Sound",
    6: "Element",
    7: "Media",
    8: "Placeholder"
};

const productTypes = Object.keys(allProductTypes).map(el => +el);

module.exports = {
    productTypes,
    allProductTypes,
    PRODUCT_TYPES
};