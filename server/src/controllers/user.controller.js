const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService, userConfigService, tokenService, projectService, emailService } = require('../services');
const { PROJECT_MODE, PRICING_PLAN_FEATURES_KEY, USER_CONFIG_KEY, MESSAGE_TEXT, FREE_PLAN, PRICING_PLAN_VALUE } = require('../utils/constant');
const _ = require('lodash');
const { APP_SOURCES } = require('../config/appSource');
const config = require('../config/config');

const getUserIp = catchAsync(async (req, res) => {
  const ipAddress = req.socket.remoteAddress;
  res.send(ipAddress);
});

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  let filter = pick(req.query, ['name', 'role', 'invitedBy']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  if(req.query.search){
    filter = {
      ...filter,
      $or: [
        {
          email: {
            "$regex": new RegExp(req.query.search.toLowerCase(), "i")
          }
        },
        {
          name: {
            "$regex": new RegExp(req.query.search.toLowerCase(), "i")
          }
        },
        {
          phone: {
            "$regex": new RegExp(req.query.search.toLowerCase(), "i")
          }
        }
      ]
    }
  }
  const extraFilters = {}
  if(_.has(req.query, ['isShowExceededStorageLimit'])){
    extraFilters.isShowExceededStorageLimit = Boolean(+req.query.isShowExceededStorageLimit)
  }
  if(_.has(req.query, ['isShopifyUser'])){
    extraFilters.isShopifyUser = Boolean(+req.query.isShopifyUser)
  }
  const result = await userService.queryUsersByAggregate(filter, options, extraFilters);
  res.send(result);
});
const getUserPermissions = catchAsync(async (req, res) => {
  const permissions = await userService.getUserPermissions(req.params.id);
  res.send(permissions);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserAndPermissionDataById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const updateLoggedInUser = catchAsync(async (req, res) => {
  const loggedInUser = req.user
  const user = await userService.updateUserById(loggedInUser._id, req.body);
  const tokens = await tokenService.generateAuthTokens(user);

  const userData = await userService.getUserAndPermissionDataById(loggedInUser._id)
  res.send({ user: userData, tokens });
});

const sendEmail = catchAsync(async (req, res) => {
  const { email, subject, content } = req.body
  await emailService.sendEmail(email, subject, content)
  res.send();
});

const updateLoggedInUserPassword = catchAsync(async (req, res) => {
  const loggedInUser = req.user
  const {oldPassword, newPassword} = req.body
  const user = await userService.getUserById(loggedInUser._id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Default password appear when user login with Google or any Social Platform
  const isDefaultPassword = await user.isPasswordMatch(config.defaultPassword)
  if (!isDefaultPassword) {
    const isMatchOldPassword = await user.isPasswordMatch(oldPassword)
    if(!isMatchOldPassword){
      throw new ApiError(httpStatus.NOT_FOUND, 'Old password isn\'t match!');
    }
  }
  await userService.updateUserById(loggedInUser._id, {password: newPassword});

  res.send();
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(user);
});

const updateOnBoarding = catchAsync(async (req, res) => {
  const user = req.user;
  const updateBody = {
    isOnboarding: true
  }
  const users = await userService.updateUserById(user._id, updateBody);
  res.send(users);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getActivePricingPlanOfLoggedInUser = catchAsync(async (req, res) => {
  const user = req.user
  const result = await userService.getPricingPlanDetail(user._id);
  res.send(result);
});

const getListUsersShouldChangeAppSource = catchAsync(async (req, res) => {
  const result = await userService.queryAllUsers({});
  const data = {
    results: result
  }

  data.results = await userService.statisticProject(data);
  data.results = await userService.statisticPricingPlan(data);

  data.results = data.results.map(el => {
    return {
      id: el.id,
      isDrobAPlan: el.isDrobAPlan,
      appSource: el.appSource
    }
  }).filter(el => (el.isDrobAPlan && el.appSource == APP_SOURCES.METADROB) || (!el.isDrobAPlan && el.appSource == APP_SOURCES.DROBA))

  res.send(data);
});

const getListTriedPlansById = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.query.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(_.get(user, ['triedPlanIds'], []));
});

const getUserShopifyCartIdById = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.query.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const checkHasMultiplePlayerRole = catchAsync(async (req, res) => {
  const check = await userService.checkPricingPlanFeature(req.query.userId, PRICING_PLAN_FEATURES_KEY.MULTIPLAYER)
  res.send({result: check});
});

const checkHasWhiteLabel = catchAsync(async (req, res) => {
  const check = await userService.checkPricingPlanFeature(req.query.userId, PRICING_PLAN_FEATURES_KEY.WHITE_LABELLING)
  res.send({result: check});
});

const checkIsActiveShopifyStore = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.query.userId);
  let check = true

  // Only check active if user is shopify
  if(user && user.shopifyShop){
    check = _.get(user, ['isShopifyShopActive'], false)
  }
  
  res.send({result: check});
});

