const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const logger = require('../logger');

const createLog = catchAsync(async (req, res) => {
    const {level, data} = req.body

    logger.log(level, JSON.stringify(data))

    res.status(httpStatus.CREATED).send();
});

module.exports = {
    createLog,
};