const httpStatus = require('http-status');
const { UserSubcription, User, Project, PricingPlan } = require('../models');
const ApiError = require('../utils/ApiError');
const _ = require('lodash')
const CONSTANTS = require("../utils/constant")
const pricingPlanService = require("./pricingPlan.service")
const projectService = require("./project.service")
const notificationService = require("./notification.service")
const mongoose = require('mongoose')
const moment = require('moment');
const { APP_SOURCES } = require('../config/appSource');
const { NOTIFICATION_TYPES } = require('../config/notificationType');
const { PRODUCT_TYPES } = require('../config/productType');

const createUserSubcription = async (body) => {
  if(body.key === CONSTANTS.USER_SUBCRIPTION_KEY.PRICING_PLAN && body.active && body.value && body.value.pricingId && body.userId){
    // Delete notification exceed capacity if exist
    const plan = await pricingPlanService.getPricingPlanById(body.value.pricingId)
    if(plan && !plan.isFree){
      const noti = await notificationService.getNotViewedNotificationByType(NOTIFICATION_TYPES.EXCEEDED_STORAGE_LIMIT, body.userId)
      if(noti) {
        await notificationService.deleteNotification(noti.id)
      }
    }
  }
  return UserSubcription.create(body);
};

// When user has an active subscription but an error happen when call webhook. Register a plan for this user
const createActiveUserSubcriptionForShopifyAppSubcription = async (shopifyShop, appSubscription) => {
  const user = await User.findOne({shopifyShop})
  const plan = await pricingPlanService.getRegisterPricingPlanForShopify()
  
  if(user && plan) {
    const activePlans = await getNotFreeActivePricingPlan(user.id)
    if(activePlans && _.get(activePlans, ['length'], 0) > 0){
      return null
    }
    const filter = {
      "value.appSubscription.id": _.get(appSubscription, ['id'], null)
    }
    const sub = await queryUserSubcription(filter)
    
    if(sub) {
      await updateUserSubcriptionById(
        sub.id, {
          active: true,
          value: {
            ..._.get(sub, ['value']),
            expiredDate: moment(new Date()).add(30, 'day').toISOString(),
          }
        }
    )
      return null
    } else {
      await unactiveSubcription(CONSTANTS.USER_SUBCRIPTION_KEY.PRICING_PLAN, user.id)
      const body = {
        userId: user.id,
        key: CONSTANTS.USER_SUBCRIPTION_KEY.PRICING_PLAN,
        active: true, // Only true in here
        paymentStatus: CONSTANTS.PAYMENT_STATUS.SUCCEEDED,
        value: {
            amount: 0,
            pricingId: _.get(plan, ['id'], null),
            numOfDate: 30,
            createdDate: moment(new Date()).toISOString(),
            expiredDate: moment(new Date()).add(30, 'day').toISOString(),
            paymentGate: CONSTANTS.PAYMENT_GATE.ASSIGNED_BY_SYSTEM,
            appSubscription,
        }
      }
  
      const sub = await createUserSubcription(body)
      return sub
    }

    
  }
  return null;
};

// Create unactive sub for shopify user when they install app
// Watch and update it via webhooks
const createUserSubcriptionForShopifyAppSubcription = async (shopifyShop, appSubscription) => {
  const user = await User.findOne({shopifyShop})
  const plan = await pricingPlanService.getRegisterPricingPlanForShopify()
  if(user && plan) {
    const body = {
      userId: user.id,
      key: CONSTANTS.USER_SUBCRIPTION_KEY.PRICING_PLAN,
      value: {
          amount: CONSTANTS.SHOPIFY_RECURRING_CHARGE_AMOUNT,
          pricingId: _.get(plan, ['id'], null),
          numOfDate: 30,
          createdDate: moment(new Date()).toISOString(),
          expiredDate: moment(new Date()).add(30, 'day').toISOString(),
          paymentGate: CONSTANTS.PAYMENT_GATE.SHOPIFY_RECURRING_SUB,
          appSubscription
      }
    }

    return UserSubcription.create(body);
  }
  return null;
};

