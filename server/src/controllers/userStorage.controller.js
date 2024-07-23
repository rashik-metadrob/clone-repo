const { userStorageService, userService } = require('../services');
const catchAsync = require('../utils/catchAsync');
const _ = require("lodash");
const { ACCOUNT_VISIBLE_FOR } = require('../utils/constant');

const getUserStorageInfo = catchAsync(async (req, res) => {
    const user = req.user;

    const retailerOwnerId = null
    const staffAccountFor = _.get(user, ['staffAccountFor'])
    const role = _.find(_.get(user, ['userRoles'], []), el => !el.isSuperAdminRole && el.invitedBy.toString() == staffAccountFor)
    if(role) {
      retailerOwnerId = role.invitedBy
    }
    
    const info = await userStorageService.getUserStorageInfo(retailerOwnerId ? retailerOwnerId : user._id)
    info.maximumStorage = await userService.getMaximumStoreCapacity(retailerOwnerId ? retailerOwnerId : user._id)
    res.send(info)
});

module.exports = {
    getUserStorageInfo
}