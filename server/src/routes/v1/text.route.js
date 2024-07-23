const express = require('express');
const textController = require('../../controllers/text.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.post('/', auth(), textController.createText)
router.get('/get-public-texts', textController.getPublicTexts);
router.get('/', auth(), textController.getTexts)
router.delete('/', auth(), textController.deleteText);
router.put('/:id', auth(), textController.updateText);

module.exports = router;