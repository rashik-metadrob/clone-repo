const Joi = require('joi');

const queryHdriByAdmin = {
    query: Joi.object().keys({
        sortBy: Joi.optional(),
        limit: Joi.optional(),
        page: Joi.optional(),
        search: Joi.optional(),
    }),
};

const queryAllHdri = {
    query: Joi.object().keys({
        isOnlyNonDisable: Joi.bool(),
    }),
};

module.exports = {
    queryHdriByAdmin,
    queryAllHdri
};