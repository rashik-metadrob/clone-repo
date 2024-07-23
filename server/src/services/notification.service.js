const { Notification } = require('../models');
const _ = require("lodash")
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const createNotification = async (body) => {
    return Notification.create(body);
};

const queryNotifications = async (filter, options) => {
    let filterNotis = {
        ...filter,
        isDeleted: { $ne: true }
    }
    const assets = await Notification.paginate(filterNotis, options);
    return assets;
};

const createOrOverrideIfExitsNotificationWithType = async (body) => {
    const { type, to } = body
    if (!type) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Notification Type not found');
    }
    
    let noti = await getNotViewedNotificationByType(type, to)
    if(noti) {
        await updateNotificationById(noti.id, {...body, isViewed: false, isDeleted: false})
    } else {
        noti = await createNotification(body)
    }

    return noti
};

const getNotViewedNotificationByType = async (type, to) => {
    const noti = await Notification.findOne({ type, to, isDeleted: false, isViewed: false });
    return noti;
};

const getNotificationById = async (id) => {
    const noti = await Notification.findById(id);
    return noti;
};

const updateNotificationById = async (id, updateBody) => {
    const noti = await getNotificationById(id);
    if (!noti) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Notification not found');
    }
    Object.assign(noti, updateBody);
    await noti.save();
    return noti;
};

const deleteNotification = async (id) => {
    const noti = await getNotificationById(id);
    if (!noti) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Notification not found');
    }
    Object.assign(noti, {isDeleted: true});
    await noti.save();
    return noti;
}

const deleteNotificationByTypeIfExist = async (type, to) => {
    const noti = await getNotViewedNotificationByType(type, to);
    if (!noti) {
      return null
    }
    Object.assign(noti, {isDeleted: true});
    await noti.save();
    return noti;
}


module.exports = {
    createNotification,
    getNotificationById,
    updateNotificationById,
    createOrOverrideIfExitsNotificationWithType,
    getNotViewedNotificationByType,
    deleteNotification,
    queryNotifications,
    deleteNotificationByTypeIfExist
}