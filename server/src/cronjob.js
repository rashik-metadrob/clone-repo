const cron = require('node-cron');
const mongoose = require('mongoose');
const config = require('./config/config');

const userSubcriptionService = require('./services/userSubcription.service')

// PROD: '0,30 * * * *'
// TEST: '0,30 * * * * *'
cron.schedule('0,30 * * * *', () => {
    console.log('running every minute 0, 30');

    mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
        console.log('Connected to MongoDB at ' + config.mongoose.url);
        
        userSubcriptionService.deactiveAllExpriredActivePricingPlanSub()
    });
});