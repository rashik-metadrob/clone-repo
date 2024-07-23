const catchAsync = require('../utils/catchAsync');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const getIntentSecret = catchAsync(async (req, res) => {
    const amount = req.body.amount;

    const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(+amount * 100),
        currency: 'usd',
        automatic_payment_methods: {
            enabled: true,
        },
    });
    
    res.status(200).send({client_secret: paymentIntent.client_secret });
});

module.exports = {
    getIntentSecret,
};
  