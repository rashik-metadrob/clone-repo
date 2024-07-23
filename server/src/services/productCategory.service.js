const { ProductCategory } = require('../models');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const { USER_ROLE, CATEGORY_TYPE } = require('../utils/constant');
const _ = require('lodash')

const createProductCategory = async (body) => {
    if(body.name && body.createdBy){
        const cate = await getProductCategoryByNameAndCreatedBy(body.name, body.createdBy);
        if (cate) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Category is exist!');
        }
    }
    return ProductCategory.create(body);
};

const getDecorativeCategories = async (id) => {
  const categories = await ProductCategory.find({type: CATEGORY_TYPE.DECORATIVE, isDeleted: {$ne: true}});
  return categories;
};

const getAllCustomerCategories = async (id) => {
  const categories = await ProductCategory.find({type: CATEGORY_TYPE.PRODUCT, isDeleted: {$ne: true}});
  return categories;
};

const getProductCategoryById = async (id) => {
    const cate = await ProductCategory.findById(id);
    return cate;
};

const getProductCategoryByNameAndCreatedBy = async (name, userId) => {
    const cate = await ProductCategory.findOne({
        name,
        createdBy: userId,
        isDeleted: false
    });
    return cate;
};

const queryProductCategories = async (filter, options) => {
    let filterCate = {
        ...filter,
        $or: [{"isDeleted": {$exists: false}}, {"isDeleted": false}]
    }

    const cates = await ProductCategory.paginate(filterCate, options);
    return cates;
};

const queryPublicProductCategories = async ( filter, options, userId) => {
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
      sort = '-createdAt';
    }
  
    let filterExp = {}
    if(filter.name){
      filterExp.name = filter.name
    }
    if(_.has(filter, ['type'])){
      filterExp.type = _.toNumber(filter.type)
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
            { "created.role": USER_ROLE.ADMIN },
            { "created._id": userId }
          ]
        }
      },
      { $unset: "created" }
    ]
  
    const rs = await ProductCategory.aggregate(expression)
  
    const countPromise = await ProductCategory.aggregate(
      [
        ...expression,
        {
          $count: "totalResults"
        }
      ]
    )
  
    const docsPromise = await ProductCategory.aggregate(
      [
        ...expression,
        { $addFields: {
            id: "$_id"
          }
        }
      ]
    ).sort(sort).skip(skip).limit(limit)
  
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

const updateProductCategoryById = async (id, updateBody) => {
    const cate = await getProductCategoryById(id);
    if (!cate) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
    }
    Object.assign(cate, updateBody);
    await cate.save();
    return cate;
};

const deleteProductCategoryById = async (id) => {
    const cate = await getProductCategoryById(id);
    if (!cate) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Product category not found');
    }
    Object.assign(cate, {isDeleted: true});
    await cate.save();
    return cate;
};

module.exports = {
    getProductCategoryById,
    updateProductCategoryById,
    queryProductCategories,
    createProductCategory,
    deleteProductCategoryById,
    getProductCategoryByNameAndCreatedBy,
    queryPublicProductCategories,
    getDecorativeCategories,
    getAllCustomerCategories
}