const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const CONSTANTS = require("../utils/constant")
const config = require('../config/config');
const { orderService, paypalService, userSubcriptionService } = require('../services')
const _ = require('lodash')

const createOrder = catchAsync(async (req, res) => { 
    try{
        const { orderID } = req.params;
        const order = await orderService.getOrderById(orderID);
        if(order){
            const response = await paypalService.createOrder(order.totalAmount.toString());
            if(response.id){
                await orderService.updateOrderById(orderID, {paypalOrderId: response.id})
            }
            res.json(response);
        } else {
            res.status(500).json({ message: "Failed to create order." });
        }
        
    } catch(error) {
        res.status(500).json({ message: JSON.parse(_.get(error, ['message'], "Failed to create Paypal order.")) });
    }
})

const createOrderForPricingPlan = catchAsync(async (req, res) => { 
    try{
        const { subId } = req.params;
        const sub = await userSubcriptionService.getUserSubcriptionById(subId);
        if(sub){
            const response = await paypalService.createOrder(_.get(sub, ['value', 'amount']));
            if(response.id){
                await userSubcriptionService.updateUserSubcriptionById(subId, {value: {paypalOrderId: response.id}})
            }
            res.json(response);
        } else {
            res.status(500).json({ message: "Failed to create order." });
        }
        
    } catch(error) {
        res.status(500).json({ message: JSON.parse(_.get(error, ['message'], "Failed to create Paypal order.")) });
    }
})

const capture = catchAsync(async (req, res) => { 
    try {
        const { orderID } = req.params;
        const response = await paypalService.capturePayment(orderID);
        res.json(response);
    } catch (error){
        res.status(500).json({ message: "Failed to capture order." });
    }
})


module.exports = {
    createOrder,
    capture,
    createOrderForPricingPlan
};