const Joi = require('joi');

const queryRoleAndPermissions = {
    query: Joi.object().keys({
        isSuperAdminRole: Joi.bool().default(false),
        search: Joi.optional(),
        sortBy: Joi.optional(),
        limit: Joi.optional(),
        page: Joi.optional(),
    }),
};


module.exports = {
    queryRoleAndPermissions
};