const { Placeholder } = require('../models');
const ApiError = require('../utils/ApiError');
const { USER_ROLE } = require('../utils/constant');
const _ = require("lodash")

const createPlaceholder = async (body) => {
    return Placeholder.create(body);
};

const queryPlaceholders = async (filter, options) => {
    let filterPlaceholders = {
        ...filter,
        "isDeleted": { $ne: true }
    }
    const placeholders = await Placeholder.paginate(filterPlaceholders, options);
    return placeholders;
};

const queryPublicPlaceholders = async ( filter, options) => {
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
  
    const rs = await Placeholder.aggregate(expression)
  
    const countPromise = await Placeholder.aggregate(
      [
        ...expression,
        {
          $count: "totalResults"
        }
      ]
    )
  
    const docsPromise = await Placeholder.aggregate(
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

const getPlaceholderById = async (id) => {
    const placeholder = await Placeholder.findById(id);
    return placeholder;
};

const deletePlaceholderById = async (id) => {
    const placeholder = await getPlaceholderById(id);
    if (!placeholder) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Placeholder not found');
    }
    Object.assign(placeholder, {isDeleted: true});
    await placeholder.save();
    return placeholder;
};

const updatePlaceholderById = async (id, updateBody) => {
    const placeholder = await getPlaceholderById(id);
    if (!placeholder) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Placeholder not found');
    }
    Object.assign(placeholder, updateBody);
    await placeholder.save();
    return placeholder;
};

module.exports = {
    createPlaceholder,
    queryPlaceholders,
    deletePlaceholderById,
    updatePlaceholderById,
    queryPublicPlaceholders
}