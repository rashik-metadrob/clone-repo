const { Invitation, User } = require('../models');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const _ = require("lodash");
const { DATA_HELPER } = require('../utils/hepler');
const moment = require('moment');
const config = require('../config/config');
const { SERVER_DATE_FORMAT } = require('../utils/constant');
const { INVITATION_STATUS } = require('../config/invitationStatus');

const createInvitation = async (body) => {
    const {
        email,
        roleId,
        invitedBy,
    } = body

    const user = await User.findOne({email})
    if(!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    const code = DATA_HELPER.uuidv4()

    const data = {
        roleId,
        code,
        userId: user.id,
        invitedBy,
        expires: moment().add(config.invitationExpirationMinutes, 'minutes').toDate()
    }

    return Invitation.create(data);
};

const queryInvitations = async (filter, options) => {
    const invitations = await Invitation.paginate(filter, options);
    return invitations;
};

const getInvitationById = async (id) => {
    const invitation = await Invitation.findById(id);
    return invitation;
};

const getInvitationByCode = async (code) => {
    const invitation = await Invitation.findOne({code, status: INVITATION_STATUS.NOT_ANSWER}).populate('roleId');

    const expires = _.get(invitation, ['expires'])
    const isExpired = moment().diff(moment(expires, SERVER_DATE_FORMAT), 'minutes') >= 0
    if(isExpired) {
        return null
    }

    if(!invitation.roleId){
        return null
    }

    const invitationData = invitation.toObject()
    invitationData.id = invitation._id
    invitationData.roleName = _.get(invitation, ['roleId', 'name'], '')
    invitationData.roleId = _.get(invitation, ['roleId', '_id'], '')
    delete invitationData._id

    return invitationData;
};

const deleteInvitationById = async (id) => {
    const invitation = await getInvitationById(id);
    if (!invitation) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Invitation not found');
    }
    await invitation.remove();
    return invitation;
};

const updateInvitationById = async (id, updateBody) => {
    const invitation = await getInvitationById(id);
    if (!invitation) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Invitation not found');
    }

    Object.assign(invitation, updateBody);
    await invitation.save();
    return invitation;
};

module.exports = {
    createInvitation,
    queryInvitations,
    deleteInvitationById,
    updateInvitationById,
    getInvitationByCode
}