const { Order } = require('../models');
const ApiError = require('../utils/ApiError');
const { PAYMENT_STATUS, SERVER_FILTER_DATE_FORMAT } = require('../utils/constant');
const moment = require('moment')
const _ = require("lodash")
const httpStatus = require('http-status');

const getOrderByIntentSetcret = async (id) => {
    return await Order.findOne({stripeIntentSecret: id})
}

const getOrderByPaypalPaymentId = async (id) => {
    return await Order.findOne({paypalOrderId: id})
}

const createOrder = async (orderBody) => {
    return Order.create(orderBody);
};

const getOrderById = async (id) => {
    const order = await Order.findById(id);
    return order;
};

const updateOrderById = async (id, updateBody) => {
    const order = await getOrderById(id);
    if (!order) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    Object.assign(order, updateBody);
    await order.save();
    return order;
};

const deleteOrderById = async (id) => {
    const order = await getOrderById(id);
    if (!order) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Order not found');
    }
    Object.assign(order, {isDeleted: true});
    await order.save();
    return order;
};

const queryOrders = async (filter, options) => {
    let filterEx = {
      ...filter,
      $or: [{"isDeleted": {$exists: false}}, {"isDeleted": false}]
    }
    if(filterEx.createdAt){
        filterEx.createdAt = {
          $gte: new Date(filterEx.createdAt), 
          $lt: new Date(moment(filterEx.createdAt, SERVER_FILTER_DATE_FORMAT).add(1, "day").format(SERVER_FILTER_DATE_FORMAT).toString())
        }
    }
    const orders = await Order.paginate(filterEx, options);
    return orders;
};

const queryOrdersByRetailerId = async (filter, options, userId) => {
    let filterEx = {
      ...filter,
      $or: [{"isDeleted": {$exists: false}}, {"isDeleted": false}]
    }
    if(filterEx.createdAt){
        filterEx.createdAt = {
          $gte: new Date(filterEx.createdAt), 
          $lt: new Date(moment(filterEx.createdAt, SERVER_FILTER_DATE_FORMAT).add(1, "day").format(SERVER_FILTER_DATE_FORMAT).toString())
        }
    }
    if(filterEx.shipmentStatus){
        filterEx.shipmentStatus = _.isNumber(filterEx.shipmentStatus) ? filterEx.shipmentStatus : _.toNumber(filterEx.shipmentStatus)
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

    const limit = options.limit && parseInt(options.limit, 10) > 0 ? parseInt(options.limit, 10) : 10;
    const page = options.page && parseInt(options.page, 10) > 0 ? parseInt(options.page, 10) : 1;
    const skip = (page - 1) * limit;

    const orders = await Order.aggregate([
        {
            $match: filterEx,
        },
        {
            $addFields: {
                id: "$_id",
                item: { $arrayElemAt: [ "$items", 0 ] }
            }
        },
        {
            $addFields: {
                convertedId: { $toObjectId: "$item.storeId"}
            }
        },
        {
            $lookup:{
                from: 'projects',
                localField: 'convertedId',
                foreignField: '_id',
                as: 'projects'
            }
        },
        {
            $addFields: {
                store: { $arrayElemAt: [ "$projects", 0 ] }
            }
        },
        {
            $addFields: {
                sellerId: "$store.createdBy",
            }
        },
        {
            $match: {
                sellerId: userId
            }
        },
        {
            $unset: ['store', 'projects', 'convertedId', 'item']
        }
    ]).sort(sort).skip(skip).limit(limit);
    const allOrders = await Order.aggregate([
        {
            $match: filterEx,
        },
        {
            $addFields: {
                id: "$_id",
                item: { $arrayElemAt: [ "$items", 0 ] }
            }
        },
        {
            $addFields: {
                convertedId: { $toObjectId: "$item.storeId"}
            }
        },
        {
            $lookup:{
                from: 'projects',
                localField: 'convertedId',
                foreignField: '_id',
                as: 'projects'
            }
        },
        {
            $addFields: {
                store: { $arrayElemAt: [ "$projects", 0 ] }
            }
        },
        {
            $addFields: {
                sellerId: "$store.createdBy",
            }
        },
        {
            $match: {
                sellerId: userId
            }
        },
        {
            $unset: ['store', 'projects', 'convertedId', 'item']
        }
    ])
    const totalResults = _.get(allOrders, 'length', 0);
    const totalPages = Math.ceil(totalResults / limit);
    return {results: orders, totalResults: totalResults, page, limit, totalPages};
};

const getGrossIncomeInfo = async () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    let lastMonth = currentMonth > 1 ? currentMonth - 1 : 12;
    let yearOfLastMonth = lastMonth == 12 ? currentYear - 1 : currentYear;

    const thisMonthGrossIncome = await Order.aggregate([
        {
            $match: { paymentStatus: PAYMENT_STATUS.SUCCEEDED},
        },
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
                totalAmount: { $sum: "$totalAmount" },
                count: { $sum: 1 }
            }
        },
        {
            $project: {
                "amount": "$totalAmount"
            }
        }
    ])

    const lastMonthGrossIncome = await Order.aggregate([
        {
            $match: { paymentStatus: PAYMENT_STATUS.SUCCEEDED},
        },
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
                totalAmount: { $sum: "$totalAmount" },
                count: { $sum: 1 }
            }
        },
        {
            $project: {
                "amount": "$totalAmount"
            }
        }
    ])

    return {
        thisMonth: thisMonthGrossIncome,
        lastMonth: lastMonthGrossIncome
    };
}

