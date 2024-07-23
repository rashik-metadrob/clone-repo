const httpStatus = require('http-status');
const { User, Project, RoleAndPermission } = require('../models');
const ApiError = require('../utils/ApiError');
const { PROJECT_MODE, PRICING_PLAN_FEATURES_KEY, CONTENT_TYPE, PRICING_PLAN_VALUE, FREE_PLAN, MESSAGE_TEXT, MODEL_BLOCK, USER_SUBCRIPTION_KEY, PAYMENT_STATUS, USER_ROLE, ROLE_AND_PERMISSION_DEFAULT, PERMISSIONS, LIST_PERMISSIONS_OPTIONS } = require('../utils/constant');
const projectService = require('./project.service');
const emailService = require("./email.service")
const userSubcriptionService = require("./userSubcription.service")
const pricingPlanService = require("./pricingPlan.service")
const userStorageService = require("./userStorage.service")
const _ = require('lodash');
const { pipeline } = require('form-data');
const { APP_SOURCES } = require('../config/appSource');
const { PRODUCT_TYPES } = require('../config/productType');
const mongoose = require('mongoose')

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (userBody.email && await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  if(userBody.email){
    let text = `You have successfully registered an account!`
    await emailService.sendWelcomeEmail(userBody.email, "Welcome to Metadrob", text);
  }

  const body = _.cloneDeep(userBody)
  const role = _.get(body, ['role'], USER_ROLE.RETAILERS)

  return User.create(body);
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  let filterUser = {
    ...filter,
    "isDeleted": {$ne: true}
  }
  const users = await User.paginate(filterUser, options);
  return users;
};

