const httpStatus = require('http-status');
const { Product, Order } = require('../models');
const ApiError = require('../utils/ApiError');
const { allProductTypes, productTypes, PRODUCT_TYPES } = require('../config/productType');
const { USER_ROLE, PAYMENT_STATUS, COMPRESS_DATA_TYPE, CSV_FILE_SOURCE } = require('../utils/constant');
const mongoose = require('mongoose');
const _ = require('lodash')
const { getFileSize } = require('../utils/storageUtils');
const { createCompressRequest } = require('../utils/compressUtils');

/**
 * Query for librarys
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryProducts = async (filter, options) => {
    let filterPro = {
        ...filter,
        $or: [{"isDeleted": {$exists: false}}, {"isDeleted": false}]
    }
    const librarys = await Product.paginate(filterPro, options);
    librarys.results = librarys.results.map(el => {
        const obj = el.toObject()
        obj.typeText = allProductTypes[el.type]
        obj.id = obj['_id']
        delete obj['_id']
        return obj
    })
    return librarys;
};

const getAllProducts = async ( filter) => {
  const results = await Product.find({
    ...filter,
    type: PRODUCT_TYPES.PRODUCTS,
    isDeleted: {$ne: true}
  }).select("id block name image objectUrl categoryId")

  return results
}

const queryPublicProducts = async ( filter, options) => {
  const limit = options.limit && parseInt(options.limit.toString(), 10) > 0 ? parseInt(options.limit.toString(), 10) : 10;
  const page = options.page && parseInt(options.page.toString(), 10) > 0 ? parseInt(options.page.toString(), 10) : 1;
  const skip = (page - 1) * limit;
  let sort = '';
  if (options.sortBy) {
    const sortingCriteria = [];
    options.sortBy.split(',').forEach((sortOption) => {
      const [key, order] = sortOption.split(':');
      sortingCriteria.push((order === 'desc' ? '-' : '') + key);
    });
    sort = sortingCriteria.join(' ');
  } else {
    sort = 'createdAt';
  }

  let filterExp = {
    type: {$all: filter.type !== undefined ? [+filter.type] : productTypes}
  }
  if(filter.types) {
    filterExp.type = filter.types
  }
  if(filter.categoryId){
    filterExp.categoryId = { $eq: mongoose.Types.ObjectId(filter.categoryId) }
  }
  if(filter.name){
    filterExp.name = filter.name
  }
  if(filter.isDisabled){
    filterExp.isDisabled = filter.isDisabled
  }
  let conditions = [];
  // filter['$and'] : Array
  if(filter['$and'] && typeof filter['$and'] === "object"){
      conditions = [...filter['$and']]
  }
  const expression = [
    {
      $match: {
        ...filterExp,
        $and: [
          {$or: [{"isDeleted": {$exists: false}}, {"isDeleted": false}]},
          ...conditions
        ]
      }
    },
    {
      $lookup:{
        from: 'users',
        localField: 'createdBy',
        foreignField: '_id',
        as: 'createds'
      }
    },
    {
      $addFields: {
        created: { $arrayElemAt: [ "$createds", 0 ] }
      }
    },
    { $unset: "createds" },
    {
      $match: {
        $or: [
          { "created.role": USER_ROLE.ADMIN }
        ]
      }
    },
    { $unset: "created" }
  ]

  const rs = await Product.aggregate(expression)

  const countPromise = await Product.aggregate(
    [
      ...expression,
      {
        $count: "totalResults"
      }
    ]
  )

  const docsPromise = await Product.aggregate(
    [
      ...expression,
      { $addFields: {
          id: "$_id"
        }
      }
    ]
  ).sort(sort).skip(skip).limit(limit)

  await Product.populate(docsPromise, {path: 'plans', select: 'id name isFree'})

  return Promise.all([countPromise, docsPromise]).then((values) => {
    const [totalRs, results] = values;
    let totalResults = rs.length > 0 ? totalRs[0].totalResults : 0;
    const totalPages = Math.ceil(totalResults / limit);
    const result = {
      results,
      page,
      limit,
      totalPages,
      totalResults,
    };
    return Promise.resolve(result);
  });
};

const getProductTypes = (role) => {
    let results = productTypes.map(el => {
        return {
            value: +el,
            label: allProductTypes[el]
        }
    })
    if(role !== USER_ROLE.ADMIN){
        results = results.filter(el => el.value !== PRODUCT_TYPES.DECORATIVES)
    }
    return { results }
}

/**
 * Create a user
 * @param {Object} productBody
 * @returns {Promise<User>}
 */