const checkCanCreateNewStore = catchAsync(async (req, res) => {
  const rs = await userService.getPricingPlanDetail(req.query.userId)
  const pricingFeatureKey = PRICING_PLAN_FEATURES_KEY.NUM_OF_STORES_DRAFT
  const feature = _.find(rs.plan.features, el => el.key === pricingFeatureKey)
  if(rs.plan
    && feature 
    && feature.value
  ){
    let numOfStoreInMonth = await userConfigService.getUserConfigByIdAndKeyInCurrentMonth(req.query.userId, USER_CONFIG_KEY.NUM_OF_DRAFT_STORE_IN_MONTH);
    if(
      !numOfStoreInMonth
      || (
        numOfStoreInMonth.value
        && numOfStoreInMonth.value.value < feature.value
      )
    ) {
      rs.info.result = true;
    } 
    
    else {
      rs.info.message = rs.plan && rs.plan.isFree ? MESSAGE_TEXT.USER_DIDNT_BUY_PRICING_PLAN : MESSAGE_TEXT.REACH_LIMIT
    }
  }

  res.send(rs.info)
});

const checkCanPublishStore = catchAsync(async (req, res) => {
  const rs = await userService.getPricingPlanDetail(req.query.userId)
  const pricingFeatureKey = PRICING_PLAN_FEATURES_KEY.NUM_OF_STORE_CAN_PUBLISH
  const feature = _.find(rs.plan.features, el => el.key === pricingFeatureKey)
  if(rs.plan
    && feature 
    && feature.value
  ){
    let numOfPublishedStore = await projectService.getTotalPublishedStoreByUserId(req.query.userId);
    console.log('numOfPublishedStore', numOfPublishedStore, feature.value)
    if(
      !numOfPublishedStore
      || (
        numOfPublishedStore
        && numOfPublishedStore < feature.value
      )
    ) {
      rs.info.result = true;
    } 
    
    else {
      rs.info.message = rs.plan && rs.plan.isFree ? MESSAGE_TEXT.USER_DIDNT_BUY_PRICING_PLAN : MESSAGE_TEXT.REACH_LIMIT
    }
  }

  res.send(rs.info)
});

const checkCanCreateNewProduct = catchAsync(async (req, res) => {
  const rs = await userService.getPricingPlanDetail(req.query.userId)
  const pricingFeatureKey = PRICING_PLAN_FEATURES_KEY.NUM_OF_PRODUCTS
  const feature = _.find(rs.plan.features, el => el.key === pricingFeatureKey)
  if(rs.plan
    && feature 
    && feature.value
  ){
    let numOfStoreInMonth = await userConfigService.getUserConfigByIdAndKeyInCurrentMonth(req.query.userId, USER_CONFIG_KEY.NUM_OF_PRODUCTS_IN_MONTH);
    if(
      !numOfStoreInMonth
      || (
        numOfStoreInMonth.value
        && typeof numOfStoreInMonth.value.value === "number"
        && typeof feature.value === "number"
        && numOfStoreInMonth.value.value < feature.value
      )
      || (
        numOfStoreInMonth.value
        && typeof feature.value === "string"
        && feature.value === PRICING_PLAN_VALUE.NUM_OF_PRODUCTS.UNLIMITED
      )
    ) {
      rs.info.result = true;
    } 
    
    else {
      rs.info.message = rs.plan && rs.plan.isFree ? MESSAGE_TEXT.USER_DIDNT_BUY_PRICING_PLAN : MESSAGE_TEXT.REACH_LIMIT
    }
  }

  res.send(rs.info)
});

const getUploadBlocks = catchAsync(async (req, res) => {
  const user = req.user;

  const rs = await userService.getUploadBlocks(user._id, req.query.isFromDrobA);

  res.send(rs)
});

const getUploadLimitSize = catchAsync(async (req, res) => {
  const user = req.user;

  const rs = await userService.getUploadLimitSize(user._id);

  res.send(rs)
});

const countNewUsers = catchAsync(async (req, res) => {
  const amountInfo = await userService.countNewUsers();

  const thisMonthAmount = _.get(amountInfo, ['thisMonth', '0', 'amount'], 0)
  const lastMonthAmount = _.get(amountInfo, ['lastMonth', '0', 'amount'], 0)
  res.send({
    thisMonth: thisMonthAmount,
    lastMonth: lastMonthAmount,
    percent: lastMonthAmount * thisMonthAmount != 0  ? +((thisMonthAmount - lastMonthAmount) / lastMonthAmount * 100).toFixed(2): lastMonthAmount > thisMonthAmount ? -100 : thisMonthAmount > lastMonthAmount ? 100 : 0
  })
});

const getListNewUsers = catchAsync(async (req, res) => {
  const rs = await userService.getListNewUsers();
  res.send(rs)
});

const checkIsUserHasDefaultPassword = catchAsync(async (req, res) => {
  const userData = req.user;

  let check = false 
  const email = _.get(userData, ['email'])
  if(email){
    const user = await userService.getUserByEmail(email)
    check = await user.isPasswordMatch(config.defaultPassword)
  }

  res.send(check)
});

const getUserEmailBySearch = catchAsync(async (req, res) => {
  let search = ''
  const data = await userService.getUserEmailBySearch(search)

  res.send(data)
})

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  updateOnBoarding,
  getUserIp,
  checkHasMultiplePlayerRole,
  checkCanCreateNewStore,
  checkCanCreateNewProduct,
  getUploadBlocks,
  checkCanPublishStore,
  countNewUsers,
  getListNewUsers,
  updateLoggedInUser,
  getActivePricingPlanOfLoggedInUser,
  getUserShopifyCartIdById,
  checkIsActiveShopifyStore,
  getUploadLimitSize,
  checkHasWhiteLabel,
  getListTriedPlansById,
  getListUsersShouldChangeAppSource,
  checkIsUserHasDefaultPassword,
  updateLoggedInUserPassword,
  sendEmail,
  getUserEmailBySearch,
  getUserPermissions,
};