const queryUsersByAggregate = async (filter, options, extraFilters) => {
  const limit = options.limit && parseInt(options.limit, 10) > 0 ? parseInt(options.limit, 10) : 10;
  const page = options.page && parseInt(options.page, 10) > 0 ? parseInt(options.page, 10) : 1;
  const skip = (page - 1) * limit;

  const now = new Date();

  let filterUser = {
    ...filter,
    "isDeleted": {$ne: true}
  }

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

  let lookupUserInvitedBy = []
  if(filterUser.invitedBy){
    // filterUser.invitedBy = mongoose.Types.ObjectId(filterUser.invitedBy)
    lookupUserInvitedBy = [
      {
        $set: {
          userRolesValue: { 
            $filter: {
              input: "$userRoles",
              as: 'item',
              cond: { 
                $and: [
                  {
                    $eq: [ "$$item.invitedBy", mongoose.Types.ObjectId(filterUser.invitedBy) ]
                  },
                  {
                    $eq: [ "$$item.isSuperAdminRole", false ]
                  }
                ],
              },
            }
          }
        }
      },
      {
        $set: {
          invitedByUser: { $arrayElemAt: [ "$userRolesValue", 0 ] }
        }
      },
      {
        $set: {
          staffRoleId: "$invitedByUser.roleId",
          staffOwnerId: "$invitedByUser.invitedBy"
        }
      },
      {
        $unset: ['invitedByUser', 'userRolesValue']
      },
      {
        $match: {
          staffOwnerId: mongoose.Types.ObjectId(filterUser.invitedBy)
        }
      },
      {
        $lookup:{
          from: 'roleandpermissions',
          localField: 'staffRoleId',
          foreignField: '_id',
          pipeline: [
            {
              $project: {
                roleName: '$name',
                permissions: 1,
              }
            }
          ],
          as: 'roleInfos'
        }
      },
      {
        $replaceRoot: { 
          newRoot: { 
            $mergeObjects: 
            [ 
              { $arrayElemAt: [ "$roleInfos", 0 ] }, 
              "$$ROOT" 
            ] 
          } 
        }
      },
      {
        $unset: "roleInfos"
      },
    ]
  }
  delete filterUser.invitedBy

  const lookupNotFreePlans = [
    {
      $lookup: {
        from: 'usersubscriptions',
        localField: '_id',
        foreignField: 'userId',
        pipeline: [
          {
            $match: {
              key: USER_SUBCRIPTION_KEY.PRICING_PLAN,
              active: true,
              paymentStatus: PAYMENT_STATUS.SUCCEEDED,
              "value.expiredDate": {$exists: true}
            }
          },
          {
          $addFields: {
            date: { 
                $dateDiff: {
                  startDate: now,
                  endDate: {
                    $dateFromString: {
                      dateString: "$value.expiredDate"
                    }
                  },
                  unit: "second"
                }
              },
            }
          },
          {
            $match: {
              date:  {$gte: 0}
            }
          },
          {
            $addFields: {
              convertedId: { $toObjectId: "$value.pricingId" }
            }
          },
          {
            $lookup: {
              from: 'pricingplans',
              localField: 'convertedId',
              foreignField: '_id',
              as: 'plans'
            }
          },
          {
            $addFields: {
              plan: { $arrayElemAt: [ "$plans", 0 ] }
            }
          },
          {
            $project: {
              membership: "$plan.name",
              planId: "$plan._id",
              isDrobAPlan: "$plan.isDrobA",
              features: "$plan.features"
            }
          },
          { $limit : 1 }
        ],
        as: "subs"
      }
    },
    {
      $replaceRoot: { 
        newRoot: { 
          $mergeObjects: 
          [ 
            { $arrayElemAt: [ "$subs", 0 ] }, 
            "$$ROOT" 
          ] 
        } 
      }
    },
    {
      $unset: "subs"
    },
  ]
  const lookupFreePlan = [
    {
      $addFields: {
        isUserDrobA: {
          $switch: {
            branches: [
              { case: { $eq: [ "$appSource", APP_SOURCES.DROBA ] }, then: true } ,
              { case: { $eq: [ "$appSource", APP_SOURCES.METADROB ] }, then: false }
            ],
            default: { $toBool: "$appSource" }
          }
        }
      }
    },
    {
      $lookup: {
        from: 'pricingplans',
        as: 'plans',
        let: {"isUserDrobA": "$isUserDrobA"},
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $ne: ['$isDeleted', true] },
                  { $eq: ['$isFree', true] },
                  { $eq: ['$isDrobA', '$$isUserDrobA' ] }
                ],
              }
            }
          },
          {
            $project: {
              membership: "$name",
              planId: "$_id",
              isDrobAPlan: "$isDrobA",
              features: "$features"
            }
          },
          { $limit : 1 }
        ]
      }
    },
    {
      $replaceRoot: { 
        newRoot: { 
          $mergeObjects: 
          [ 
            { $arrayElemAt: [ "$plans", 0 ] }, 
            "$$ROOT" 
          ] 
        } 
      }
    },
    {
      $unset: "plans"
    },
  ]
  const lookupPublishStore = [
    {
      $lookup: {
        from: 'projects',
        localField: '_id',
        foreignField: 'createdBy',
        as: 'projects',
        pipeline: [
          {
            $match: {
              mode: PROJECT_MODE.PUBLISH,
              isDeleted: { $ne: true }
            }
          },
          {
            $project: {
              publishStoreName: "$name"
            }
          },
          { $limit : 1 }
        ]
      }
    },
    {
      $replaceRoot: { 
        newRoot: { 
          $mergeObjects: 
          [ 
            { $arrayElemAt: [ "$projects", 0 ] },  
            "$$ROOT" 
          ] 
        } 
      }
    },
    {
      $unset: "projects"
    },
  ]
  const lookupMaximumStorageFromActivePlan = [
    {
      $lookup: {
        from: 'usersubscriptions',
        localField: '_id',
        foreignField: 'userId',
        pipeline: [
          {
            $match: {
              key: USER_SUBCRIPTION_KEY.PRICING_PLAN,
              active: true,
              paymentStatus: PAYMENT_STATUS.SUCCEEDED,
              "value.expiredDate": {$exists: true}
            }
          },
          {
          $addFields: {
            date: { 
                $dateDiff: {
                  startDate: now,
                  endDate: {
                    $dateFromString: {
                      dateString: "$value.expiredDate"
                    }
                  },
                  unit: "second"
                }
              },
            }
          },
          {
            $match: {
              date:  {$gte: 0}
            }
          },
          {
            $addFields: {
              convertedId: { $toObjectId: "$value.pricingId" }
            }
          },
          {
            $lookup: {
              from: 'pricingplans',
              localField: 'convertedId',
              foreignField: '_id',
              as: 'plans'
            }
          },
          {
            $addFields: {
              plan: { $arrayElemAt: [ "$plans", 0 ] }
            }
          },
          {
            $project: {
              features: "$plan.features"
            }
          },
          {
            $unwind: "$features"
          },
          {
            $match: {
              "features.key": PRICING_PLAN_FEATURES_KEY.STORE_CAPACITY
            }
          },
          {
            $project: {
              "userStorageInfo.maximumStorage": "$features.value"
            }
          },
          { $limit : 1 }
        ],
        as: "subs"
      }
    },
    {
      $replaceRoot: { 
        newRoot: { 
          $mergeObjects: 
          [ 
            { $arrayElemAt: [ "$subs", 0 ] }, 
            "$$ROOT" 
          ] 
        } 
      }
    },
    {
      $unset: "subs"
    },
  ]
  const lookupMaximumStorageFromFreePlan = [
    {
      $addFields: {
        isUserDrobA: {
          $switch: {
            branches: [
              { case: { $eq: [ "$appSource", APP_SOURCES.DROBA ] }, then: true } ,
              { case: { $eq: [ "$appSource", APP_SOURCES.METADROB ] }, then: false }
            ],
            default: { $toBool: "$appSource" }
          }
        }
      }
    },
    {
      $lookup: {
        from: 'pricingplans',
        as: 'plans',
        let: {"isUserDrobA": "$isUserDrobA"},
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $ne: ['$isDeleted', true] },
                  { $eq: ['$isFree', true] },
                  { $eq: ['$isDrobA', '$$isUserDrobA' ] }
                ],
              }
            }
          },
          {
            $unwind: "$features"
          },
          {
            $match: {
              "features.key": PRICING_PLAN_FEATURES_KEY.STORE_CAPACITY
            }
          },
          {
            $project: {
              "userStorageInfo.maximumStorage": "$features.value"
            }
          },
          { $limit : 1 }
        ]
      }
    },
    {
      $replaceRoot: { 
        newRoot: { 
          $mergeObjects: 
          [ 
            { $arrayElemAt: [ "$plans", 0 ] }, 
            "$$ROOT" 
          ] 
        } 
      }
    },
    {
      $unset: "plans"
    },
  ]
  const lookupProductSize = [
    {
      $lookup:{
        from: 'products',
        localField: '_id',
        foreignField: 'createdBy',
        pipeline: [
          {
            $match: {
              size: {$exists: true},
              type: { $in: [PRODUCT_TYPES.PRODUCTS, PRODUCT_TYPES.ELEMENT]}
            }
          },
          {
            $group: {
              _id: "$createdBy",
              productsSize: { $sum: "$size" },
            }
          }
        ],
        as: 'products'
      }
    },
    {
      $replaceRoot: { 
        newRoot: { 
          $mergeObjects: 
          [ 
            { $arrayElemAt: [ "$products", 0 ] }, 
            "$$ROOT" 
          ] 
        } 
      }
    },
    { 
      $unset: "products" 
    },
    {
      $replaceRoot: { 
        newRoot: { 
          $mergeObjects: 
          [ 
            { productsSize: 0 }, 
            "$$ROOT" 
          ] 
        } 
      }
    },
  ]
  const lookupAssetSize = [
    {
      $lookup:{
        from: 'assets',
        localField: '_id',
        foreignField: 'createdBy',
        pipeline: [
          {
            $match: {
              size: {$exists: true}
            }
          },
          {
            $group: {
              _id: "$createdBy",
              assetsSize: { $sum: "$size" },
            }
          }
        ],
        as: 'assets'
      }
    },
    {
      $replaceRoot: { 
        newRoot: { 
          $mergeObjects: 
          [ 
            { $arrayElemAt: [ "$assets", 0 ] }, 
            "$$ROOT" 
          ] 
        } 
      }
    },
    { 
      $unset: "assets" 
    },
    // Add default
    {
      $replaceRoot: { 
        newRoot: { 
          $mergeObjects: 
          [ 
            { assetsSize: 0 }, 
            "$$ROOT" 
          ] 
        } 
      }
    },
  ]

  const lookupUserExceededStorageLimit = 
  _.get(extraFilters, ['isShowExceededStorageLimit'], false)
  ? [
    {
      $match: {
        'userStorageInfo.usedPercent': { $gte: 1 }
      }
    }
  ]
  : []

  const lookupShopifyUser = 
  _.get(extraFilters, ['isShopifyUser'], false)
  ? [
    {
      $match: {
        $and: [
          {
            'shopifyShop':  {$exists: true}
          },
          {
            'shopifyShop':  {$ne: ""}
          }
      ]
      }
    }
  ]
  : []

  const aggregateExps = [
    {
      $match: filterUser
    },
    ...lookupUserInvitedBy,
    ...lookupShopifyUser,
    //lookup not free active plan info
    ...lookupNotFreePlans,
    // Lookup free
    ...lookupFreePlan,
    // End lookup free
    // Lookup publish store
    ...lookupPublishStore,
    // End lookup publish store
    // Set storage from features
    //lookup not free active plan
    
    // End set storage from features
    ...lookupMaximumStorageFromActivePlan,
    // Set storage from free plan if not register any plan
    ...lookupMaximumStorageFromFreePlan,
    // End set storage from free plan if not register any plan

    // Add default storage maximum
    {
      $replaceRoot: { 
        newRoot: { 
          $mergeObjects: 
          [ 
            { 
              userStorageInfo: {
                maximumStorage: PRICING_PLAN_VALUE.DEFAULT_STORE_CAPACITY
              }
            }, 
            "$$ROOT" 
          ] 
        } 
      }
    },
    // End default storage maximum
    // Lookup user storage info
    // Lookup product size 
    ...lookupProductSize,
    // Lookup asset size 
    ...lookupAssetSize,
    // End Lookup user storage info
    {
      $set: {
        'userStorageInfo.total': { $add: ['$productsSize', '$assetsSize' ]}
      }
    },
    {
      $set: {
        'userStorageInfo.total': { $divide: ['$userStorageInfo.total', 1024*1024 ]}
      }
    },
    {
      $set: {
        'userStorageInfo.usedPercent': { $divide: ['$userStorageInfo.total', '$userStorageInfo.maximumStorage' ]}
      }
    },
    // Extra filter
    ...lookupUserExceededStorageLimit,
    {
      $addFields: {
        id: "$_id"
      }
    }
  ]

  let resultTotals = await User.aggregate(aggregateExps)
  let results = await User.aggregate(aggregateExps).sort(sort).skip(skip).limit(limit)

  const totalResults = resultTotals.length;
  const totalPages = Math.ceil(totalResults / limit)
  return {
    results,
    limit,
    page,
    totalPages,
    totalResults
  };
};