const getUserSubcriptionByIdAndKey = async (userId, key) => {
  return UserSubcription.findOne({userId, key});
};

const getUserSubcriptionById = async (id) => {
    return UserSubcription.findById(id);
};

const updateSubcriptionTrialExpiredDaysByPlanId = async (id, days = 0) => {
  const allTrialSubWithPlanId = await UserSubcription.find({
    key: CONSTANTS.USER_SUBCRIPTION_KEY.PRICING_PLAN,
    "value.pricingId": id,
    "value.isTrial": true
  })

  for(let i = 0; i < allTrialSubWithPlanId.length; i++){
    const sub = allTrialSubWithPlanId[i]
    const subId = _.get(sub, ['_id'])
    if(subId){
      const createdDate = _.get(sub, ['value', 'createdDate'], null)
      if(createdDate){
        const newExpiredDate = moment(createdDate).add(days, 'days')

        const updateBody = {
          value: {
            numOfDate: days,
            expiredDate: newExpiredDate.toISOString()
          }
        }

        await updateUserSubcriptionById(subId, updateBody)
      }
    }
  }
}

const pushNotificationToUserWhenCapacityOfPlanChanged = async (id, maximumBytesCapacity) => {
  const data = await UserSubcription.aggregate([
    {
      $match: {
        key: CONSTANTS.USER_SUBCRIPTION_KEY.PRICING_PLAN,
        "value.pricingId": id,
        active: true,
        paymentStatus: CONSTANTS.PAYMENT_STATUS.SUCCEEDED
      }
    },
    {
      $lookup:{
        from: 'products',
        localField: 'userId',
        foreignField: 'createdBy',
        pipeline: [
          {
            $match: {
              size: {$exists: true},
              type: { $in: [PRODUCT_TYPES.PRODUCTS, PRODUCT_TYPES.ELEMENT]}
            }
          }
        ],
        as: 'products'
      }
    },
    { 
      $unwind: "$products" 
    },
    {
      $group: {
        _id: "$userId",
        productsSize: { $sum: "$products.size" },
      }
    },
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
          }
        ],
        as: 'assets'
      }
    },
    { 
      $unwind: "$assets" 
    },
    {
      $group: {
        _id: "$_id",
        productsSize: { $avg: "$productsSize" },
        assetSize: { $sum: "$assets.size" }
      }
    },
    {
      $project: {
        total: { $add: ['$productsSize', '$assetSize' ]}
      }
    }
  ])

  /**
   * _id is UserId
   */
  const exceedMaximumData = data.filter(el => el.total >= maximumBytesCapacity)
  const notExceedMaximumData = data.filter(el => el.total < maximumBytesCapacity)
  if(exceedMaximumData.length > 0){
    for(let i = 0; i < exceedMaximumData.length; i++){
      const item = exceedMaximumData[i]
      const notificationData = {
        subject: CONSTANTS.CONFIG_TEXT.EXCEEDED_STORAGE_LIMIT_SUBJECT,
        content: CONSTANTS.CONFIG_TEXT.EXCEEDED_STORAGE_LIMIT_CONTENT,
        type: NOTIFICATION_TYPES.EXCEEDED_STORAGE_LIMIT,
        to: item._id
      }

      await notificationService.createOrOverrideIfExitsNotificationWithType(notificationData)
    }
  }
  if(notExceedMaximumData.length > 0){
    for(let i = 0; i < notExceedMaximumData.length; i++){
      const item = notExceedMaximumData[i]
      
      await notificationService.deleteNotificationByTypeIfExist(NOTIFICATION_TYPES.EXCEEDED_STORAGE_LIMIT, item._id)
    }
  }
}

