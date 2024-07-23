const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { addressService } = require('../services');

const createAddress = catchAsync(async (req, res) => {
    const user = req.user;
    const body = Object.assign(req.body, {createdBy: user._id})
    const address = await addressService.createAddress(body);
    res.status(httpStatus.CREATED).send(address);
});

const getAllAddresss = catchAsync(async (req, res) => {
  const user = req.user;
  let filter = pick(req.query, ['type']);
  filter.createdBy = user._id;
  filter.isDeleted = false;
  const result = await addressService.queryAllAddresss(filter);
  res.send(result);
});

const getAddress= catchAsync(async (req, res) => {
  const address = await addressService.getAddressById(req.query.id);
  res.send(address);
})

const deleteAddress = catchAsync(async (req, res) => {
  const address = await addressService.deleteAddressById(req.query.id);
  res.send(address);
});

const updateAddress = catchAsync(async (req, res) => {
  const address = await addressService.updateAddressById(req.query.id, req.body);
  if (!address) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Address not found');
  }
  res.send(address);
});

module.exports = {
    getAllAddresss,
    createAddress,
    deleteAddress,
    updateAddress,
    getAddress
};