const queryAllUsers = async (filter) => {
  let filterUser = {
    ...filter,
    "isDeleted": {$ne: true}
  }
  const users = await User.find(filterUser);
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findById(id);
};

const getUserAndPermissionDataById = async (id) => {
  const user = await User.findById(id).populate({
    path: 'userRoles.roleId',
    justOne: true
  }).populate({
    path: 'userRoles.invitedBy',
    justOne: true
  });

  const userData = user.toObject()
  userData.id = user._id
  userData.permissions = ['All']
  delete userData.password
  if(user.userRoles){
    userData.userRoles = userData.userRoles.map(el => {

      return {
        roleId: _.get(el, ['roleId', '_id'], null),
        permissions: _.get(el, ['roleId', 'permissions'], null),
        invitedBy: _.get(el, ['invitedBy', '_id'], null),
        invitedByUser: _.pick(_.get(el, ['invitedBy'], null), ['name']),
        sSuperAdminRole: _.get(el, ['isSuperAdminRole'], false)
      }
    })
  }

  return userData
};

const getUserPermissions = async (id) => {
  const user = await User.findById(id).populate({
    path: 'userRoles.roleId',
    justOne: true
  }).populate({
    path: 'userRoles.invitedBy',
    justOne: true
  });
  return {
    permissions: {
      roles: user.userRoles.map(el => {
        return {
          roleId: _.get(el, ['roleId', 'id']),
          invitedBy: _.get(el, ['invitedBy', 'id']),
          role: _.get(el, ['roleId']),
          invitedByUser: _.pick(_.get(el, ['invitedBy']), ['name', 'id']),
          isSuperAdminRole: _.get(el, ['isSuperAdminRole'], false)
        }
      })
    }
  }
};

