const NOTIFICATION_TYPES = {
    EXCEEDED_STORAGE_LIMIT: 1,
    PUBLISHED_STORE_BE_SENT_TO_DRAFT: 2
}
const allNotificationTYpes = {
    1: "EXCEEDED_STORAGE_LIMIT",
    2: "PUBLISHED_STORE_BE_SENT_TO_DRAFT"
};

const notificationTypes = Object.keys(allNotificationTYpes).map(el => +el);

module.exports = {
    NOTIFICATION_TYPES,
    allNotificationTYpes,
    notificationTypes
};