const getRetailerGrossIncomeInfo = async (userId) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    let lastMonth = currentMonth > 1 ? currentMonth - 1 : 12;
    let yearOfLastMonth = lastMonth == 12 ? currentYear - 1 : currentYear;

    const thisMonthGrossIncome = await Order.aggregate([
        {
            $addFields: {
                id: "$_id",
                item: { $arrayElemAt: [ "$items", 0 ] }
            }
        },
        {
            $addFields: {
                convertedId: { $toObjectId: "$item.storeId"}
            }
        },
        {
            $lookup:{
                from: 'projects',
                localField: 'convertedId',
                foreignField: '_id',
                as: 'projects'
            }
        },
        {
            $addFields: {
                store: { $arrayElemAt: [ "$projects", 0 ] }
            }
        },
        {
            $addFields: {
                sellerId: "$store.createdBy",
            }
        },
        {
            $match: {
                sellerId: userId
            }
        },
        {
            $unset: ['store', 'projects', 'convertedId', 'item']
        },
        {
            $match: { paymentStatus: PAYMENT_STATUS.SUCCEEDED},
        },
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
                totalAmount: { $sum: "$totalAmount" },
                count: { $sum: 1 }
            }
        },
        {
            $project: {
                "amount": "$totalAmount"
            }
        }
    ])

    const lastMonthGrossIncome = await Order.aggregate([
        {
            $addFields: {
                id: "$_id",
                item: { $arrayElemAt: [ "$items", 0 ] }
            }
        },
        {
            $addFields: {
                convertedId: { $toObjectId: "$item.storeId"}
            }
        },
        {
            $lookup:{
                from: 'projects',
                localField: 'convertedId',
                foreignField: '_id',
                as: 'projects'
            }
        },
        {
            $addFields: {
                store: { $arrayElemAt: [ "$projects", 0 ] }
            }
        },
        {
            $addFields: {
                sellerId: "$store.createdBy",
            }
        },
        {
            $match: {
                sellerId: userId
            }
        },
        {
            $unset: ['store', 'projects', 'convertedId', 'item']
        },
        {
            $match: { paymentStatus: PAYMENT_STATUS.SUCCEEDED},
        },
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
                totalAmount: { $sum: "$totalAmount" },
                count: { $sum: 1 }
            }
        },
        {
            $project: {
                "amount": "$totalAmount"
            }
        }
    ])

    return {
        thisMonth: thisMonthGrossIncome,
        lastMonth: lastMonthGrossIncome
    };
}

const getOrdersLast7Days = async (userId) => {
    const currentWeek = moment().week()
    const currentYear = moment().weekYear()
    const lastWeek =  moment().add(-1, "week").week()
    const lastWeekYear =  moment().add(-1, "week").weekYear()

    const thisWeekOrders = await Order.aggregate([
        // {
        //     $match: { paymentStatus: PAYMENT_STATUS.SUCCEEDED},
        // },
        {
            $addFields: {
                item: { $arrayElemAt: [ "$items", 0 ] }
            }
        },
        {
            $addFields: {
                convertedId: { $toObjectId: "$item.storeId"}
            }
        },
        {
            $lookup:{
                from: 'projects',
                localField: 'convertedId',
                foreignField: '_id',
                as: 'projects'
            }
        },
        {
            $addFields: {
                store: { $arrayElemAt: [ "$projects", 0 ] }
            }
        },
        {
            $addFields: {
                sellerId: "$store.createdBy",
                groupMonth: { 
                    $month: "$createdAt"
                },
                groupWeek: { 
                    $week: "$createdAt"
                },
                groupYear: { 
                    $year: "$createdAt"
                }
            }
        },
        {
            $match: {
                groupWeek: {$eq: currentWeek},
                groupYear: {$eq: currentYear},
                sellerId: userId
            }
        },
        {
            $group:
            {
                _id: "1",
                totalAmount: { $sum: "$totalAmount" },
                count: { $sum: 1 }
            }
        },
        {
            $project: {
                "amount": "$count"
            }
        }
    ])

    const lastWeekGrossIncome = await Order.aggregate([
       // {
        //     $match: { paymentStatus: PAYMENT_STATUS.SUCCEEDED},
        // },
        {
            $addFields: {
                item: { $arrayElemAt: [ "$items", 0 ] }
            }
        },
        {
            $addFields: {
                convertedId: { $toObjectId: "$item.storeId"}
            }
        },
        {
            $lookup:{
                from: 'projects',
                localField: 'convertedId',
                foreignField: '_id',
                as: 'projects'
            }
        },
        {
            $addFields: {
                store: { $arrayElemAt: [ "$projects", 0 ] }
            }
        },
        {
            $addFields: {
                sellerId: "$store.createdBy",
                groupMonth: { 
                    $month: "$createdAt"
                },
                groupWeek: { 
                    $week: "$createdAt"
                },
                groupYear: { 
                    $year: "$createdAt"
                }
            }
        },
        {
            $match: {
                groupWeek: {$eq: lastWeek},
                groupYear: {$eq: lastWeekYear},
                sellerId: userId
            }
        },
        {
            $group:
            {
                _id: "1",
                totalAmount: { $sum: "$totalAmount" },
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
        thisWeek: thisWeekOrders,
        lastWeek: lastWeekGrossIncome
    };
}

module.exports = {
    getOrderById,
    updateOrderById,
    createOrder,
    deleteOrderById,
    getOrderByIntentSetcret,
    getOrderByPaypalPaymentId,
    getGrossIncomeInfo,
    getOrdersLast7Days,
    queryOrders,
    queryOrdersByRetailerId,
    getRetailerGrossIncomeInfo
}