const getUserBySocialId = async (socialId) => {
  return User.findOne({socialId});
};

const getUserByShopifyShop = async (shopifyShop) => {
  return User.findOne({shopifyShop});
};


/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  Object.assign(user, {isDeleted: true});
  await user.save();
  // await user.remove();
  return user;
};

const getPricingPlanDetail = async (userId) => {
  const activePlan = await userSubcriptionService.getActivePricingPlan(userId);
  let message = "";
  let requiredBuyPricingPlan = false;

  let planDetail = FREE_PLAN;
  if(activePlan 
    && activePlan.length > 0 
    && activePlan[0]
  ){
    let planId = activePlan[0].value ? activePlan[0].value.pricingId : "";
    if(planId){
      planDetail = await pricingPlanService.getPricingPlanById(planId);
    } else {
      message = MESSAGE_TEXT.NO_PRICING_PLAN_CAN_BE_FOUND
    }
  } else {
    message = MESSAGE_TEXT.USER_DIDNT_BUY_PRICING_PLAN
    requiredBuyPricingPlan = true
  }

  return {
    plan: planDetail,
    subcriptionInfo: {
      expiredDate: _.get(activePlan, ['0', 'value', 'expiredDate'], null),
      isTrial: _.get(activePlan, ['0', 'value', 'isTrial'], false)
    },
    info: {
      result: false,
      message: message,
      requiredBuyPricingPlan: activePlan && activePlan.isFree ? true : requiredBuyPricingPlan
    }
  }
}

