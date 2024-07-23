const httpStatus = require('http-status');
const { Address } = require('../models');
const ApiError = require('../utils/ApiError');
const _ = require('lodash')

const createAddress = async (body) => {
  return Address.create(body);
};

const getAddressById = async (id) => {
  return Address.findById(id);
};

const updateAddressById = async (id, updateBody) => {
  const address = await getAddressById(id);
  if (!address) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Address not found');
  }

  Object.assign(address, updateBody);
  await address.save();
  return address;
};

const deleteAddressById = async (prodId) => {
  const address = await getAddressById(prodId);
  if (!address) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Address not found');
  }
  Object.assign(address, {isDeleted: true});
  await address.save();
  return address;
};

const queryAllAddresss = async (filter) => {
  return Address.find(filter);
};

module.exports = {
    createAddress,
    updateAddressById,
    getAddressById,
    deleteAddressById,
    queryAllAddresss
};