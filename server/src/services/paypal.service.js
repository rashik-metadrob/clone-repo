const config = require('../config/config');
const { PricingPlan } = require('../models');
const axios = require("axios")
const fetch = require("node-fetch");

const base = config.env === 'production' ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";
// const base = "https://api-m.paypal.com"
const generateAccessToken  = async (body) => {
    try {
        const auth = Buffer.from(config.paypalClientId + ":" + config.paypalSecret).toString("base64");
        const response = await fetch(`${base}/v1/oauth2/token`, {
            method: "post",
            body: "grant_type=client_credentials",
            headers: {
                Authorization: `Basic ${auth}`,
            },
        });
        const data = await response.json();
        return data.access_token;
    } catch(error) {
        console.error("Failed to generate Access Token:", error);
    } 
};

const createOrder = async (amount) => {
    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders`;
    const payload = {
        intent: "CAPTURE",
        purchase_units: [
        {
            amount: {
                currency_code: "USD",
                value: amount,
            },
        },
        ],
    };
  
    const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        method: "POST",
        body: JSON.stringify(payload),
    });
  
    return handleResponse(response);
  };
  
  
const capturePayment = async (orderID) => {
    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders/${orderID}/capture`;
  
    const response = await fetch(url, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        }
    });
    
    return handleResponse(response);
};
  
async function handleResponse(response) {
    if (response.status === 200 || response.status === 201) {
      return response.json();
    }
  
    const errorMessage = await response.text();
    throw new Error(errorMessage);
}

module.exports = {
    createOrder,
    capturePayment
};