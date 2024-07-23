const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { productService, userService, trackingService } = require('../services');
const { CURRENCY_LIST, CONTENT_TYPE, CSV_FILE_SOURCE, ACCOUNT_VISIBLE_FOR } = require('../utils/constant');
const { PRODUCT_TYPES } = require('../config/productType');
const _ = require('lodash')

const getProductTypes = catchAsync(async (req, res) => {
    const role = req.user.role
    const result = await productService.getProductTypes(role);
    res.send(result);
});

const getProductCurrencies = catchAsync(async (req, res) => {
  const results = CURRENCY_LIST.map(el => {
    return {
      value: el.code,
      label: el.name
  }
  })
  res.send({results});
});

const createProduct = catchAsync(async (req, res) => {
    const user = req.user;
    const body = Object.assign(req.body, {createdBy: user._id})
    const product = await productService.createProduct(body);
    res.status(httpStatus.CREATED).send(product);
});

const createProducts = catchAsync(async (req, res) => {
  const products = await productService.createMultiProduct(req.body);
  res.status(httpStatus.CREATED).send(products);
});

const importProductsFromCsv = catchAsync(async (req, res) => {
  await productService.importProductFromCsvFile(req.body);

  res.status(httpStatus.CREATED).send();
});

const getProducts = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'type', 'createdBy', 'categoryId']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  if(!options.sortBy){
    options.sortBy = "createdAt:desc"
  }
  const result = await productService.queryProducts(filter, options);
  res.send(result);
});

const getProductsByUser = catchAsync(async (req, res) => {
    const user = req.user;
    let filterQuery = pick(req.query, ['name', 'type', 'categoryId', 'block', 'cartType']);
    if(req.query.types){
      filterQuery = {
        ...filterQuery,
        type: {
          $in: req.query.types
        }
      }
    }
    if(req.query.search){
      filterQuery = {
        ...filterQuery,
        name: {
          "$regex": new RegExp(req.query.search.toLowerCase(), "i")
        }
      }
    }

    const retailerOwnerId = null
    const staffAccountFor = _.get(user, ['staffAccountFor'])
    const role = _.find(_.get(user, ['userRoles'], []), el => !el.isSuperAdminRole && el.invitedBy.toString() == staffAccountFor)
    if(role) {
      retailerOwnerId = role.invitedBy
    }

    const filter = Object.assign(filterQuery, { createdBy: retailerOwnerId ? retailerOwnerId : user._id})
    if(req.query.isOnlyNonDisable) {
      filter.isDisabled = {$ne: true}
    }
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    if(!options.sortBy){
      options.sortBy = "createdAt:desc"
    }
    const result = await productService.queryProducts(filter, options);
    res.send(result);
});
const getAllProducts = catchAsync(async (req, res) => {
  const user = req.user;

  const result = await productService.getAllProducts({createdBy: user._id});
  res.send(result);
})
const getPublicsProducts = catchAsync(async (req, res) => {
  const user = req.user;
  let filterQuery = pick(req.query, ['name', 'type', 'categoryId', 'types']);
  filterQuery['$and'] = []
  if(_.has(filterQuery, ['type']) && filterQuery.type == PRODUCT_TYPES.DECORATIVES){
    const contentTypes = await userService.getContentTypeOfUser(user._id);
    filterQuery['$and'].push({
      $or: [{"contentType": {$exists: false}}, {"contentType": {$in: contentTypes}}]
    })
  } else if(filterQuery.types){
    const contentTypes = await userService.getContentTypeOfUser(user._id);
    filterQuery['$and'].push({
      $or: [{"contentType": {$exists: false}}, {"contentType": {$in: contentTypes}}]
    })
    filterQuery['types'] = {$in: filterQuery.types.split(",").map(el => +el)}
  }

  if(req.query.search){
      filterQuery = {
        ...filterQuery,
        name: {
          "$regex": new RegExp(req.query.search.toLowerCase(), "i")
        }
      }
  }
  const filter = filterQuery
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  if(!options.sortBy){
    options.sortBy = "createdAt:desc"
  }
  if(req.query.isOnlyNonDisable) {
    filter.isDisabled = {$ne: true}
  }
  
  const result = await productService.queryPublicProducts(filter, options);
  res.send(result);
});

const getPublicsProductsForViewer = catchAsync(async (req, res) => {
  let filterQuery = pick(req.query, ['name', 'type', 'types', 'categoryId']);
  filterQuery['$and'] = []
  filterQuery['$and'].push({
    $or: [{"contentType": {$exists: false}}, {"contentType": {$in: [CONTENT_TYPE.GENERAL]}}]
  })
  if(filterQuery.types && filterQuery.types.includes(PRODUCT_TYPES.DECORATIVES)){
    filterQuery['types'] = {$in: filterQuery.types.split(",").map(el => +el)}
  }
  if(req.query.search){
      filterQuery = {
        ...filterQuery,
        name: {
          "$regex": new RegExp(req.query.search.toLowerCase(), "i")
        }
      }
    }
  const filter = filterQuery
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  if(!options.sortBy){
    options.sortBy = "createdAt:desc"
  }
  const result = await productService.queryPublicProducts(filter, options);
  res.send(result);
});

const getProduct = catchAsync(async (req, res) => {
  const prod = await productService.getProductById(req.query.id);
  if (!prod) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  res.send(prod);
});

const getProductByShopifyVariantMerchandiseId = catchAsync(async (req, res) => {
  const prod = await productService.getProductByShopifyVariantMerchandiseId(req.query.shopifyVariantMerchandiseId);
  if (!prod) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  res.send(prod);
});

const deleteProduct = catchAsync(async (req, res) => {
  const product = await productService.deleteProductById(req.query.id);
  res.send(product);
});

const updateProduct = catchAsync(async (req, res) => {
  const product = await productService.updateProductById(req.query.id, req.body);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  res.send(product);
});

const getProductsOfTheMonth = catchAsync(async (req, res) => {
  const user = req.user
  let products = await productService.getProductsOfTheMonth(user._id);
  if(products && products.length > 0){
    for(let i = 0; i < products.length; i ++){
      const viewEd = await trackingService.getTotalViewedOfProductInMonth(user._id, products[i].id)
      products[i].viewed = _.get(viewEd, [0, 'count'], 0)
      const addToCart = await trackingService.getTotalAddToCartOfProductInMonth(user._id, products[i].id)
      products[i].addToCart = _.get(addToCart, [0, 'count'], 0)
    }
  }
  products = _.orderBy(products, ['count'], ['desc'])
  res.send(products);
});

module.exports = {
    getProducts,
    getProductTypes,
    createProduct,
    getProductsByUser,
    deleteProduct,
    updateProduct,
    getProduct,
    getPublicsProducts,
    getProductCurrencies,
    createProducts,
    getProductByShopifyVariantMerchandiseId,
    getProductsOfTheMonth,
    getPublicsProductsForViewer,
    getAllProducts,
    importProductsFromCsv
};