const getContentTypeOfUser = async (userId) => {
  const rs = await getPricingPlanDetail(userId)
  const pricingFeatureKey = PRICING_PLAN_FEATURES_KEY["3D_PRODUCT_LIBRARY_ACCESS"];

  let listContentType = [CONTENT_TYPE.GENERAL];

  const feature = _.find(rs.plan.features, el => el.key === pricingFeatureKey)

  if(rs.plan
    && feature 
    && feature.value
    && feature.value === PRICING_PLAN_VALUE['3D_PRODUCT_LIBRARY_ACCESS'].GENERAL_AND_SPECIAL
  ){
    listContentType = [CONTENT_TYPE.GENERAL, CONTENT_TYPE.SPECIAL];
  }

  return listContentType;
}

const getUploadBlocks = async (userId, isFromDrobA) => {
  if(isFromDrobA == 1){
    const listBlocks = [
      {
        label: "2D",
        value: MODEL_BLOCK["2D"]
      },
      {
        label: "3D",
        value: MODEL_BLOCK["3D"]
      }
    ];
    return listBlocks
  }
  const rs = await getPricingPlanDetail(userId)
  const pricingFeatureKey = PRICING_PLAN_FEATURES_KEY.UPLOAD_LIMIT_OBJECTS;

  let listBlocks = [
    {
      label: "2D",
      value: MODEL_BLOCK["2D"]
    }
  ];

  const feature = _.find(rs.plan.features, el => el.key === pricingFeatureKey)

  if(rs.plan
    && feature 
    && feature.value
    && feature.value === PRICING_PLAN_VALUE.UPLOAD_LIMIT_OBJECTS.BOTH_2D_AND_3D
  ){
    listBlocks = [
      {
        label: "2D",
        value: MODEL_BLOCK["2D"]
      },
      {
        label: "3D",
        value: MODEL_BLOCK["3D"]
      }
    ];
  }

  return listBlocks;
}

