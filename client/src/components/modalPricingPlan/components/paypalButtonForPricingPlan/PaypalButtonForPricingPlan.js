import React, { useEffect, useState } from 'react';
import {
    PayPalScriptProvider,
    PayPalButtons,
    usePayPalScriptReducer
  } from "@paypal/react-paypal-js";
import paypalApi from '../../../../api/paypal.api';
import { PAYMENT_GATE, PAYMENT_STATUS, PAYMENT_TYPE, PROJECT_MODE, USER_SUBCRIPTION_KEY } from '../../../../utils/constants';
import { Spin, notification } from 'antd';
import orderApi from '../../../../api/order.api';
import { createShipment } from '../../../../utils/util';
import { useSelector } from 'react-redux';
import { getUser } from '../../../../redux/appSlice';
import moment from 'moment';
import userSubcriptionApi from '../../../../api/userSubcription.api';
import _ from 'lodash';
import { useParams } from 'react-router-dom';
import projectApi, { updateProjectById } from '../../../../api/project.api';

const paypalScriptOptions = {
    "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID,
    currency: "USD"
};

const PaypalButtonForPricingPlan = ({
    total,
    plan,
    payPer,
    isPublishProject
}) => {
    const {id: projectId} = useParams()
    const [{ isPending }] = usePayPalScriptReducer();
    const [isLoading, setIsLoading] = useState(false)
    const user = useSelector(getUser)
    const paypalbuttonTransactionProps = {
        style: { layout: "vertical" },
        createOrder: async (data, actions) => {
            try {
                const body = {
                    userId: user.id,
                    key: USER_SUBCRIPTION_KEY.PRICING_PLAN,
                    value: {
                        amount: total,
                        pricingId: plan.id,
                        numOfDate: payPer === "Monthly" ? 30 : 365,
                        createdDate: moment(new Date()),
                        expiredDate: moment(new Date()).add(payPer === "Monthly" ? 30 : 365, 'day'),
                        paymentGate: PAYMENT_GATE.PAYPAL
                    }
                }
                const newSubcription = await userSubcriptionApi.createSubcription(body)
                const response = await paypalApi.createOrderForPricingPlan(newSubcription.id);
                return response.id;
            } catch (error) {
                notification.error({
                    message: _.get(error, ['response', 'data', 'message'], `Can't create order!`)
                })
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
                    await updateSubcriptionStatusByPaypal(response.id, PAYMENT_STATUS.SUCCEEDED)

                    if(isPublishProject && projectId){
                        await projectApi.updateProjectMode(projectId, {mode: PROJECT_MODE.PUBLISH})
                    }

                    window.isRequiredTracking = false;
                    let returnUrl = `${window.location.origin}${process.env.REACT_APP_HOMEPAGE}/project/payment-result/${PAYMENT_TYPE.PAYPAL_PLAN_SUCCESS}`
                    window.location.href = returnUrl;
                }
                setIsLoading(false)
            } catch (error) {
                setIsLoading(false)
            }
        }
    };

    const updateSubcriptionStatusByPaypal = async (paypalOrderId, newStatus) => {
        const plan = await userSubcriptionApi.getSubcription({key: USER_SUBCRIPTION_KEY.PRICING_PLAN, "value-paypalOrderId": paypalOrderId});
        if(plan){
            let data = {
                paymentStatus: newStatus
            }
            if(newStatus === PAYMENT_STATUS.SUCCEEDED){
                data.active = true;
            }
            userSubcriptionApi.updateSubcription(plan.id, data).then(rs => {

            })
        } else {

        }
    }

    return (
        <>
        <Spin spinning={isPending || isLoading}>
            <PayPalButtons 
                {...paypalbuttonTransactionProps} 
                fundingSource='paypal'
            > 
            </PayPalButtons>
        </Spin>
        
        </>
    );
}

const PaypalButtonForPricingPlanContainer = ({
    total,
    plan,
    payPer,
    isPublishProject = false
}) => {
    return <>
    <PayPalScriptProvider options={paypalScriptOptions} key={total}>
        <PaypalButtonForPricingPlan 
            total={total}
            plan={plan}
            payPer={payPer}
            isPublishProject={isPublishProject}
        />
    </PayPalScriptProvider>
    </>
}

export default PaypalButtonForPricingPlanContainer;