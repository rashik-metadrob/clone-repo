const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { userSubcriptionService, userService, emailService, pricingPlanService } = require('../services');
const CONSTANTS = require("../utils/constant")
const pick = require('../utils/pick');
const _ = require('lodash');
const { APP_SOURCES } = require('../config/appSource');

const getPlanSubcriptionHistory = catchAsync(async (req, res) => {
    let configs = await userSubcriptionService.getPlanSubcriptionHistory(req.query.userId)
    res.send(configs);
});

const uniqueSubcription = catchAsync(async (req, res) => {
    let config = await userSubcriptionService.getUserSubcriptionByIdAndKey(req.body.userId, req.body.key)

    if(config){
        config = await userSubcriptionService.updateUserSubcriptionById(config._id.toString(), req.body);
    } else {
        config = await userSubcriptionService.createUserSubcription(req.body);
    }

    if(req.body.key === CONSTANTS.USER_SUBCRIPTION_KEY.PRICING_PLAN){
        //Send mail if user by or chang pricing plan
        const user = await userService.getUserById(req.body.userId);
        if(user && user.email){
            try {
                if(req.body.value && req.body.value.pricingId){
                    const plan = await pricingPlanService.getPricingPlanById(req.body.value.pricingId);
                    if(plan){
                        let text = `You have successfully purchased the ${plan.name} pricing plan from Metadrob.`
                        await emailService.sendEmail(user.email, "Pricing plan from Metadrob", text);
                    }
                }
                
            } catch (error) {
                
            }
        }
    }

    res.send(config);
});

// Admin assign pricing plan for user
const assignPricingPlan = catchAsync(async (req, res) => {
    if(req.body.key === CONSTANTS.USER_SUBCRIPTION_KEY.PRICING_PLAN){
        // Deactive current subcription before active a new subcription
        await userSubcriptionService.unactiveSubcription(CONSTANTS.USER_SUBCRIPTION_KEY.PRICING_PLAN, _.get(req.body, ['userId'], ""))
    }
    let configBody = _.cloneDeep(req.body)
    configBody.assignedBy = CONSTANTS.USER_SUBCRIPTION_ASSIGNED_BY.SUPER_ADMIN
    let config = await userSubcriptionService.createUserSubcription(configBody);

    if(req.body.key === CONSTANTS.USER_SUBCRIPTION_KEY.PRICING_PLAN){
        if(req.body.value && req.body.value.pricingId){
            const plan = await pricingPlanService.getPricingPlanById(req.body.value.pricingId);
            const isDrobAPlan = _.get(plan, ['isDrobA'], false)
            //Send mail if user by or chang pricing plan
            let user = await userService.getUserById(req.body.userId);

            if(_.get(user, ['appSource']) == APP_SOURCES.METADROB && isDrobAPlan){
                user = await userService.updateUserById(user.id, {appSource: APP_SOURCES.DROBA});
            } else if(_.get(user, ['appSource']) == APP_SOURCES.DROBA && !isDrobAPlan){
                user = await userService.updateUserById(user.id, {appSource: APP_SOURCES.METADROB});
            }

            if(user && user.email){
                try {
                    if(plan){
                        let text = `You have successfully been assigned the ${plan.name} pricing plan from Metadrob by Super Admin.`
                        await emailService.sendEmail(user.email, "Assign pricing plan from Metadrob", text);
                    }
                } catch (error) {
                    
                }
            }
        }
    }
    res.send(config);
});

