const httpStatus = require('http-status');
const { UserConfig } = require('../models');
const ApiError = require('../utils/ApiError');
const _ = require('lodash');
const { DATA_HELPER } = require('../utils/hepler');
const mongoose = require('mongoose');

const createUserConfig = async (body) => {
  return UserConfig.create(body);
};

const getUserConfigByIdAndKey = async (userId, key) => {
  return UserConfig.findOne({userId, key});
};

const getUserConfigByIdAndKeyInCurrentMonth = async (userId, key) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const id = mongoose.Types.ObjectId(userId);

  const configInCurrentMonth =  await UserConfig.aggregate(
    [
      {
        $match: {
          key: key,
          userId: id
        }
      },
      {
        $addFields: {
          groupMonth: { 
              $month: "$createdAt"
          },
          groupYear: { 
              $year: "$createdAt"
          },
        }
      },
      {
        $match: {
          groupMonth: {$eq: currentMonth},
          groupYear: {$eq: currentYear},
        }
      },
      {
        $limit: 1
      }
    ]
  )

  return configInCurrentMonth && configInCurrentMonth.length > 0 ? DATA_HELPER.convertObjectToModel(configInCurrentMonth[0]) : null
};

const getUserConfigById = async (id) => {
    return UserConfig.findById(id);
};

const updateUserConfigById = async (id, updateBody) => {
  const config = await getUserConfigById(id);
  if (!config) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User config not found');
  }

  const valueCopy = Object.assign(_.cloneDeep(config.value), updateBody)

  Object.assign(config, {value: valueCopy});
  await config.save();
  return config;
};

// Apply for config reset in the end of month
const decreaseValueOfConfig = async (userId, key) => {
  let config = await getUserConfigByIdAndKeyInCurrentMonth(userId, key)

  if(config && config.value.value > 0){
      let body = {
          value: {
              value: config.value.value - 1
          }
      }
      config = await updateUserConfigById(config._id.toString(), body.value);
  }
};

module.exports = {
    createUserConfig,
    getUserConfigByIdAndKey,
    updateUserConfigById,
    getUserConfigById,
    getUserConfigByIdAndKeyInCurrentMonth,
    decreaseValueOfConfig
};