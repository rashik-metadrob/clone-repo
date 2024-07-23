const catchAsync = require('../utils/catchAsync');
const config = require('../config/config');
const httpStatus = require('http-status');

const sdk = require('api')('@easyship/v2023.01#48y2olm65wl4w');
sdk.auth(config.easyShipApiKey);

const getRates = catchAsync(async (req, res) => {
    const couriers = await Promise.all([1,2,3].map(index => sdk.couriers_index({page: index, per_page: '100'})))

    const listCouriers = couriers.map(el => el.data && el.data.couriers ? el.data.couriers : []).reduce((pre, cur) => {return [...pre, ...cur]}, [])

    sdk.rates_request(req.body)
    .then(({ data }) => {
        data.rates = data.rates.slice(0, 3);
        for(let i = 0; i < data.rates.length; i++){
            data.rates[i].logo_url = listCouriers.find(el => el.id === data.rates[i].courier_id).logo_url
        }
        res.status(httpStatus.OK).send(data);
    })
    .catch(err => {
        res.status(httpStatus.BAD_REQUEST).send({message: err.data ? err.data.error : {}})
    });
});

const createShipment = catchAsync(async (req, res) => {
    sdk.shipments_create(req.body)
    .then(({ data }) => {
        res.status(httpStatus.OK).send(data);
    })
    .catch(err => {
        res.status(httpStatus.BAD_REQUEST).send({message: "Create fail!"})
    });
});

const getCouriers = catchAsync(async (req, res) => {
    sdk.couriers_index()
    .then(({ data }) => {
        res.status(httpStatus.OK).send(data);
    })
    .catch(err => {
        res.status(httpStatus.BAD_REQUEST).send({message: "Get fail!"})
    });
});

module.exports = {
    getRates,
    createShipment,
    getCouriers
};
  