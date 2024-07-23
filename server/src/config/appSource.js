const APP_SOURCES = {
    METADROB: 1,
    DROBA: 2,
}
const allAppSources = {
    1: "Metadrob",
    2: "Drob A",
};

const appSources = Object.keys(allAppSources).map(el => +el);

module.exports = {
    appSources,
    allAppSources,
    APP_SOURCES
};