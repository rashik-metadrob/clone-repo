const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { productCategoryService } = require('../services');
const CONSTANTS = require("../utils/constant")

const getAllCustomerCategories = catchAsync(async (req, res) => {
  const cates = await productCategoryService.getAllCustomerCategories();
  res.send(cates);
});

const createProductCategory = catchAsync(async (req, res) => {
  const user = req.user;
  const body = Object.assign(req.body, {createdBy: user._id})
  const cate = await productCategoryService.createProductCategory(body);
  res.status(httpStatus.CREATED).send(cate);
});

const getDecorativeCategories = catchAsync(async (req, res) => {
  const cates = await productCategoryService.getDecorativeCategories();
  res.send(cates);
});

const getProductCategory = catchAsync(async (req, res) => {
    const cate = await productCategoryService.getProductCategoryById(req.params.id);
    if (!cate) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Product category not found');
    }
    res.send(cate);
});

const getProductCategories = catchAsync(async (req, res) => {
  const user = req.user;
  let filter = pick(req.query, ['name', 'type']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  if(req.query.search){
    filter = {
      ...filter,
      name: {
        "$regex": new RegExp(req.query.search.toLowerCase(), "i")
      }
    }
  }

  const result = await productCategoryService.queryPublicProductCategories(filter, options, user._id);
  res.send(result);
});

const updateProductCategory = catchAsync(async (req, res) => {
    const cate = await productCategoryService.updateProductCategoryById(req.params.id, req.body);
    if (!cate) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Product category not found');
    }
    res.send(cate);
});

const deleteProductCategory = catchAsync(async (req, res) => {
  let cate = await productCategoryService.deleteProductCategoryById(req.query.id);
  res.send(cate);
});
  
module.exports = {
    getProductCategory,
    updateProductCategory,
    getProductCategories,
    createProductCategory,
    deleteProductCategory,
    getDecorativeCategories,
    getAllCustomerCategories
};