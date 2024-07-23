const express = require('express');
const pricingPlanController = require('../../controllers/pricingPlan.controller');

const router = express.Router();

router.post('/', pricingPlanController.createPricingPlan);
router.put('/:id', pricingPlanController.updatePricingPlan);
router.delete('/', pricingPlanController.deletePricingPlan);
router.get('/shopify-plan', pricingPlanController.getRegisterPricingPlanForShopify);
router.get('/all', pricingPlanController.getAllPricingPlans);
router.get('/metadrob', pricingPlanController.getMetadrobPricingPlans);
router.get('/get-available', pricingPlanController.getAvailablePricingPlans);
router.get('/:id', pricingPlanController.getPricingPlansById);

module.exports = router;