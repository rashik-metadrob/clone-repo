const { PRODUCT_TYPES } = require('../config/productType');
const { Tracking } = require('../models');
const ApiError = require('../utils/ApiError');
const CONSTANTS = require("../utils/constant")
var mongoose = require('mongoose');

const createTracking = async (projectBody) => {
    return Tracking.create(projectBody);
};

const getTrackingById = async (id) => {
    return Tracking.findById(id);
};

const getTrackingByTrackingIdAndType = async (id, type) => {
    return Tracking.findOne({ type: type, trackingContainerId: id});
};

const getTrackingByContainerCreatedId = async (id) => {
    // return Tracking.find({ containerCreatedBy: id});
    return Tracking.aggregate([
        {
            $match: { containerCreatedBy: id, type: CONSTANTS.TRACKING_TYPE.STORE},
        },
        { 
            $lookup:
                {
                    from: 'projects',
                    localField: 'trackingContainerId',
                    foreignField: '_id',
                    as: 'store'
                }
        }
    ])
};

const getListFeaturedItemInStore = async (storeId, id) => {
    const storeObjectId = mongoose.Types.ObjectId(storeId);
    return Tracking.aggregate([
        {
            $match: { containerCreatedBy: id, trackingContainerId: storeObjectId, type: CONSTANTS.TRACKING_TYPE.STORE},
        },
        { 
            $unwind: "$trackings" 
        },
        {
            $match: {"trackings.actionName": CONSTANTS.TRACKING_ACTION_NAME.CLICK_PRODUCT}
        },
        {
            $addFields: {
                convertedId: { $toObjectId: "$trackings.actionTrackingId" }
            }
        },
        {
            $lookup:{
                from: 'products',
                localField: 'convertedId',
                foreignField: '_id',
                as: 'products'
            }
        },
        {
            $addFields: {
                product: { $arrayElemAt: [ "$products", 0 ] }
            }
        },
        {
            $addFields: {
                productType: "$product.type"
            }
        },
        {
            $group: {
              _id: "$trackings.actionTrackingId",
              name: { $first: "$product.name" },
              image: { $first: "$product.image" },
              productType: { $first: "$productType" },
            //   trackings: { $push: "$trackings" },
              totalClick: {$sum: "$trackings.actionValue"}
            }
        },
        {
            $match: {"productType": PRODUCT_TYPES.PRODUCTS}
        },
        {
            $sort: {
                totalClick: -1
            }
        },
        { $limit : 5 }
    ])
};

const getTotalViewedOfProductInMonth = async (userId, prodId) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    return Tracking.aggregate([
        {
            $match: { containerCreatedBy: userId, type: CONSTANTS.TRACKING_TYPE.STORE},
        },
        { 
            $unwind: "$trackings" 
        },
        {
            $match: {"trackings.actionName": CONSTANTS.TRACKING_ACTION_NAME.CLICK_PRODUCT}
        },
        {
            $addFields: {
                convertedId: { $toObjectId: "$trackings.actionTrackingId" },
                groupMonth: { 
                    $month: {
                        $dateFromString: {
                            dateString: "$trackings.actionTime"
                        }
                    }
                },
                groupYear: { 
                    $year: {
                        $dateFromString: {
                            dateString: "$trackings.actionTime"
                        }
                    }
                },
            }
        },
        {
            $match: {
                convertedId: prodId,
                groupMonth: {$eq: currentMonth},
                groupYear: {$eq: currentYear},
            }
        },
        {
            $group: {
              _id: "$convertedId",
              count: { $sum: 1 }
            }
        },
    ])
};

const getTotalAddToCartOfProductInMonth = async (userId, prodId) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    return Tracking.aggregate([
        {
            $match: { containerCreatedBy: userId, type: CONSTANTS.TRACKING_TYPE.PRODUCT},
        },
        { 
            $unwind: "$trackings" 
        },
        {
            $match: {"trackings.actionName": CONSTANTS.TRACKING_ACTION_NAME.ADD_TO_CART}
        },
        {
            $addFields: {
                convertedId: { $toObjectId: "$trackings.actionTrackingId" },
                groupMonth: { 
                    $month: {
                        $dateFromString: {
                            dateString: "$trackings.actionTime"
                        }
                    }
                },
                groupYear: { 
                    $year: {
                        $dateFromString: {
                            dateString: "$trackings.actionTime"
                        }
                    }
                },
            }
        },
        {
            $match: {
                convertedId: prodId,
                groupMonth: {$eq: currentMonth},
                groupYear: {$eq: currentYear},
            }
        },
        {
            $group: {
              _id: "$convertedId",
              count: { $sum: 1 }
            }
        },
    ])
};

