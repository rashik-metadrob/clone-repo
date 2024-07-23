const allRoles = {
  user: [],
  admin: ['getUsers', 'manageUsers', 'createTemplate', 'getTracking', 'config', 'getStore', 'assignPricingPlan', 'getAssets', 'retriveUserData', 'sendEmail', 'roles'],
  retailers: ['getTracking', 'getUsers'],
  customer: []
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