const getUserMultiplayerRoomInfo = async (storeId) => {
  const project = await Project.findById(storeId)
  const rs = await getPricingPlanDetail(project.createdBy)
  const featurePerPersonKey = PRICING_PLAN_FEATURES_KEY.PER_PERSION_IN_ROOM;
  const featurePerPerson = _.find(rs.plan.features, el => el.key === featurePerPersonKey)
  const featureRoomsKey = PRICING_PLAN_FEATURES_KEY.NUM_OF_ROOMS_LOBBY_CHANNELS;
  const featureRooms = _.find(rs.plan.features, el => el.key === featureRoomsKey)

  let perPersonInRoom = 0
  let numofRooms = 0
  if(featurePerPerson 
    && featurePerPerson.value
    && featurePerPerson.value !== PRICING_PLAN_VALUE.PER_PERSION_IN_ROOM.NO
  ){
    perPersonInRoom = featurePerPerson.value
  }

  if(featureRooms 
    && featureRooms.value
    && featureRooms.value !== PRICING_PLAN_VALUE.NUM_OF_ROOMS_LOBBY_CHANNELS.NO
  ){
    numofRooms = featureRooms.value
  }

  return {
    perPersonInRoom,
    numofRooms
  };
}

const getMaximumStoreCapacity = async (userId) => {
  const rs = await getPricingPlanDetail(userId)

  const feature = _.find(rs.plan.features, el => el.key === PRICING_PLAN_FEATURES_KEY.STORE_CAPACITY)

  return _.get(feature, ['value'], PRICING_PLAN_VALUE.DEFAULT_STORE_CAPACITY)
}

const getUploadLimitSize = async (userId) => {
  const rs = await getPricingPlanDetail(userId)

  const featureLimit2DFile = _.find(rs.plan.features, el => el.key === PRICING_PLAN_FEATURES_KEY.UPLOAD_2D_FILE_SIZE_LIMIT)
  const featureLimit3DFile = _.find(rs.plan.features, el => el.key === PRICING_PLAN_FEATURES_KEY.UPLOAD_3D_FILE_SIZE_LIMIT)
  const featureLimitMediaFile = _.find(rs.plan.features, el => el.key === PRICING_PLAN_FEATURES_KEY.UPLOAD_MEDIA_FILE_SIZE_LIMIT)

  return {
    file2D: _.get(featureLimit2DFile, ['value'], PRICING_PLAN_VALUE.DEFAULT_UPLOAD_FILE_LIMIT),
    file3D: _.get(featureLimit3DFile, ['value'], PRICING_PLAN_VALUE.DEFAULT_UPLOAD_FILE_LIMIT),
    fileMedia: _.get(featureLimitMediaFile, ['value'], PRICING_PLAN_VALUE.DEFAULT_UPLOAD_FILE_LIMIT),
  }
}

const statisticProject = async (projectResults) => {
  let rs = [];
  for(let i = 0; i < projectResults.results.length; i++){
    rs[i] = projectResults.results[i].toObject()
    rs[i].id = rs[i]._id.toString();
    delete rs[i]._id;
    delete rs[i].__v;
    // delete rs[i].createdAt;
    delete rs[i].updatedAt;
    delete rs[i].password;
    delete rs[i].isDeleted;

    rs[i].projectStatistic = {
      [PROJECT_MODE.PUBLISH]: 0,
      [PROJECT_MODE.UNSAVED]: 0
    }

    let filter = {
      "createdBy": rs[i].id,
      "mode": PROJECT_MODE.PUBLISH
    }
    try {
      let rsProject = await projectService.queryProjects(filter, {})
      rs[i].projectStatistic[PROJECT_MODE.PUBLISH] = rsProject.totalResults
      rs[i].publishStoreName = _.get(rsProject, ['results', '0', 'name'], '')
    } catch (err) {
      console.log("err", err)
    }

    filter = {
      "createdBy": rs[i].id,
      "mode": PROJECT_MODE.UNSAVED
    }
    try {
      let rsProject = await projectService.queryProjects(filter, {})
      rs[i].projectStatistic[PROJECT_MODE.UNSAVED] = rsProject.totalResults
    } catch (err) {

    }
  }
  return rs;
};