const getListMostAddedItem = async (id) => {
    return Tracking.aggregate([
        {
            $match: { containerCreatedBy: id, type: CONSTANTS.TRACKING_TYPE.PRODUCT},
        },
        { 
            $unwind: "$trackings" 
        },
        {
            $match: {"trackings.actionName": CONSTANTS.TRACKING_ACTION_NAME.ADD_TO_CART}
        },
        {
            $addFields: {
                convertedId: { $toObjectId: "$trackings.actionTrackingId" }
            }
        },
        {
            $lookup:{
                from: 'products',
                localField: 'convertedId',
                foreignField: '_id',
                as: 'products'
            }
        },
        {
            $addFields: {
                product: { $arrayElemAt: [ "$products", 0 ] }
            }
        },
        {
            $addFields: {
                productType: "$product.type"
            }
        },
        {
            $group: {
              _id: "$trackings.actionTrackingId",
              name: { $first: "$product.name" },
              image: { $first: "$product.image" },
              productType: { $first: "$productType" },
              totalClick: {$sum: "$trackings.actionValue"}
            }
        },
        {
            $match: {"productType": PRODUCT_TYPES.PRODUCTS}
        },
        {
            $sort: {
                totalClick: -1
            }
        },
        { $limit : 5 }
    ])
};

const getListMostRemovedItem = async (id) => {
    return Tracking.aggregate([
        {
            $match: { containerCreatedBy: id, type: CONSTANTS.TRACKING_TYPE.PRODUCT},
        },
        { 
            $unwind: "$trackings" 
        },
        {
            $match: {"trackings.actionName": CONSTANTS.TRACKING_ACTION_NAME.REMOVE_FROM_CART}
        },
        {
            $addFields: {
                convertedId: { $toObjectId: "$trackings.actionTrackingId" }
            }
        },
        {
            $lookup:{
                from: 'products',
                localField: 'convertedId',
                foreignField: '_id',
                as: 'products'
            }
        },
        {
            $addFields: {
                product: { $arrayElemAt: [ "$products", 0 ] }
            }
        },
        {
            $addFields: {
                productType: "$product.type"
            }
        },
        {
            $group: {
              _id: "$trackings.actionTrackingId",
              name: { $first: "$product.name" },
              image: { $first: "$product.image" },
              productType: { $first: "$productType" },
              totalClick: {$sum: "$trackings.actionValue"}
            }
        },
        {
            $match: {"productType": PRODUCT_TYPES.PRODUCTS}
        },
        {
            $sort: {
                totalClick: -1
            }
        },
        { $limit : 5 }
    ])
};

const countUserEnterByWeek = async (id, week, year) => {
    return Tracking.aggregate([
        {
            $match: { containerCreatedBy: id, type: CONSTANTS.TRACKING_TYPE.STORE},
        },
        { 
            $unwind: "$trackings" 
        },
        {
            $match: {"trackings.actionName": CONSTANTS.TRACKING_ACTION_NAME.USER_ENTER_STORE}
        },
        {
            $addFields: {
                groupDate: { 
                    $dayOfMonth: {
                        $dateFromString: {
                            dateString: "$trackings.actionTime"
                        }
                    }
                },
                groupWeek: { 
                    $week: {
                        $dateFromString: {
                            dateString: "$trackings.actionTime"
                        }
                    }
                },
                groupYear: { 
                    $year: {
                        $dateFromString: {
                            dateString: "$trackings.actionTime"
                        }
                    }
                },
            }
        },
        {
            $match: {
                groupWeek: {$eq: +week},
                groupYear: {$eq: +year}
            }
        },
        {
            $group: {
              _id: "$groupDate",
              date: { $first: "$groupDate" },
              year: { $first: "$groupYear" },
              totalEnter: {$sum: "$trackings.actionValue"}
            }
        },
    ])
}
const countUserEnter = async (id, startDate, endDate) => {
    const currentDate = new Date(startDate);
    const month = currentDate.getMonth() + 1;
    const yearNumber = currentDate.getFullYear();

    const startDateOfMonth = currentDate.getDate();
    const endDateOfMonth = new Date(endDate).getDate();
    return Tracking.aggregate([
        {
            $match: { containerCreatedBy: id, type: CONSTANTS.TRACKING_TYPE.STORE},
        },
        { 
            $unwind: "$trackings" 
        },
        {
            $match: {"trackings.actionName": CONSTANTS.TRACKING_ACTION_NAME.USER_ENTER_STORE}
        },
        {
            $addFields: {
                groupDate: { 
                    $dayOfMonth: {
                        $dateFromString: {
                            dateString: "$trackings.actionTime"
                        }
                    }
                },
                groupMonth: { 
                    $month: {
                        $dateFromString: {
                            dateString: "$trackings.actionTime"
                        }
                    }
                },
                groupYear: { 
                    $year: {
                        $dateFromString: {
                            dateString: "$trackings.actionTime"
                        }
                    }
                },
            }
        },
        {
            $match: {
                groupMonth: {$eq: month},
                groupYear: {$eq: yearNumber},
                $and: [
                    {
                        groupDate:  {$gte: startDateOfMonth}
                    },
                    {
                        groupDate:  {$lte: endDateOfMonth}
                    }
                ]
            }
        },
        {
            $group: {
              _id: "$groupDate",
              date: { $first: "$groupDate" },
              month: { $first: "$groupMonth" },
              year: { $first: "$groupYear" },
              totalEnter: {$sum: "$trackings.actionValue"}
            }
        },
        
    ])
}

