const httpStatus = require('http-status');
const { Config } = require('../models');
const ApiError = require('../utils/ApiError');
const { CONFIG_TYPE } = require('../utils/constant');
const _ = require('lodash')

const createConfig = async (body) => {
  return Config.create(body);
};

const getSettings = async () => {
  const data = await Config.find({
    type: { $in: [
      CONFIG_TYPE.OVERRIDE_MATERIAL, 
      CONFIG_TYPE.OVERRIDE_MATERIAL_MOBILE,
      CONFIG_TYPE.ANTIALIAS_DESKTOP,
      CONFIG_TYPE.ANTIALIAS_MOBILE,
      CONFIG_TYPE.SHOW_HDRI_DESKTOP,
      CONFIG_TYPE.SHOW_HDRI_MOBILE,
      CONFIG_TYPE.PIXEL_RATIO_DESKTOP,
      CONFIG_TYPE.PIXEL_RATIO_MOBILE
    ]}
  });

  return {
    isOverrideMaterialDesktop: _.get(_.find(data, (el) => el.type === CONFIG_TYPE.OVERRIDE_MATERIAL), ['content', 'value'], false),
    isOverrideMaterialMobile: _.get(_.find(data, (el) => el.type === CONFIG_TYPE.OVERRIDE_MATERIAL_MOBILE), ['content', 'value'], false),
    isAntialiasDesktop: _.get(_.find(data, (el) => el.type === CONFIG_TYPE.ANTIALIAS_DESKTOP), ['content', 'value'], false),
    isAntialiasMobile: _.get(_.find(data, (el) => el.type === CONFIG_TYPE.ANTIALIAS_MOBILE), ['content', 'value'], false),
    isShowHDRIDesktop: _.get(_.find(data, (el) => el.type === CONFIG_TYPE.SHOW_HDRI_DESKTOP), ['content', 'value'], false),
    isShowHDRIMobile: _.get(_.find(data, (el) => el.type === CONFIG_TYPE.SHOW_HDRI_MOBILE), ['content', 'value'], false),
    pixelRatioDesktop: _.get(_.find(data, (el) => el.type === CONFIG_TYPE.PIXEL_RATIO_DESKTOP), ['content', 'value'], 100),
    pixelRatioMobile: _.get(_.find(data, (el) => el.type === CONFIG_TYPE.PIXEL_RATIO_MOBILE), ['content', 'value'], 100),
  }
};

const getConfigByType = async (type) => {
  return Config.findOne({type});
};

const getConfigById = async (id) => {
    return Config.findById(id);
};

const updateConfigById = async (id, updateBody) => {
  const config = await getConfigById(id);
  if (!config) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Config not found');
  }

  Object.assign(config, updateBody);
  await config.save();
  return config;
};

const createOrUpdateUniqueConfig = async (type, value) => {
  let config = await getConfigByType(type);

  if(config) {
    const valueCopy = Object.assign(
      _.cloneDeep(config.content), 
      {
        value: value
      }
    )

    Object.assign(config, {content: valueCopy});
    await config.save()
  } else {
    config = await Config.create({
      type,
      content: {
        value
      }
    });
  }

  return config;
}

const deleteConfigByType = async (type) => {
  let config = await getConfigByType(type);
  if(config) {
    await config.remove()
  }
}

module.exports = {
    createConfig,
    getConfigByType,
    updateConfigById,
    getConfigById,
    getSettings,
    createOrUpdateUniqueConfig,
    deleteConfigByType
};
