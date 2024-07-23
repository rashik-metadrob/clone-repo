const express = require('express');
const webhooksController = require('../../controllers/webhooks.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.post('/product-updated', express.text({type: '*/*'}), webhooksController.onShopifyProductUpdated)
router.post('/product-created', express.text({type: '*/*'}), webhooksController.onShopifyProductCreated)
router.post('/app-uninstalled', express.text({type: '*/*'}), webhooksController.onShopifyAppUninstalled)
router.post('/data-request', express.text({type: '*/*'}), webhooksController.onWebHook)
router.post('/customers-redact', express.text({type: '*/*'}), webhooksController.onWebHook)
router.post('/shop-redact', express.text({type: '*/*'}), webhooksController.onWebHook)
router.post('/app-purchases-one-time-update', express.text({type: '*/*'}), webhooksController.onAppPurchaseOneTimeUpdate)
router.post('/app-subscriptions-update', express.text({type: '*/*'}), webhooksController.onAppSubcriptionsUpdate)
router.post('/', express.text({type: '*/*'}), webhooksController.onWebHook)

module.exports = router;