const countTotalTimeSpentToBuildStore = async () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    let lastMonth = currentMonth > 1 ? currentMonth - 1 : 12;
    let yearOfLastMonth = lastMonth == 12 ? currentYear - 1 : currentYear;

    const thisMonthInfo = await Tracking.aggregate([
        {
            $match: { type: CONSTANTS.TRACKING_TYPE.STORE},
        },
        { 
            $unwind: "$trackings" 
        },
        {
            $match: {"trackings.actionName": CONSTANTS.TRACKING_ACTION_NAME.STAY_TO_BUILD_STORE}
        },
        {
            $addFields: {
                groupMonth: { 
                    $month: {
                        $dateFromString: {
                            dateString: "$trackings.actionTime"
                        }
                    }
                },
                groupYear: { 
                    $year: {
                        $dateFromString: {
                            dateString: "$trackings.actionTime"
                        }
                    }
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
              amount: { $sum: "$trackings.actionValue" }
            }
        },
        
    ])

    const lastMonthInfo = await Tracking.aggregate([
        {
            $match: { type: CONSTANTS.TRACKING_TYPE.STORE},
        },
        { 
            $unwind: "$trackings" 
        },
        {
            $match: {"trackings.actionName": CONSTANTS.TRACKING_ACTION_NAME.STAY_TO_BUILD_STORE}
        },
        {
            $addFields: {
                groupMonth: { 
                    $month: {
                        $dateFromString: {
                            dateString: "$trackings.actionTime"
                        }
                    }
                },
                groupYear: { 
                    $year: {
                        $dateFromString: {
                            dateString: "$trackings.actionTime"
                        }
                    }
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
              amount: { $sum: "$trackings.actionValue" }
            }
        },
        
    ])

    return {
        thisMonth: thisMonthInfo,
        lastMonth: lastMonthInfo
    }
}

const countTotalTimeInteractivityThisMonth = async (userId) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    let lastMonth = currentMonth > 1 ? currentMonth - 1 : 12;
    let yearOfLastMonth = lastMonth == 12 ? currentYear - 1 : currentYear;

    const thisMonthInfo = await Tracking.aggregate([
        {
            $match: { type: CONSTANTS.TRACKING_TYPE.STORE},
        },
        { 
            $unwind: "$trackings" 
        },
        {
            $match: {"trackings.actionName": CONSTANTS.TRACKING_ACTION_NAME.STAY_TO_BUILD_STORE, "containerCreatedBy": userId}
        },
        {
            $addFields: {
                groupMonth: { 
                    $month: {
                        $dateFromString: {
                            dateString: "$trackings.actionTime"
                        }
                    }
                },
                groupYear: { 
                    $year: {
                        $dateFromString: {
                            dateString: "$trackings.actionTime"
                        }
                    }
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
              amount: { $sum: "$trackings.actionValue" }
            }
        },
        
    ])

    const lastMonthInfo = await Tracking.aggregate([
        {
            $match: { type: CONSTANTS.TRACKING_TYPE.STORE},
        },
        { 
            $unwind: "$trackings" 
        },
        {
            $match: {"trackings.actionName": CONSTANTS.TRACKING_ACTION_NAME.STAY_TO_BUILD_STORE, "containerCreatedBy": userId}
        },
        {
            $addFields: {
                groupMonth: { 
                    $month: {
                        $dateFromString: {
                            dateString: "$trackings.actionTime"
                        }
                    }
                },
                groupYear: { 
                    $year: {
                        $dateFromString: {
                            dateString: "$trackings.actionTime"
                        }
                    }
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
              amount: { $sum: "$trackings.actionValue" }
            }
        },
        
    ])

    return {
        thisMonth: thisMonthInfo,
        lastMonth: lastMonthInfo
    }
}

const countTotalTimeSpentToExploringStoreByRetailer = async (userId) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    let lastMonth = currentMonth > 1 ? currentMonth - 1 : 12;
    let yearOfLastMonth = lastMonth == 12 ? currentYear - 1 : currentYear;

    const thisMonthInfo = await Tracking.aggregate([
        {
            $match: { type: CONSTANTS.TRACKING_TYPE.STORE},
        },
        { 
            $unwind: "$trackings" 
        },
        {
            $match: {"trackings.actionName": CONSTANTS.TRACKING_ACTION_NAME.STAY_IN_STORE, "containerCreatedBy": userId}
        },
        {
            $addFields: {
                groupMonth: { 
                    $month: {
                        $dateFromString: {
                            dateString: "$trackings.actionTime"
                        }
                    }
                },
                groupYear: { 
                    $year: {
                        $dateFromString: {
                            dateString: "$trackings.actionTime"
                        }
                    }
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
              amount: { $sum: "$trackings.actionValue" }
            }
        },
        
    ])

    const lastMonthInfo = await Tracking.aggregate([
        {
            $match: { type: CONSTANTS.TRACKING_TYPE.STORE},
        },
        { 
            $unwind: "$trackings" 
        },
        {
            $match: {"trackings.actionName": CONSTANTS.TRACKING_ACTION_NAME.STAY_IN_STORE, "containerCreatedBy": userId}
        },
        {
            $addFields: {
                groupMonth: { 
                    $month: {
                        $dateFromString: {
                            dateString: "$trackings.actionTime"
                        }
                    }
                },
                groupYear: { 
                    $year: {
                        $dateFromString: {
                            dateString: "$trackings.actionTime"
                        }
                    }
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
              amount: { $sum: "$trackings.actionValue" }
            }
        },
        
    ])

    return {
        thisMonth: thisMonthInfo,
        lastMonth: lastMonthInfo
    }
}

const countTotalTimeSpentToExploringStore = async () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    let lastMonth = currentMonth > 1 ? currentMonth - 1 : 12;
    let yearOfLastMonth = lastMonth == 12 ? currentYear - 1 : currentYear;

    const thisMonthInfo = await Tracking.aggregate([
        {
            $match: { type: CONSTANTS.TRACKING_TYPE.STORE},
        },
        { 
            $unwind: "$trackings" 
        },
        {
            $match: {"trackings.actionName": CONSTANTS.TRACKING_ACTION_NAME.STAY_IN_STORE}
        },
        {
            $addFields: {
                groupMonth: { 
                    $month: {
                        $dateFromString: {
                            dateString: "$trackings.actionTime"
                        }
                    }
                },
                groupYear: { 
                    $year: {
                        $dateFromString: {
                            dateString: "$trackings.actionTime"
                        }
                    }
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
              amount: { $sum: "$trackings.actionValue" }
            }
        },
        
    ])

    const lastMonthInfo = await Tracking.aggregate([
        {
            $match: { type: CONSTANTS.TRACKING_TYPE.STORE},
        },
        { 
            $unwind: "$trackings" 
        },
        {
            $match: {"trackings.actionName": CONSTANTS.TRACKING_ACTION_NAME.STAY_IN_STORE}
        },
        {
            $addFields: {
                groupMonth: { 
                    $month: {
                        $dateFromString: {
                            dateString: "$trackings.actionTime"
                        }
                    }
                },
                groupYear: { 
                    $year: {
                        $dateFromString: {
                            dateString: "$trackings.actionTime"
                        }
                    }
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
              amount: { $sum: "$trackings.actionValue" }
            }
        },
        
    ])

    return {
        thisMonth: thisMonthInfo,
        lastMonth: lastMonthInfo
    }
}

const updateTrackingById = async (id, updateBody) => {
    let tracking = await getTrackingById(id);
    if (!tracking) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Tracking not found');
    }
    Object.assign(tracking, updateBody);
    await tracking.save();
    return tracking;
};

module.exports = {
    createTracking,
    getTrackingById,
    getTrackingByTrackingIdAndType,
    updateTrackingById,
    getTrackingByContainerCreatedId,
    getListFeaturedItemInStore,
    getListMostAddedItem,
    getListMostRemovedItem,
    countUserEnterByWeek,
    countUserEnter,
    countTotalTimeSpentToBuildStore,
    countTotalTimeSpentToExploringStore,
    countTotalTimeInteractivityThisMonth,
    countTotalTimeSpentToExploringStoreByRetailer,
    getTotalViewedOfProductInMonth,
    getTotalAddToCartOfProductInMonth
}