const createProduct = async (productBody) => {
    let body = _.cloneDeep(productBody)

    const objectUrl = _.get(body, ['objectUrl'])
    if(objectUrl && objectUrl.includes('.glb') && !(objectUrl.includes('http:') || objectUrl.includes('https:'))){
      body.isCompressing = true
      createCompressRequest(objectUrl, COMPRESS_DATA_TYPE.PRODUCT)
    }
    if(objectUrl) {
      body.size = getFileSize(objectUrl)
    }

    return Product.create(body);
};

// Shopify product. No 3D
const createMultiProduct = async (products) => {
  return Product.insertMany(products);
};

const importProductFromCsvFile = async (products) => {
  for(let i = 0; i < products.length; i++){
    const productData = products[i]

    const product = await Product.findOne({
      uniqueId: productData.uniqueId,
      createdBy: productData.createdBy,
      isDeleted: {$ne: true}
    })

    if(product) {
      Object.assign(product, productData);
      await product.save();
    } else {
      await Product.create(productData)
    }
  }
};

const getProductById = async (id) => {
    return Product.findById(id);
};
const getProductByShopifyProductId = async (shopifyProductId) => {
  return Product.findOne({shopifyProductId});
};
const getProductByShopifyVariantMerchandiseId = async (shopifyVariantMerchandiseId) => {
  return Product.findOne({shopifyVariantMerchandiseId: shopifyVariantMerchandiseId});
};

const updateProductById = async (id, updateBody) => {
    const prod = await getProductById(id);
    if (!prod) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
    }
    const body = _.cloneDeep(updateBody)
    const objectUrl = _.get(body, ['objectUrl'])
    if(objectUrl && objectUrl.includes('.glb') && !(objectUrl.includes('http:') || objectUrl.includes('https:')) && _.get(prod, ['objectUrl']) != objectUrl){
      body.isCompressing = true
      createCompressRequest(objectUrl, COMPRESS_DATA_TYPE.PRODUCT)
    }

    if(objectUrl && _.get(prod, ['objectUrl']) != objectUrl) {
      body.size = getFileSize(objectUrl)
    }

    Object.assign(prod, body);
    await prod.save();
    return prod;
  };

const deleteProductById = async (prodId) => {
    const prod = await getProductById(prodId);
    if (!prod) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
    }
    Object.assign(prod, {isDeleted: true});
    await prod.save();
    return prod;
};

const getProductsOfTheMonth = async (userId) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  return await Order.aggregate([
    {
      $addFields: {
        id: "$_id",
        item: { $arrayElemAt: [ "$items", 0 ] }
      }
    },
    {
      $addFields: {
        convertedId: { $toObjectId: "$item.storeId"}
      }
    },
    {
      $lookup:{
        from: 'projects',
        localField: 'convertedId',
        foreignField: '_id',
        as: 'projects'
      }
    },
    {
      $addFields: {
        store: { $arrayElemAt: [ "$projects", 0 ] }
      }
    },
    {
      $addFields: {
        sellerId: "$store.createdBy",
      }
    },
    {
      $match: {
        sellerId: userId
      }
    },
    {
      $unset: ['store', 'projects', 'convertedId', 'item']
    },
    {
      $match: { paymentStatus: PAYMENT_STATUS.SUCCEEDED},
    },
    {
      $addFields: {
        groupMonth: { 
          $month: "$createdAt"
        },
        groupYear: { 
          $year: "$createdAt"
        },
      }
    },
    {
      $match: {
        groupMonth: {$eq: currentMonth},
        groupYear: {$eq: currentYear},
      }
    },
    { 
      $unwind: "$items" 
    },
    {
      $group: {
        _id: "$items.id",
        id: { $first: "$items.id" },
        image: { $first: "$items.image" },
        name: { $first: "$items.name" },
        count: { $sum: 1 }
      }
    },
    {
      $match: {
       id: {$ne: null}
      }
    }
  ]).limit(5)
}

const getAllThumnail = async () => {
  return await Product.aggregate([
    {
      $match: {
        "image": {$exists: true}
      }
    },
    {
      $project: {
          "thumnail": "$image"
      }
    }
  ])
}

const updateManyProductSyncFromWebhooks = async (shopifyProductId, body) => {
  return Product.updateMany(
    {
      $and: [
        {"shopifyProductId": {$exists: true}},
        {"shopifyProductId": { "$regex": new RegExp(shopifyProductId.toString(), "i") }}
      ]
    },
    {
      $set: body
    }
  )
}

module.exports = {
    queryProducts,
    getProductTypes,
    createProduct,
    deleteProductById,
    updateProductById,
    getProductById,
    queryPublicProducts,
    createMultiProduct,
    getProductByShopifyVariantMerchandiseId,
    getProductsOfTheMonth,
    updateManyProductSyncFromWebhooks,
    getAllThumnail,
    getProductByShopifyProductId,
    getAllProducts,
    importProductFromCsvFile
};