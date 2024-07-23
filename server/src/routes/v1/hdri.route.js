const express = require('express');
const hdriController = require('../../controllers/hdri.controller');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const hdriValidation = require('../../validations/hdri.validation');

const router = express.Router();

router.get('/all', hdriController.getAllHdri);
router.get('/by-admin', auth(), validate(hdriValidation.queryHdriByAdmin), hdriController.getHdrisByAdmin);
router.get('/:id', hdriController.getHdriById);
router.get('/', auth(), hdriController.getHdris);
router.post('/', auth(), hdriController.createHdri);
router.delete('/', auth(), hdriController.deleteHdri);
router.put('/:id', auth(), hdriController.updateHdri);

module.exports = router;