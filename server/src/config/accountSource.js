const ACCOUNT_SOURCES = {
    METADROB: 1,
    SOCIAL: 2,
    SHOPIFY: 3
}
const allAccountSources = {
    1: "Metadrob",
    2: "Social",
    3: "Shopify"
};

const accountSources = Object.keys(allAccountSources).map(el => +el);

module.exports = {
    accountSources,
    allAccountSources,
    ACCOUNT_SOURCES
};