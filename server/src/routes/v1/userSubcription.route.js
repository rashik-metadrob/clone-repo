const express = require('express');
const userSubcriptionController = require('../../controllers/userSubcription.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.get('/history', userSubcriptionController.getPlanSubcriptionHistory);
router.get('/last-plan-purchased', userSubcriptionController.getLastPlanPurchased);
router.get('/count-premium-users', userSubcriptionController.countPremiumUsers);
router.post('/admin-assign-pricing-plan', auth("assignPricingPlan"), userSubcriptionController.assignPricingPlan);
router.post('/', auth(), userSubcriptionController.createSubcription);
router.get('/check-user-subcript-pricing-plan', auth(), userSubcriptionController.checkUserSubcriptPricingPlan);
router.get('/', userSubcriptionController.getSubcription);
router.put('/:id', userSubcriptionController.updateSubcription);

module.exports = router;