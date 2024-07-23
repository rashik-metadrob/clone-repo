const express = require('express');
const trackingController = require('../../controllers/tracking.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.post('/', trackingController.addTracking);
router.get('/get-stay-in-store', auth('getTracking'), trackingController.getStayInStoreData);
router.get('/get-list-feature-items', auth('getTracking'), trackingController.getListFeaturedItemInStore);
router.get('/get-list-most-added-items', auth('getTracking'), trackingController.getListMostAddedItem);
router.get('/get-list-most-removed-items', auth('getTracking'), trackingController.getListMostRemovedItem);
router.get('/count-user-enter-by-week', auth('getTracking'), trackingController.countUserEnterByWeek);
router.get('/count-user-enter', auth('getTracking'), trackingController.countUserEnter);
router.get('/count-total-time-spent-to-buid-store', trackingController.countTotalTimeSpentToBuildStore);
router.get('/count-total-time-spent-to-exploring-store', trackingController.countTotalTimeSpentToExploringStore);
router.get('/count-total-time-interactivity-last-7-days',  auth(), trackingController.countTotalTimeInteractivityThisMonth);
router.get('/count-total-time-spent-to-exploring-store-by-retailer',  auth(), trackingController.countTotalTimeSpentToExploringStoreByRetailer);

module.exports = router;