const statisticPricingPlan = async (projectResults) => {
  let rs = [];
  for(let i = 0; i < projectResults.results.length; i++){
    rs[i] = projectResults.results[i]
    const planInfo = await userSubcriptionService.getActivePricingPlanNameInfo(rs[i].id);
    const featureCapacity = _.find(planInfo.features, el => el.key === PRICING_PLAN_FEATURES_KEY.STORE_CAPACITY)

    rs[i].membership = _.get(planInfo, ['planName'], '');
    rs[i].planId = _.get(planInfo, ['planId'], '');
    rs[i].isDrobAPlan = _.get(planInfo, ['isDrobA'], '');
    rs[i].userStorageInfo = await userStorageService.getUserStorageInfo(rs[i].id)
    rs[i].userStorageInfo.maximumStorage = _.get(featureCapacity, ['value'], PRICING_PLAN_VALUE.DEFAULT_STORE_CAPACITY)
  }
  return rs;
}

const countNewUsers = async () => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  let lastMonth = currentMonth > 1 ? currentMonth - 1 : 12;
  let yearOfLastMonth = lastMonth == 12 ? currentYear - 1 : currentYear;

  const thisMonthInfo = await User.aggregate([
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
      $group:
      {
          _id: "1",
          count: { $sum: 1 }
      }
    },
    {
      $project: {
          "amount": "$count"
      }
    }
  ])

  const lastMonthInfo = await User.aggregate([
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
        groupMonth: {$eq: lastMonth},
        groupYear: {$eq: yearOfLastMonth},
      }
    },
    {
      $group:
      {
        _id: "1",
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        "amount": "$count"
      }
    }
  ])

  return {
    thisMonth: thisMonthInfo,
    lastMonth: lastMonthInfo
  }
}

const getListNewUsers = async () => {
  let filterUser = {
    $or: [{"isDeleted": {$exists: false}}, {"isDeleted": false}]
  }
  const users = await User.paginate(filterUser, {limit: 5, page: 1, sortBy: 'createdAt:desc'});
  return users;
}

const checkPricingPlanFeature = async (userId, featureKey) => {
  const activePlan = await userSubcriptionService.getActivePricingPlan(userId);
  let check = false
  if(activePlan 
    && activePlan.length > 0 
    && activePlan[0]
  ){
    let planId = activePlan[0].value ? activePlan[0].value.pricingId : "";
    if(planId){
      let planDetail = await pricingPlanService.getPricingPlanById(planId);

      const feature = _.find(planDetail.features, el => el.key === featureKey)
      if(planDetail
        && feature 
        && feature.value
      ){
        check = true;
      }
    }
  }

  return check
}

const getUserEmailBySearch = async (search) => {
  return User.aggregate([
    {
      $match: {
        $and: [
          {
            email: { $exists: true }
          },
          {
            email: {
              "$regex": new RegExp(search.toLowerCase(), "i")
            }
          }
        ]
      }
    },
    {
      $project: {
        email: 1,
        id: '$_id'
      }
    }
  ])
}

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  getUserBySocialId,
  statisticProject,
  statisticPricingPlan,
  getPricingPlanDetail,
  getContentTypeOfUser,
  getUploadBlocks,
  countNewUsers,
  getListNewUsers,
  getUserByShopifyShop,
  getUploadLimitSize,
  checkPricingPlanFeature,
  queryAllUsers,
  getMaximumStoreCapacity,
  queryUsersByAggregate,
  getUserMultiplayerRoomInfo,
  getUserEmailBySearch,
  getUserAndPermissionDataById,
  getUserPermissions,
};