// HANDLE FOR PRICING PLAN
const createSubcription = catchAsync(async (req, res) => {
    if(_.get(req.body, ['value', 'isTrial'], false) && req.body.key === CONSTANTS.USER_SUBCRIPTION_KEY.PRICING_PLAN){
        // Deactive current subcription before active a new subcription
        await userSubcriptionService.unactiveSubcription(CONSTANTS.USER_SUBCRIPTION_KEY.PRICING_PLAN, _.get(req.body, ['userId'], ""))
    }
    let config = await userSubcriptionService.createUserSubcription(req.body);

    if(req.body.key === CONSTANTS.USER_SUBCRIPTION_KEY.PRICING_PLAN){
        //Send mail if user by or chang pricing plan
        const user = await userService.getUserById(req.body.userId);
        if(user && user.email){
            try {
                if(req.body.value && req.body.value.pricingId){
                    const plan = await pricingPlanService.getPricingPlanById(req.body.value.pricingId);
                    if(plan){
                        if(!_.get(req.body, ['value', 'isTrial'], false)){
                            let text = `You have successfully purchased the ${plan.name} pricing plan from Metadrob.`
                            await emailService.sendEmail(user.email, "Pricing plan from Metadrob", text);
                        } else {
                            
                            let text = `You have successfully subcribe the Trial ${plan.name} pricing plan from Metadrob. This trial version will be expried after 14 days. Please buy the official version on time!`
                            await emailService.sendEmail(user.email, "Trial pricing plan from Metadrob", text);
                        }
                    }
                }
                
            } catch (error) {
                
            }
        }
    }

    res.send(config);
});

const checkUserSubcriptPricingPlan = catchAsync(async (req, res) => {
    const user = req.user;
    const rs = await userSubcriptionService.getNotFreeActivePricingPlan(user._id);
    if(rs && rs.length > 0){
        res.send({result: true});
        return;
    }

    res.send({result: false});
});

const getSubcription = catchAsync(async (req, res) => {
    let filter = pick(req.query, ['key']);
    if(req.query['value-stripeIntentSecret']){
        filter['value.stripeIntentSecret'] = req.query['value-stripeIntentSecret']
    }
    if(req.query['value-paypalOrderId']){
        filter['value.paypalOrderId'] = req.query['value-paypalOrderId']
    }
    const result = await userSubcriptionService.queryUserSubcription(filter);
    res.send(result);
});

const updateSubcription = catchAsync(async (req, res) => {
    let oldConfig = null
    if(req.body && _.has(req.body, ['active']) && req.body.active){
        oldConfig = await userSubcriptionService.getUserSubcriptionById(req.params.id)
        if(oldConfig && oldConfig.key == CONSTANTS.USER_SUBCRIPTION_KEY.PRICING_PLAN){
            // Deactive current subcription before active a new subcription
            await userSubcriptionService.unactiveSubcription(CONSTANTS.USER_SUBCRIPTION_KEY.PRICING_PLAN, oldConfig.userId)
        }
    }
    let config = await userSubcriptionService.updateUserSubcriptionById(req.params.id, req.body);

    if(oldConfig && oldConfig.key == CONSTANTS.USER_SUBCRIPTION_KEY.PRICING_PLAN){
        const user = await userService.getUserById(config.userId);
        let triedIds = _.get(user, ['triedPlanIds'], [])
        if(!triedIds.includes(config.value.pricingId)){
            await userService.updateUserById(config.userId, {triedPlanIds: [...triedIds, config.value.pricingId]})
        }
    }
    

    res.send(config);
});

const getLastPlanPurchased = catchAsync(async (req, res) => {
    let plans = await userSubcriptionService.getLastPlanPurchased();
    res.send(plans);
});

const countPremiumUsers = catchAsync(async (req, res) => {
    let infos = await userSubcriptionService.countPremiumUsers();

    const thisMonthAmount = _.get(infos, ['thisMonth', '0', 'amount'], 0)
    const lastMonthAmount = _.get(infos, ['lastMonth', '0', 'amount'], 0)
    res.send({
        thisMonth: thisMonthAmount,
        lastMonth: lastMonthAmount,
        percent: lastMonthAmount * thisMonthAmount != 0  ? +((thisMonthAmount - lastMonthAmount) / lastMonthAmount * 100).toFixed(2): lastMonthAmount > thisMonthAmount ? -100 : thisMonthAmount > lastMonthAmount ? 100 : 0
    })
});

module.exports = {
    uniqueSubcription,
    checkUserSubcriptPricingPlan,
    createSubcription,
    getSubcription,
    updateSubcription,
    getLastPlanPurchased,
    countPremiumUsers,
    assignPricingPlan,
    getPlanSubcriptionHistory
};