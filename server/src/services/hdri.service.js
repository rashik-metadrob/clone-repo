const { Hdri } = require('../models');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');

const createHdri = async (body) => {
    return Hdri.create(body);
};

const getHdriById = async (id) => {
    const hdri = await Hdri.findById(id);
    return hdri;
};

const getAllHdri = async (filter) => {
    return Hdri.find({
        ...filter,
        isDeleted: {$ne: true}
    })
};

const deleteHdriById = async (id) => {
    const hdri = await getHdriById(id);
    if (!hdri) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Hdri not found');
    }
    Object.assign(hdri, {isDeleted: true});
    await hdri.save();
    return hdri;
};

const queryHdris = async (filter, options) => {
    let filterHdris = {
        ...filter,
        $or: [{"isDeleted": {$exists: false}}, {"isDeleted": false}]
    }
    const hdris = await Hdri.paginate(filterHdris, options);
    return hdris;
};

const updateHdriById = async (id, updateBody) => {
    const hdri = await getHdriById(id);
    if (!hdri) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Hdri not found');
    }
    Object.assign(hdri, updateBody);
    await hdri.save();
    return hdri;
  };

module.exports = {
    createHdri,
    getHdriById,
    deleteHdriById,
    getAllHdri,
    queryHdris,
    updateHdriById,
}