const updateUserSubcriptionById = async (id, updateBody) => {
  const config = await getUserSubcriptionById(id);
  if (!config) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User subcription not found');
  }
  
  if(updateBody.value){
    const valueCopy = Object.assign(_.cloneDeep(config.value), updateBody.value)
    Object.assign(config, {value: valueCopy});

    delete updateBody.value;
  }

  Object.assign(config, updateBody);
  await config.save();

  if(config.key === CONSTANTS.USER_SUBCRIPTION_KEY.PRICING_PLAN && config.active && config.value && config.value.pricingId && config.userId){
    // Delete notification exceed capacity if exist
    const plan = await pricingPlanService.getPricingPlanById(config.value.pricingId)
    if(plan && !plan.isFree){
      await notificationService.deleteNotificationByTypeIfExist(NOTIFICATION_TYPES.EXCEEDED_STORAGE_LIMIT, config.userId)
    }
  }

  return config;
};

const unactiveSubcription = async (key, userId) => {
  if(key === CONSTANTS.USER_SUBCRIPTION_KEY.PRICING_PLAN){
    const plans = await getNotFreeActivePricingPlan(userId)
    if(plans && plans.length > 0){
      const activeSubId = plans[0]._id

      await updateUserSubcriptionById(activeSubId, { active: false })
    }
  }
}

const queryUserSubcription = async (filter) => {
  const projects = await UserSubcription.findOne(filter);
  return projects;
};

