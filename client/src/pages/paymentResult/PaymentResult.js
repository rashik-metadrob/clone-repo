import { loadStripe } from "@stripe/stripe-js"
import { Col, Row, notification } from "antd"
import { useEffect, useRef, useState } from "react"
import "./styles.scss"

import envelopeIcon from "../../assets/images/payment/envelope.svg"
import { useNavigate, useParams } from "react-router-dom"
import { useDispatch } from "react-redux"
import { setIsHiddenPreview } from "../../redux/appSlice"
import orderApi from "../../api/order.api"
import { PAYMENT_STATUS, PAYMENT_TYPE, PROJECT_MODE, SHIPMENT_STATUS, USER_SUBCRIPTION_KEY } from "../../utils/constants"
import easyShipApi from "../../api/easyShip.api"
import userSubcriptionApi from "../../api/userSubcription.api"
import { setCart } from "../../redux/orderSlice"
import { createShipment, getDefaultHomePage } from "../../utils/util"
import projectApi, { updateProjectById } from "../../api/project.api"

const PaymentResult = () => {
    const {paymentType} = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const shouldUpdateOrder = useRef(true);

    useEffect(() => {
        dispatch(setIsHiddenPreview(true))
        return () => {
            dispatch(setIsHiddenPreview(false))
        }
    },[])
    useEffect(() => {
        if(shouldUpdateOrder.current){
            shouldUpdateOrder.current = false
        } else {
            return
        }
        if(paymentType === PAYMENT_TYPE.ORDER || paymentType === PAYMENT_TYPE.PAYPAL_ORDER_SUCCESS){
            dispatch(setCart([]))
        }
        const clientSecret = new URLSearchParams(window.location.search).get(
            "payment_intent_client_secret"
        );
      
        if (clientSecret) {
            loadStripe(process.env.REACT_APP_STRIPE_KEY).then((stripe) => {
                if (!stripe) {
                    return;
                }
    
                const isPublishProject = new URLSearchParams(window.location.search).get(
                    "isPublishProject"
                );
                const projectId = new URLSearchParams(window.location.search).get(
                    "projectId"
                );
              
                stripe.retrievePaymentIntent(clientSecret).then(async ({ paymentIntent, ...props }) => {
                    console.log("props", props, paymentIntent)
                    switch (paymentIntent.status) {
                        case "succeeded":
                            notification.success({
                                message: "Payment succeeded!"
                            })
                            if(paymentType === PAYMENT_TYPE.ORDER){
                                updateOrderStatusByStripe(clientSecret, PAYMENT_STATUS.SUCCEEDED)
                            } else if(paymentType === PAYMENT_TYPE.PRICING_PLAN){
                                updatePricingPlanStatusByStripe(clientSecret, PAYMENT_STATUS.SUCCEEDED)
                            }
    
                            if(isPublishProject && projectId){
                                projectApi.updateProjectMode(projectId, {mode: PROJECT_MODE.PUBLISH}).then(rs => {
                                    notification.success({
                                        message: "The store is publish successfully!"
                                    })
                                }).catch(err => {
                                    notification.error({
                                        message: "Update fail!"
                                    })
                                })
                            }
                            
                            break;
                        case "processing":
                            notification.info({
                                message: "Your payment is processing."
                            })
                            if(paymentType === PAYMENT_TYPE.ORDER){
                                updateOrderStatusByStripe(clientSecret, PAYMENT_STATUS.PROCESSING)
                            } else if(paymentType === PAYMENT_TYPE.PRICING_PLAN){
                                updatePricingPlanStatusByStripe(clientSecret, PAYMENT_STATUS.PROCESSING)
                            }
                            break;
                        case "requires_payment_method":
                            notification.error({
                                message: "Your payment was not successful, please try again."
                            })
                            if(paymentType === PAYMENT_TYPE.ORDER){
                                updateOrderStatusByStripe(clientSecret, PAYMENT_STATUS.FAIL)
                            } else if(paymentType === PAYMENT_TYPE.PRICING_PLAN){
                                updatePricingPlanStatusByStripe(clientSecret, PAYMENT_STATUS.FAIL)
                            }
                            break;
                        default:
                            notification.error({
                                message: "Something went wrong."
                            })
                            if(paymentType === PAYMENT_TYPE.ORDER){
                                updateOrderStatusByStripe(clientSecret, PAYMENT_STATUS.FAIL)
                            } else if(paymentType === PAYMENT_TYPE.PRICING_PLAN){
                                updatePricingPlanStatusByStripe(clientSecret, PAYMENT_STATUS.FAIL)
                            }
                            break;
                    }
                });
            })
        }
        // if(paymentType === PAYMENT_TYPE.PAYPAL_ORDER_SUCCESS){
        //     notification.success({
        //         message: "Payment succeeded!"
        //     })

        //     const paymentId = new URLSearchParams(window.location.search).get(
        //         "paymentId"
        //     );

        //     if(paymentId){
        //         updateOrderStatusByPaypal(paymentId, PAYMENT_STATUS.SUCCEEDED)
        //     }
        // }
        // if(paymentType === PAYMENT_TYPE.PAYPAL_ORDER_FAIL){
        //     notification.success({
        //         message: "Something went wrong."
        //     })

        //     const paymentId = new URLSearchParams(window.location.search).get(
        //         "paymentId"
        //     );

        //     if(paymentId){
        //         updateOrderStatusByPaypal(paymentId, PAYMENT_STATUS.FAIL)
        //     }
        // }
    },[])

    const updatePricingPlanStatusByStripe = async (clientSecret, newStatus) => {
        const plan = await userSubcriptionApi.getSubcription({key: USER_SUBCRIPTION_KEY.PRICING_PLAN, "value-stripeIntentSecret": clientSecret});
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

    const updateOrderStatusByStripe = async (clientSecret, newStatus) => {
        const order = await orderApi.getByIntentSecret(clientSecret);
        createShipment(order, newStatus)
    }

    const updateOrderStatusByPaypal = async (paypalOrderId, newStatus) => {
        const order = await orderApi.getByPaypalPaymentId(paypalOrderId);
        createShipment(order, newStatus)
    }

    return <>
        <Row gutter={[26, 26]} className="!ml-0 !mr-0 payment-result-page-container h-full py-[36px]">
            <Col lg={12} md={16} sm={24} className="payment-result-cart h-full justify-center items-center flex flex-col">
                <img src={envelopeIcon} alt="" className="w-[86px]"/>
                <div className="text-thanks mt-[36px]">
                    Thanks for payment!
                </div>
                <div className="text-receive mt-[16px]">
                    Your payment has been received!
                </div>
                <button className="btn-go-home mt-[32px]" onClick={() => {navigate(getDefaultHomePage())}}>
                    Go home
                </button>
            </Col>
        </Row>
    </>
}
export default PaymentResult