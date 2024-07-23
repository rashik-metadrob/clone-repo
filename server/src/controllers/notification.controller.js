const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { notificationService } = require('../services');
const { NOTIFICATION_TYPES } = require('../config/notificationType');
const pick = require('../utils/pick');

const createNotification = catchAsync(async (req, res) => {
    const body = req.body
    const { type } = body
    let noti = null
    if(
        type == NOTIFICATION_TYPES.EXCEEDED_STORAGE_LIMIT
        || type == NOTIFICATION_TYPES.PUBLISHED_STORE_BE_SENT_TO_DRAFT
    ){
        noti = await notificationService.createOrOverrideIfExitsNotificationWithType(body);
    } else {
        noti = await notificationService.createNotification(body);
    }
    
    res.status(httpStatus.CREATED).send(noti);
});
/**
 * isViewed: 0 1
 */
const getNotifications = catchAsync(async (req, res) => {
    const user = req.user;
    let filter = pick(req.query, ['type']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    filter.isViewed = false
    if(!options.sortBy){
        options.sortBy = "createdAt:desc"
    }
    if(user._id){
        filter = {
            ...filter,
            to: user._id
        }
    }
    const result = await notificationService.queryNotifications(filter, options);
    res.send(result);
})

const viewNotification = catchAsync(async (req, res) => {
    const id = req.params.id

    const noti = await notificationService.updateNotificationById(id, { isViewed: true })

    return noti
})

module.exports = {
    createNotification,
    getNotifications,
    viewNotification
}
  