const getNotFreeActivePricingPlan = async (userId) => {
  const id = mongoose.Types.ObjectId(userId);
  const now = new Date();

  return UserSubcription.aggregate([
    {
      $match: {
        userId: id,
        key: CONSTANTS.USER_SUBCRIPTION_KEY.PRICING_PLAN,
        active: true,
        paymentStatus: CONSTANTS.PAYMENT_STATUS.SUCCEEDED,
        "value.expiredDate": {$exists: true},
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
      $addFields: {
        convertedId: { $toObjectId: "$value.pricingId" }
      }
    },
    {
      $lookup:{
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
      $unset: ["plans"]
    },
    {
      $match: {
        "plan.isFree": {$ne: true}
      }
    },
    {
      $match: {
        date:  {$gte: 0}
      }
    },
    { $limit : 1 }
  ])
}

const deactiveAllExpriredActivePricingPlanSub = async () => {
  const now = new Date();

  const allExpiredPlans = await UserSubcription.aggregate([
    {
      $match: {
        key: CONSTANTS.USER_SUBCRIPTION_KEY.PRICING_PLAN,
        // active: true,
        "value.expiredDate": {$exists: true},
        active: true,
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
        date:  {$lte: 0}
      }
    },
    {
      $addFields: {
        convertedId: { $toObjectId: "$value.pricingId" }
      }
    },
    {
      $lookup:{
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
      $unset: ["plans"]
    },
  ])

  const allIds = _.map(allExpiredPlans, (el) => {return mongoose.Types.ObjectId(_.get(el, ['_id']))})
  const allNoFreeUserIds = allExpiredPlans.filter(el => {
    const isFree = _.get(el, ['plan', 'isFree'], false)
    return !isFree
  }).map(el => {
    return mongoose.Types.ObjectId(_.get(el, ['userId']))
  })

  UserSubcription.updateMany({'_id': {'$in': allIds}}, {active: false}, null, (err, res) => {
    allNoFreeUserIds.forEach(async userId => {
      const publishStores = await projectService.queryProjects(
        {
          type: CONSTANTS.PROJECT_TYPE.PROJECT,
          createdBy: userId,
          mode: CONSTANTS.PROJECT_MODE.PUBLISH
        },
        {
          limit: 1000
        }
      )

      // Push all publish store to draft
      if(publishStores.results.length > 0){
        const allStoreIds = _.map(publishStores.results, (el) => {return mongoose.Types.ObjectId(_.get(el, ['_id']))})

        Project.updateMany({'_id': {'$in': allStoreIds}}, {mode: CONSTANTS.PROJECT_MODE.UNSAVED}, null, (err, res) => {})

        const notificationData = {
          subject: CONSTANTS.CONFIG_TEXT.PUBLISHED_STORE_BE_SENT_TO_DRAFT_SUBJECT,
          content: CONSTANTS.CONFIG_TEXT.PUBLISHED_STORE_BE_SENT_TO_DRAFT_CONTENT,
          type: NOTIFICATION_TYPES.PUBLISHED_STORE_BE_SENT_TO_DRAFT,
          to: userId
        }
        await notificationService.createOrOverrideIfExitsNotificationWithType(notificationData)
      }
    })
  })
}

const getActivePricingPlan = async (userId) => {
  const id = mongoose.Types.ObjectId(userId);
  const now = new Date();

  const subcriptions = await UserSubcription.aggregate([
    {
      $match: {
        userId: id,
        key: CONSTANTS.USER_SUBCRIPTION_KEY.PRICING_PLAN,
        active: true,
        paymentStatus: CONSTANTS.PAYMENT_STATUS.SUCCEEDED,
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
    { $limit : 1 }
  ])

  if(_.get(subcriptions, ['length'], 0) > 0){
    return subcriptions
  } else {
    const freePlans = await pricingPlanService.getPricingPlansByFields({isFree: true})
    let freePlan = null
    const user = await User.findById(id)

    if(_.get(user, ['appSource'], 0) == APP_SOURCES.DROBA){
      freePlan = _.find(freePlans, {isDrobA: true})
    } else {
      freePlan = _.find(freePlans, {isDrobA: false})
    }

    if(!_.isNil(_.get(freePlan, ['id']))){
      return [{
        value: {
          pricingId: _.get(freePlan, ['id'])
        }
      }]
    } else {
      return []
    }
  }
}

const getPlanSubcriptionHistory = async (userId) => {
  const id = mongoose.Types.ObjectId(userId);

  return UserSubcription.aggregate([
    {
      $sort: {
        "updatedAt": -1
      }
    },
    {
      $match: {
        paymentStatus: CONSTANTS.PAYMENT_STATUS.SUCCEEDED,
        key: CONSTANTS.USER_SUBCRIPTION_KEY.PRICING_PLAN,
        userId: id,
      }
    },
    {
      $addFields: {
        convertedId: { $toObjectId: "$value.pricingId" }
      }
    },
    {
      $lookup:{
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
      $unset: ["plans"]
    },
    {
      $project: {
        "assignedBy": true,
        "updatedAt": true,
        "value.isTrial": true,
        "plan.name": true,
        "plan.isFree": true,
        "plan.pricing": true
      }
    }
  ])
}

const getLastPlanPurchased = async () => {
  return UserSubcription.aggregate([
    {
      $sort: {
        "updatedAt": -1
      }
    },
    {
      $match: {
        paymentStatus: CONSTANTS.PAYMENT_STATUS.SUCCEEDED,
        key: CONSTANTS.USER_SUBCRIPTION_KEY.PRICING_PLAN
      }
    },
    {
      $lookup:{
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'users'
      }
    },
    {
      $addFields: {
        user: { $arrayElemAt: [ "$users", 0 ] }
      }
    },
    {
      $addFields: {
        convertedId: { $toObjectId: "$value.pricingId" }
      }
    },
    {
      $lookup:{
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
      $addFields: {
        planName: "$plan.name"
      }
    },
    {
      $unset: ["users", "user.password", "plans", "convertedId", "plan"]
    },
    {
      $limit: 5
    }
  ])
}

const countPremiumUsers = async () => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  let lastMonth = currentMonth > 1 ? currentMonth - 1 : 12;
  let yearOfLastMonth = lastMonth == 12 ? currentYear - 1 : currentYear;

  const thisMonthInfo = await UserSubcription.aggregate([
    {
      $match: {
        paymentStatus: CONSTANTS.PAYMENT_STATUS.SUCCEEDED,
        key: CONSTANTS.USER_SUBCRIPTION_KEY.PRICING_PLAN
      }
    },
    {
      $addFields: {
        groupMonth: { 
          $month: "$updatedAt"
        },
        groupYear: { 
          $year: "$updatedAt"
        },
      }
    },
    {
      $match: {
        groupMonth: {$eq: currentMonth},
        groupYear: {$eq: currentYear}
      }
    },
    {
      $group: {
        _id: "$groupMonth",
        amount: { $sum: 1 }
      }
    },
  ])

  const lastMonthInfo = await UserSubcription.aggregate([
    {
      $match: {
        paymentStatus: CONSTANTS.PAYMENT_STATUS.SUCCEEDED,
        key: CONSTANTS.USER_SUBCRIPTION_KEY.PRICING_PLAN
      }
    },
    {
      $addFields: {
        groupMonth: { 
          $month: "$updatedAt"
        },
        groupYear: { 
          $year: "$updatedAt"
        },
      }
    },
    {
      $match: {
        groupMonth: {$eq: lastMonth},
        groupYear: {$eq: yearOfLastMonth}
      }
    },
    {
      $group: {
        _id: "$groupMonth",
        amount: { $sum: 1 }
      }
    },
  ])

  return {
    thisMonth: thisMonthInfo,
    lastMonth: lastMonthInfo
  }
}

const getActivePricingPlanName = async (userId) => {
  const plan = await getActivePricingPlan(userId)

  if(plan.length > 0){
    let planId = plan[0].value ? plan[0].value.pricingId : "";
    if(planId){
      let planDetail = await pricingPlanService.getPricingPlanById(planId);
      return planDetail ? planDetail.name : ""
    }
  } else {
    return CONSTANTS.FREE_USER;
  }
}

const getActivePricingPlanNameInfo = async (userId) => {
  const plan = await getActivePricingPlan(userId)

  if(plan.length > 0){
    let planId = _.get(plan, ['0', 'value', 'pricingId']);
    if(planId){
      let planDetail = await pricingPlanService.getPricingPlanById(planId);
      return {
        planName: _.get(planDetail, ['name'], ''),
        planId: planId,
        isDrobA: _.get(planDetail, ['isDrobA'], false),
        features: _.get(planDetail, ['features'], []),
      }
    }
  } else {
    return {
      planName: CONSTANTS.FREE_USER,
      planId: "",
      isDrobA: false,
      features: []
    }
  }
}

const checkUserSubcriptPricingPlan = async (userId) => {
  const id = mongoose.Types.ObjectId(userId);
  const now = new Date();
  return UserSubcription.aggregate([
    {
      $match: {
        userId: id,
        key: CONSTANTS.USER_SUBCRIPTION_KEY.PRICING_PLAN,
        active: true,
        paymentStatus: CONSTANTS.PAYMENT_STATUS.SUCCEEDED,
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
    }
  ])
}

module.exports = {
    createUserSubcription,
    getUserSubcriptionByIdAndKey,
    updateUserSubcriptionById,
    getUserSubcriptionById,
    queryUserSubcription,
    checkUserSubcriptPricingPlan,
    getActivePricingPlan,
    getActivePricingPlanName,
    getLastPlanPurchased,
    countPremiumUsers,
    unactiveSubcription,
    getNotFreeActivePricingPlan,
    getActivePricingPlanNameInfo,
    updateSubcriptionTrialExpiredDaysByPlanId,
    deactiveAllExpriredActivePricingPlanSub,
    getPlanSubcriptionHistory,
    createUserSubcriptionForShopifyAppSubcription,
    createActiveUserSubcriptionForShopifyAppSubcription,
    pushNotificationToUserWhenCapacityOfPlanChanged
};