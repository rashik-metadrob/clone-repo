const express = require('express');
const roleAndPermissionController = require('../../controllers/roleAndPermission.controller');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const roleAndPermissionValidation = require('../../validations/roleAndPermission.validation');

const router = express.Router();

router.get('/permissions', roleAndPermissionController.getAllPermissions);
router.get('/', validate(roleAndPermissionValidation.queryRoleAndPermissions), roleAndPermissionController.queryRoleAndPermissions);
router.post('/', auth('roles'), roleAndPermissionController.createRoleAndPermission);
router.put('/:id', auth('roles'), roleAndPermissionController.updateRoleAndPermission);
router.delete('/:id', auth('roles'), roleAndPermissionController.deleteRoleAndPermission);

module.exports = router;