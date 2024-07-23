const express = require('express');
const projectController = require('../../controllers/project.controller');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const projectValidation = require('../../validations/project.validation');

const router = express.Router();

router.post('/create', projectController.createProject);
router.route('/create-template').post(auth('createTemplate'), projectController.createProject);
router.get('/project/:id', validate(projectValidation.getProjectById), projectController.getProject);
router.put('/project/sync-with-live/:id', projectController.syncPublishStoreWithLive);
router.put('/project/change-project-mode/:id', projectController.updateProjectMode);
router.put('/project/:id', projectController.updateProject);
router.get('/get-projects', auth(), projectController.getProjects);
router.get('/get-projects-by-admin', auth("getStore"), projectController.getProjectsByAdmin);
router.get('/get-list-publish-project', auth(), projectController.getListPublishProject);
router.delete('/', auth(), projectController.deleteProject);

module.exports = router;