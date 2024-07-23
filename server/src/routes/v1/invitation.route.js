const express = require('express');
const invitationController = require('../../controllers/invitation.controller');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const invitationValidation = require('../../validations/invitation.validation');

const router = express.Router();

router.put('/accept/:code', invitationController.acceptInvitation);
router.put('/reject/:code', invitationController.rejectInvitation);
router.get('/', validate(invitationValidation.getInvitation), invitationController.getInvitation);
router.post('/', auth(), validate(invitationValidation.createInvitation), invitationController.createInvitation);
router.put('/:id', auth(), invitationController.updateInvitation);
router.delete('/:id', auth(), invitationController.deleteInvitation);

module.exports = router;