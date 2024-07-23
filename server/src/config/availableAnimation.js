const AVAILABLE_ANIMATION = {
    LOOP_FOREVER: 1,
    LOOP_ONE: 2,
    PLAY_NEVER: 3
}
const allAvailableAnimations = {
    1: "Loop Forever",
    2: "Loop Once",
    3: "Play never",
};

const availableAnimations = Object.keys(allAvailableAnimations).map(el => +el);

module.exports = {
    availableAnimations,
    allAvailableAnimations,
    AVAILABLE_ANIMATION
};