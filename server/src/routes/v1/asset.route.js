const express = require('express');
const assetController = require('../../controllers/asset.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.get('/all', auth(), assetController.getAllAsset);
router.get('/public', assetController.getPublicAssets);
router.get('/:id', auth(), assetController.getAssetById);
router.get('/', auth(), assetController.getAssets);
router.post('/', auth(), assetController.createAsset);
router.delete('/', auth(), assetController.deleteAsset);
router.put('/:id', auth(), assetController.updateAsset);

module.exports = router;