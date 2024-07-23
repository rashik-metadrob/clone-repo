const httpStatus = require('http-status');
const { PricingPlan } = require('../models');
const ApiError = require('../utils/ApiError');
const _ = require('lodash')

const getRegisterPricingPlanForShopify = async () => {
  const shopifyPlan = await PricingPlan.findOne({isDefaultForShopify: true, isDeleted: {$ne: true}})
  if(shopifyPlan){
    return shopifyPlan
  } else {
    let orderedPlans = await PricingPlan.find({ 
      isDeleted: {$ne: true}, 
      isFree: {$ne: true}, 
      isDrobA: {$ne: true}
    })

    orderedPlans = _.orderBy(orderedPlans, ['pricing.monthly'], ['desc'])

    const plan = _.get(orderedPlans, [0], null)

    return plan
  }
}

const createPricingPlan = async (body) => {
  return PricingPlan.create(body);
};

const getAllPricingPlan = async (filter = {}, options) => {
  const pricingPlans = await PricingPlan.find(filter);
  return pricingPlans;
};

const getPricingPlanById = async (id) => {
  return PricingPlan.findById(id);
};

const getPricingPlanByFields = async (filter) => {
  const data = await PricingPlan.findOne(filter);
  return data;
};

const getPricingPlansByFields = async (filter) => {
  const data = await PricingPlan.find(filter);
  return data;
};

/**
 * Update pricing plan by id
 * @param {ObjectId} pricingPlanId
 * @param {Object} updateBody
 * @returns {Promise<PricingPlan>}
 */
const updateById = async (id, updateBody) => {
  const pricingPlan = await getPricingPlanById(id);
  if (!pricingPlan) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Pricing plan not found');
  }
  Object.assign(pricingPlan, updateBody);
  await pricingPlan.save();
  return pricingPlan;
};

const deletePricingPlanById = async (id) => {
  const pricingPlan = await getPricingPlanById(id);
  if (!pricingPlan) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Pricing plan not found');
  }
  Object.assign(pricingPlan, { isDeleted: true });
  await pricingPlan.save();
  return pricingPlan;
};

const getIncludedInfomation = (plan) => {
  if(plan){
    
  } else {
    return []
  }
}

module.exports = {
  createPricingPlan,
  getAllPricingPlan,
  getPricingPlanById,
  getPricingPlanByFields,
  updateById,
  getPricingPlansByFields,
  deletePricingPlanById,
  getRegisterPricingPlanForShopify
};
