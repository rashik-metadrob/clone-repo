const Joi = require('joi');

const getProjectById = {
  query: Joi.object().keys({
    isPublishMode: Joi.bool()
  }),
};

module.exports = {
    getProjectById
};