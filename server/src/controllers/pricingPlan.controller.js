const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { pricingPlanService, userSubcriptionService } = require('../services');
const CONSTANTS = require('../utils/constant');
const ApiError = require('../utils/ApiError');
const pick = require('../utils/pick');
const _ = require('lodash');
const { buildPricingPlansInfomations } = require('../utils/pricingPlanUtils');

const createPricingPlan = catchAsync(async (req, res) => {
  const { display } = req.body;
  if (display !== CONSTANTS.PRICING_PLAN_DISPLAY.NONE) {
    const existPlan = await pricingPlanService.getPricingPlanByFields({
      display,
    });

    if (existPlan) {
      const newData = {
        ...existPlan,
        display: CONSTANTS.PRICING_PLAN_DISPLAY.NONE,
      };
      delete newData.id;
      await pricingPlanService.updateById(existPlan.id, newData);
    }
  }

  const plan = await pricingPlanService.createPricingPlan(req.body);

  res.send(plan);
});

const updatePricingPlan = catchAsync(async (req, res) => {
  const id = req.params.id;
  const { display } = req.body;

  if (!id) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Pricing plan not found');
  }

  const existPricingPlan = await pricingPlanService.getPricingPlanById(id);
  if (!existPricingPlan) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Pricing plan not found');
  }

  if (display !== CONSTANTS.PRICING_PLAN_DISPLAY.NONE) {
    const existPlan = await pricingPlanService.getPricingPlanByFields({
      display,
    });

    if (existPlan && existPlan.id !== id) {
      const newData = {
        ...existPlan,
        display: CONSTANTS.PRICING_PLAN_DISPLAY.NONE,
      };
      delete newData.id;
      await pricingPlanService.updateById(existPlan.id, newData);
    }
  }

  const oldPlan = await pricingPlanService.getPricingPlanById(id);
  const oldTrialDays = _.get(_.find(_.get(oldPlan, ['features'], []), {key: CONSTANTS.PRICING_PLAN_FEATURES_KEY.TRIAL_PERIOD}), ['value'], 0)
  const newTrialDays = _.get(_.find(_.get(req.body, ['features'], []), {key: CONSTANTS.PRICING_PLAN_FEATURES_KEY.TRIAL_PERIOD}), ['value'], 0)

  if(oldTrialDays != newTrialDays){
    await userSubcriptionService.updateSubcriptionTrialExpiredDaysByPlanId(id, newTrialDays)
  }

  // Check to push notifi when storage capacity change
  const oldStoreCapacity = _.get(_.find(_.get(oldPlan, ['features'], []), {key: CONSTANTS.PRICING_PLAN_FEATURES_KEY.STORE_CAPACITY}), ['value'], CONSTANTS.PRICING_PLAN_VALUE.DEFAULT_STORE_CAPACITY)
  const newStoreCapacity = _.get(_.find(_.get(req.body, ['features'], []), {key: CONSTANTS.PRICING_PLAN_FEATURES_KEY.STORE_CAPACITY}), ['value'], CONSTANTS.PRICING_PLAN_VALUE.DEFAULT_STORE_CAPACITY)

  if(oldStoreCapacity != newStoreCapacity){
    await userSubcriptionService.pushNotificationToUserWhenCapacityOfPlanChanged(id, newStoreCapacity * 1024 * 1024)
  }

  const plan = await pricingPlanService.updateById(id, req.body);
  res.send({plan});
});

const getPricingPlansById = catchAsync(async (req, res) => {
  const plan = await pricingPlanService.getPricingPlanById(req.params.id);
  res.send(plan)
});

const getAllPricingPlans = catchAsync(async (req, res) => {
  let filter = pick(req.query, ['isDrobA']);

  if(_.has(filter, ['isDrobA'])){
    filter.isDrobA = filter.isDrobA == 1 ? true : false
  }

  filter = {
    ...filter,
    $or: [{"isDeleted": {$exists: false}}, {"isDeleted": false}]
  }

  let plans = await pricingPlanService.getAllPricingPlan(filter);
  if (plans !== null) {
    plans = plans.map((data) => {
      const item = data.toObject();

      const newData = {
        ...item,
        id: item._id,
        includedInfomation: buildPricingPlansInfomations(_.get(item, ['features'], []), _.get(item, ['isDrobA'], false)),
      };

      delete newData._id;

      return newData;
    });
  }
  res.send(plans);
});

const getMetadrobPricingPlans = catchAsync(async (req, res) => {
  let filter = pick(req.query, ['isDrobA']);

  if(_.has(filter, ['isDrobA'])){
    filter.isDrobA = filter.isDrobA == 1 ? true : false
  }

  filter = {
    ...filter,
    isDefaultForShopify: {$ne: true},
    $or: [{"isDeleted": {$exists: false}}, {"isDeleted": false}]
  }

  let plans = await pricingPlanService.getAllPricingPlan(filter);
  if (plans !== null) {
    plans = plans.map((data) => {
      const item = data.toObject();

      const newData = {
        ...item,
        id: item._id,
        includedInfomation: buildPricingPlansInfomations(_.get(item, ['features'], []), _.get(item, ['isDrobA'], false)),
      };

      delete newData._id;

      return newData;
    });
  }
  res.send(plans);
});

const deletePricingPlan = catchAsync(async (req, res) => {
  const pricingPlan = await pricingPlanService.deletePricingPlanById(req.query.id);
  res.send(pricingPlan);
});

const getAvailablePricingPlans = catchAsync(async (req, res) => {
  let filter = pick(req.query, ['isDrobA']);

  if(_.has(filter, ['isDrobA'])){
    filter.isDrobA = filter.isDrobA == 1 ? true : false
  }

  let plans = await pricingPlanService.getPricingPlansByFields({
    ...filter,
    $and: [
      { display: { $ne: CONSTANTS.PRICING_PLAN_DISPLAY.NONE } },
      { display: { $exists: true } },
      { isDeleted: { $ne: true } },
    ],
  });

  if (plans !== null) {
    plans = plans.map((data) => {
      const item = data.toObject();

      const newData = {
        ...item,
        id: item._id,
        includedInfomation: buildPricingPlansInfomations(_.get(item, ['features'], []), _.get(item, ['isDrobA'], false)),
      };

      delete newData._id;

      return newData;
    });
  }

  res.send(plans);
});

const getRegisterPricingPlanForShopify = catchAsync(async (req, res) => {
  const plan = await pricingPlanService.getRegisterPricingPlanForShopify()

  res.send(plan)
})

module.exports = {
  createPricingPlan,
  getAllPricingPlans,
  updatePricingPlan,
  deletePricingPlan,
  getAvailablePricingPlans,
  getPricingPlansById,
  getRegisterPricingPlanForShopify,
  getMetadrobPricingPlans
};
