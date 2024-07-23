const Joi = require('joi');

const queryPublicProducts = {
    query: Joi.object().keys({
        name: Joi.optional(),
        type: Joi.optional(),
        categoryId: Joi.optional(),
        types: Joi.optional(),
        search: Joi.optional(),
        isOnlyNonDisable: Joi.bool(),
        sortBy: Joi.optional(),
        limit: Joi.optional(),
        page: Joi.optional(),
    }),
};

const queryProductByUser = {
    query: Joi.object().keys({
        name: Joi.optional(),
        type: Joi.optional(),
        categoryId: Joi.optional(),
        block: Joi.optional(),
        cartType: Joi.optional(),
        types: Joi.optional(),
        search: Joi.optional(),
        isOnlyNonDisable: Joi.bool(),
        sortBy: Joi.optional(),
        limit: Joi.optional(),
        page: Joi.optional(),
    }),
}

module.exports = {
    queryPublicProducts,
    queryProductByUser
};