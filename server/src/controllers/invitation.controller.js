const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { invitationService, emailService, userService, roleAndPermissionService } = require('../services');
const _ = require('lodash');
const config = require('../config/config');
const { INVITATION_STATUS } = require('../config/invitationStatus');
const { USER_ROLE } = require('../utils/constant');

const createInvitation = catchAsync(async (req, res) => {
    const user = req.user
    const body = req.body
    body.invitedBy = user._id
    const invitation = await invitationService.createInvitation(body);
    if(invitation){
        const text = `Dear user, You received an invitation from Metadrob, click on this link: ${`${config.clientUrl}/invitation?code=${invitation.code}`}`;
        await emailService.sendEmail(
            req.body.email,
            "Invitation from Metadrob",
            text
        )
    }
    res.status(httpStatus.CREATED).send(invitation);
});

const acceptInvitation = catchAsync(async (req, res) => {
    const invitation = await invitationService.getInvitationByCode(req.params.code);
    let role = null;
    if(invitation){
        role = await roleAndPermissionService.getRoleAndPermissionById(invitation.roleId)
        const shouldAssignAdminRole = false
        if(role.isSuperAdminRole) {
            const invitedUser = await userService.getUserById(invitation.userId)

            if(invitedUser.role != USER_ROLE.ADMIN) {
                shouldAssignAdminRole = true
            }
        }

        const user = await userService.getUserById(invitation.userId)

        let userRoles = _.get(user, ['userRoles'], [])
        if(_.find(userRoles, el => !_.get(el, ['isSuperAdminRole'], false) && el.invitedBy.toString() == invitation.invitedBy.toString())) {
            userRoles = _.filter(el => !(!_.get(el, ['isSuperAdminRole'], false) && el.invitedBy.toString() == invitation.invitedBy.toString()))
        }
        if(_.get(role, ['isSuperAdminRole'], false)) {
            userRoles = _.filter(el => !el.isSuperAdminRole)
        }

        userRoles.push({
            roleId: invitation.roleId,
            invitedBy: invitation.invitedBy
        })

        const updateBody = { 
            userRoles
        }

        if(shouldAssignAdminRole) {
            updateBody.role = USER_ROLE.ADMIN
        }
        
        await userService.updateUserById(invitation.userId, updateBody)
        await invitationService.updateInvitationById(invitation.id, {status: INVITATION_STATUS.ACCEPT})
    }
    res.send({
        invitation,
        role
    });
});

const rejectInvitation = catchAsync(async (req, res) => {
    const invitation = await invitationService.getInvitationByCode(req.params.code);
    if(invitation){
        await invitationService.updateInvitationById(invitation.id, {status: INVITATION_STATUS.REJECT})
    }
    res.send(invitation);
});

const getInvitation = catchAsync(async (req, res) => {
    const invitation = await invitationService.getInvitationByCode(req.query.code);
    res.send(invitation);
});

const updateInvitation = catchAsync(async (req, res) => {
    const invitation = await invitationService.updateInvitationById(req.params.id, req.body);
    res.send(invitation);
});

const deleteInvitation = catchAsync(async (req, res) => {
    const invitation = await invitationService.deleteInvitationById(req.params.id);
    res.send(invitation);
});

module.exports = {
    createInvitation,
    updateInvitation,
    deleteInvitation,
    getInvitation,
    acceptInvitation,
    rejectInvitation
}