const PLACEHOLDER_SIZES = {
    SMALL: 1,
    MEDIUM: 2,
    LARGE: 3,
    EXTRA_LARGE: 4
}
const allPlaceholdeSizes = {
    1: "Small",
    2: "Medium",
    3: "Large",
    4: "Extra large",
};

const placeholderSizes = Object.keys(allPlaceholdeSizes).map(el => +el);

module.exports = {
    placeholderSizes,
    allPlaceholdeSizes,
    PLACEHOLDER_SIZES
};