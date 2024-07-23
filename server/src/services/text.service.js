const { Text } = require('../models');
const ApiError = require('../utils/ApiError');
const { PAYMENT_STATUS, SERVER_FILTER_DATE_FORMAT, USER_ROLE } = require('../utils/constant');
const moment = require('moment')
const _ = require("lodash")

const createText = async (body) => {
    return Text.create(body);
};

const queryTexts = async (filter, options) => {
    let filterTexts = {
        ...filter,
        $or: [{"isDeleted": {$exists: false}}, {"isDeleted": false}]
    }
    const texts = await Text.paginate(filterTexts, options);
    return texts;
};

const queryPublicTexts = async ( filter, options) => {
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
  
    let filterExp = {
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
  
    const rs = await Text.aggregate(expression)
  
    const countPromise = await Text.aggregate(
      [
        ...expression,
        {
          $count: "totalResults"
        }
      ]
    )
  
    const docsPromise = await Text.aggregate(
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

const getTextById = async (id) => {
    const text = await Text.findById(id);
    return text;
};

const deleteTextById = async (id) => {
    const text = await getTextById(id);
    if (!text) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Text not found');
    }
    Object.assign(text, {isDeleted: true});
    await text.save();
    return text;
};

const updateTextById = async (id, updateBody) => {
    const text = await getTextById(id);
    if (!text) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Text not found');
    }
    Object.assign(text, updateBody);
    await text.save();
    return text;
};

module.exports = {
    createText,
    queryTexts,
    deleteTextById,
    updateTextById,
    queryPublicTexts
}