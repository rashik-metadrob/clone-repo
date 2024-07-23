const Joi = require('joi');

const queryAssets = {
    query: Joi.object().keys({
        filterExts: Joi.optional(),
        type: Joi.optional(),
        search: Joi.optional(),
        isOnlyNonDisable: Joi.bool(),
        sortBy: Joi.optional(),
        limit: Joi.optional(),
        page: Joi.optional(),
    }),
};

module.exports = {
    queryAssets
};