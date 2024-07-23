const Joi = require('joi');

const createInvitation = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    roleId: Joi.string().required(),
  }),
};

const getInvitation = {
  query: Joi.object().keys({
    code: Joi.string().required(),
  }),
};

module.exports = {
    createInvitation,
    getInvitation
};