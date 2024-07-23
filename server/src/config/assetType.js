const ASSET_TYPES = {
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
const allAssetTypes = {
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
};

const assetTypes = Object.keys(allAssetTypes).map(el => +el);

module.exports = {
    assetTypes,
    allAssetTypes,
    ASSET_TYPES
};