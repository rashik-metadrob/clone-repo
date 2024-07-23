import React, { useEffect, useState } from 'react';
import {
    PayPalScriptProvider,
    PayPalButtons,
    usePayPalScriptReducer
  } from "@paypal/react-paypal-js";
import paypalApi from '../../../../api/paypal.api';
import { PAYMENT_GATE, PAYMENT_STATUS } from '../../../../utils/constants';
import { Spin, notification } from 'antd';
import orderApi from '../../../../api/order.api';
import { createShipment } from '../../../../utils/util';

const paypalScriptOptions = {
    "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID,
    currency: "USD"
};

const PaypalButton = ({
    order
}) => {
    const [{ isPending }] = usePayPalScriptReducer();
    const [isLoading, setIsLoading] = useState(false)
    const paypalbuttonTransactionProps = {
        style: { layout: "vertical" },
        createOrder: async (data, actions) => {
            try {
                const newOrder = await orderApi.createOrder({
                    ...order,
                    paymentGate: PAYMENT_GATE.PAYPAL,
                    stripeIntentSecret: ""
                })
                const response = await paypalApi.createOrder(newOrder.id);
                return response.id;
            } catch (error) {
                console.log("error", error);
                // Handle the error or display an appropriate error message to the user
            }
        },
        onApprove: async (data, actions) =>  {
        /**
         * data: {
         *   orderID: string;
         *   payerID: string;
         *   paymentID: string | null;
         *   billingToken: string | null;
         *   facilitatorAccesstoken: string;
         * }
         */
            try {
                setIsLoading(true)
                const response = await paypalApi.capture(data.orderID)
                const errorDetail = Array.isArray(response.details) && response.details[0];

                if (errorDetail && errorDetail.issue === 'INSTRUMENT_DECLINED') {
                    setIsLoading(false)
                    return actions.restart();
                }

                if (errorDetail) {
                    let msg = 'Sorry, your transaction could not be processed.';
                    msg += errorDetail.description ? ' ' + errorDetail.description : '';
                    msg += response.debug_id ? ' (' + response.debug_id + ')' : '';
                    
                    notification.error({
                        message: msg
                    })
                    setIsLoading(false)
                    return
                }

                if(response && response.status === "COMPLETED"){
                    await updateOrderStatusByPaypal(response.id, PAYMENT_STATUS.SUCCEEDED)

                    window.isRequiredTracking = false;
                    window.location.href = `${window.location.origin}${process.env.REACT_APP_HOMEPAGE}/project/payment-result/PAYPAL_ORDER_SUCCESS`;
                }
                setIsLoading(false)
            } catch (error) {
                setIsLoading(false)
            }
        }
    };

    const updateOrderStatusByPaypal = async (paypalOrderId, newStatus) => {
        const order = await orderApi.getByPaypalPaymentId(paypalOrderId);
        createShipment(order, newStatus)
    }

    return (
        <>
        <Spin spinning={isPending || isLoading}>
            <PayPalButtons 
                {...paypalbuttonTransactionProps} 
                fundingSource='paypal'
            />
        </Spin>
        
        </>
    );
}

const PaypalButtonsContainer = ({
    order
}) => {
    return <>
    <PayPalScriptProvider options={paypalScriptOptions}>
        <PaypalButton 
            order={order}
        />
    </PayPalScriptProvider>
    </>
}

export default PaypalButtonsContainer;