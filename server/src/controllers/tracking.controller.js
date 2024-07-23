const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { trackingService, projectService, productService } = require('../services');
const CONSTANTS = require("../utils/constant")
const _ = require("lodash")

const addTracking = catchAsync(async (req, res) => {
  const body = req.body;

  const oldTrack = await trackingService.getTrackingByTrackingIdAndType(body.trackingContainerId, body.type);
  if(oldTrack){
    const newTrack = body.track
    if(newTrack){
      oldTrack.trackings.push(newTrack)
    }
    const newTracks = body.tracks
    if(newTracks){
      newTracks.forEach(el => {
        oldTrack.trackings.push(el)
      })
    }
    const updateData = {
      trackings: oldTrack.trackings
    }

    const tracking = await trackingService.updateTrackingById(oldTrack.id, updateData)
    if (!tracking) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Tracking not found');
    }
    res.send(tracking);
  } else {
    const newTraking = {
      trackingContainerId: body.trackingContainerId,
      type: body.type,
      trackings: [
        body.track
      ]
    }

    if(body.type === CONSTANTS.TRACKING_TYPE.STORE){
      const store = await projectService.getProjectById(body.trackingContainerId)
      if(store){
        newTraking.containerCreatedBy = store.createdBy
      }
    }

    if(body.type === CONSTANTS.TRACKING_TYPE.PRODUCT){
      const prod = await productService.getProductById(body.trackingContainerId)
      if(prod){
        newTraking.containerCreatedBy = prod.createdBy
      }
    }

    const tracking = await trackingService.createTracking(newTraking);
    res.status(httpStatus.CREATED).send(tracking);
  }
});

const getStayInStoreData = catchAsync(async (req, res) => {
  const user = req.user;

  const listStores = await trackingService.getTrackingByContainerCreatedId(user._id)
  if(!listStores){
    throw new ApiError(httpStatus.NOT_FOUND, 'Store not found');
  }

  let results = listStores.map(el => {
    const store = el.store.length > 0 ? el.store[0] : null
    const totalTime = el.trackings.filter(el => el && el.actionName && el.actionName === CONSTANTS.TRACKING_ACTION_NAME.STAY_IN_STORE)
      .reduce((total, current) => {return total + current.actionValue}, 0)
    return {
      storeId: el._id,
      name: _.get(store, 'name' , ''),
      totalTime: totalTime
    }
  })

  res.send({results: results})
})

// Only for product
const getListFeaturedItemInStore = catchAsync(async (req, res) => {
  const user = req.user;
  if(!req.query.storeId){
    throw new ApiError(httpStatus.NOT_FOUND, 'storeId not found');
  }

  const listData = await trackingService.getListFeaturedItemInStore(req.query.storeId, user._id)


  res.send({results: listData})
})

// Only for product
const getListMostAddedItem = catchAsync(async (req, res) => {
  const user = req.user;
  const listData = await trackingService.getListMostAddedItem(user._id)
  res.send({results: listData})
})

// Only for product
const getListMostRemovedItem = catchAsync(async (req, res) => {
  const user = req.user;
  const listData = await trackingService.getListMostRemovedItem(user._id)
  res.send({results: listData})
})

const countUserEnterByWeek = catchAsync(async (req, res) => {
  const user = req.user;
  const listData = await trackingService.countUserEnterByWeek(user._id, req.query.week, req.query.year)
  res.send({results: listData})
})

const countUserEnter = catchAsync(async (req, res) => {
  const user = req.user;
  const listData = await trackingService.countUserEnter(user._id, req.query.startDate, req.query.endDate)
  res.send({results: listData})
})

const countTotalTimeSpentToBuildStore = catchAsync(async (req, res) => {
  const trackingInfo = await trackingService.countTotalTimeSpentToBuildStore()
  
  const thisMonthAmount = _.get(trackingInfo, ['thisMonth', '0', 'amount'], 0)
  const lastMonthAmount = _.get(trackingInfo, ['lastMonth', '0', 'amount'], 0)
  res.send({
    thisMonth: thisMonthAmount,
    lastMonth: lastMonthAmount,
    percent: lastMonthAmount * thisMonthAmount != 0  ? +((thisMonthAmount - lastMonthAmount) / lastMonthAmount * 100).toFixed(2): lastMonthAmount > thisMonthAmount ? -100 : thisMonthAmount > lastMonthAmount ? 100 : 0
  })
})

const countTotalTimeSpentToExploringStore = catchAsync(async (req, res) => {
  const trackingInfo = await trackingService.countTotalTimeSpentToExploringStore()
  
  const thisMonthAmount = _.get(trackingInfo, ['thisMonth', '0', 'amount'], 0)
  const lastMonthAmount = _.get(trackingInfo, ['lastMonth', '0', 'amount'], 0)
  res.send({
    thisMonth: thisMonthAmount,
    lastMonth: lastMonthAmount,
    percent: lastMonthAmount * thisMonthAmount != 0  ? +((thisMonthAmount - lastMonthAmount) / lastMonthAmount * 100).toFixed(2): lastMonthAmount > thisMonthAmount ? -100 : thisMonthAmount > lastMonthAmount ? 100 : 0
  })
})

const countTotalTimeInteractivityThisMonth = catchAsync(async (req, res) => {
  const user = req.user
  const trackingInfo = await trackingService.countTotalTimeInteractivityThisMonth(user._id)
  
  const thisMonthAmount = _.get(trackingInfo, ['thisMonth', '0', 'amount'], 0)
  const lastMonthAmount = _.get(trackingInfo, ['lastMonth', '0', 'amount'], 0)
  res.send({
    thisMonth: thisMonthAmount,
    lastMonth: lastMonthAmount,
    percent: lastMonthAmount * thisMonthAmount != 0  ? +((thisMonthAmount - lastMonthAmount) / lastMonthAmount * 100).toFixed(2): lastMonthAmount > thisMonthAmount ? -100 : thisMonthAmount > lastMonthAmount ? 100 : 0
  })
})

const countTotalTimeSpentToExploringStoreByRetailer = catchAsync(async (req, res) => {
  const user = req.user
  const trackingInfo = await trackingService.countTotalTimeSpentToExploringStoreByRetailer(user._id)
  
  const thisMonthAmount = _.get(trackingInfo, ['thisMonth', '0', 'amount'], 0)
  const lastMonthAmount = _.get(trackingInfo, ['lastMonth', '0', 'amount'], 0)
  res.send({
    thisMonth: thisMonthAmount,
    lastMonth: lastMonthAmount,
    percent: lastMonthAmount * thisMonthAmount != 0  ? +((thisMonthAmount - lastMonthAmount) / lastMonthAmount * 100).toFixed(2): lastMonthAmount > thisMonthAmount ? -100 : thisMonthAmount > lastMonthAmount ? 100 : 0
  })
})
  
module.exports = {
  addTracking,
  getStayInStoreData,
  getListFeaturedItemInStore,
  getListMostAddedItem,
  getListMostRemovedItem,
  countUserEnterByWeek,
  countUserEnter,
  countTotalTimeSpentToBuildStore,
  countTotalTimeSpentToExploringStore,
  countTotalTimeInteractivityThisMonth,
  countTotalTimeSpentToExploringStoreByRetailer
};