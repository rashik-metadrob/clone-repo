import "./styles.scss";
import { Modal, Row, Spin, notification } from "antd";
import { useEffect, useState } from "react";
import { CONFIG_TEXT, PAYMENT_GATE, PAYMENT_STATUS, PLANS_TYPES, PRICING_PLAN_FEATURES_KEY, TRIAL_EXPIRED_DAYS, USER_SUBCRIPTION_KEY } from "../../utils/constants";
import ModalPaymentPricingPlan from "../modalPaymentPricingPlan/ModalPaymentPricingPlan";
import { useSelector } from "react-redux";
import { getIsViewerMode } from "../../redux/modelSlice";
import { getUser, setUser } from "../../redux/appSlice";
import { userApi } from "../../api/user.api";
import moment from "moment";
import userSubcriptionApi from "../../api/userSubcription.api";
import { useAppDispatch } from "../../redux";
import _ from "lodash";
import MetadrobPricingPlans from "./components/metadrobPricingPlans/MetadrobPricingPlans";
import DrobAPricingPlans from "./components/drobAPricingPlans/DrobAPricingPlans";
import ExitIcon from "../../assets/images/project/exit.svg"
import Lottie from "lottie-react";
import loadingAnimation from "../../assets/json/Add Products.json"
import ModalPaypalForPricingPlan from "./components/modalPaypalForPricingPlan/ModalPaypalForPricingPlan";
import global from "../../redux/global";
import { useAuthenticatedFetch } from "../../modules/shopify/hooks";
import { useParams } from "react-router-dom";
import { useAppBridgeRedirect } from "../../modules/shopify/hooks/useAuthenticatedFetch";
import { isMobile } from "react-device-detect";
import ModalExitIcon from "../../assets/images/project/modal-exit.svg"

const ModalPricingPlan = ({
    open,
    onClose,
    isPublishProject = false,
    isChangeToOrther = false
}) => {
    const {id: projectId} = useParams()
    const dispatch = useAppDispatch()
    const [planType, setPlanType] = useState(global.IS_DROB_A ? PLANS_TYPES.DIGITAL_SHOWCASE : PLANS_TYPES.E_COMMERCE)
    const isViewerMode = useSelector(getIsViewerMode)
    const user = useSelector(getUser)

    const [triedPlanIds, setTriedPlanIds]  = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const [selectedPayPer, setSelectedPayPer] = useState("Monthly")

    const [isShowModalPaypal, setIsShowModalPaypal] = useState(false)
    const [purchasePlanInfo, setPurchasePlanInfo] = useState({
        plan: {},
        total: 0,
        payPer: "Yearly"
    })

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const fetch = global.IS_SHOPIFY ? useAuthenticatedFetch() : null
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const appBrigdeRedirect = global.IS_SHOPIFY ? useAppBridgeRedirect() : null

    useEffect(() => {
        if(user?.id){
            userApi.getListTriedPlanIds(user.id).then(rs => {
                setTriedPlanIds(rs)
            })
        }
    }, [user?.id])

    const onTrialPlan = (plan) => {
        if(!plan){
            notification.warning({
                message: CONFIG_TEXT.PLEASE_CHOOSE_PLAN
            })
            return
        }
        if(!user?.id){
            return
        }
        if(!triedPlanIds.includes(plan?.id)){
            setIsLoading(true)
            const trialDays = _.get(_.find(_.get(plan, ['features'], []), {key: PRICING_PLAN_FEATURES_KEY.TRIAL_PERIOD}), ['value'], TRIAL_EXPIRED_DAYS)

            const body = {
                userId: user.id,
                key: USER_SUBCRIPTION_KEY.PRICING_PLAN,
                value: {
                  pricingId: plan?.id,
                  stripeIntentSecret: null,
                  numOfDate: trialDays,
                  createdDate: moment(new Date()),
                  expiredDate: moment(new Date()).add(trialDays, 'day'),
                  isTrial: true,
                  paymentGate: "NONE"
                },
                paymentStatus: PAYMENT_STATUS.SUCCEEDED,
                active: true,
            }
            userSubcriptionApi.createSubcription(body).then(rs => {
                userApi.updateLoggedInUser({
                    triedPlanIds: [...triedPlanIds, plan?.id]
                }).then(userData => {
                    notification.success({
                        message: "Subcribe Trial version!"
                    })
                    setIsLoading(false)
                    dispatch(setUser(userData.user))
                    setTriedPlanIds(_.get(userData, ['user', 'triedPlanIds'], []))
                    onClose()
                }).catch(err => {
                    setIsLoading(false)
                    notification.error({
                        message: _.get(err, ['response', 'data', 'message'], `Can't update user!`)
                    })
                })
            }).catch(err => {
                setIsLoading(false)
                notification.error({
                    message: _.get(err, ['response', 'data', 'message'], `Can't subcribe Trial version!`)
                })
            })
        }
    }

    const onPurchasePlan = async (plan, total, payPer) => {
        // Removed this logic for shopify
        if(global.IS_SHOPIFY) {
            setIsLoading(true)
            try {
                const data = await getPurchaseOneTimeUrl(total, plan)

                if(_.get(data, ['body', 'data', 'appPurchaseOneTimeCreate', 'userErrors', 'length'], 0)) {
                    setIsLoading(false)
                    notification.error({
                        message: _.get(data, ['body', 'data', 'appPurchaseOneTimeCreate', 'userErrors', '0', 'message'], `Can't create app purchase one time!`)
                    })
                } else {
                    const confirmationUrl = _.get(data, ['body', 'data', 'appPurchaseOneTimeCreate', 'confirmationUrl'])
                    console.log('confirmationUrl', confirmationUrl)
                    if(confirmationUrl) {
                        const appPurchaseOneTime = _.get(data, ['body', 'data', 'appPurchaseOneTimeCreate', 'appPurchaseOneTime'])

                        const body = {
                            userId: user.id,
                            key: USER_SUBCRIPTION_KEY.PRICING_PLAN,
                            value: {
                                amount: total,
                                pricingId: plan.id,
                                numOfDate: payPer === "Monthly" ? 30 : 365,
                                createdDate: moment(new Date()),
                                expiredDate: moment(new Date()).add(payPer === "Monthly" ? 30 : 365, 'day'),
                                paymentGate: PAYMENT_GATE.SHOPIFY_BILLING,
                                appPurchaseOneTime,
                                userData: {
                                    isPublishProject,
                                    projectId
                                }
                            }
                        }
                        const newSubcription = await userSubcriptionApi.createSubcription(body)
                        setIsLoading(false)
                        if(newSubcription.id) {
                            appBrigdeRedirect(confirmationUrl)
                        } else {
                            notification.error({
                                message: `Can't create subcription for ${plan.name}`
                            })
                        }
                    } else {
                        setIsLoading(false)
                        notification.error({
                            message: "Can't retrive confirm url!"
                        })
                    }
                }
            } catch (err) {
                setIsLoading(false)
            }
            
        } else {
            setPurchasePlanInfo({
                plan,
                total,
                payPer
            })
            setIsShowModalPaypal(true)
        }
    }

    const getPurchaseOneTimeUrl = async (total, plan) => {
        const body = {
            amount: total, 
            currencyCode: "USD", 
            name: `Payment for ${_.get(plan, ['name'])}`,
        }

        const response = await fetch("/shopify/get-purchase-one-time-url", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body)
        })
        const data = await response.json()

        return data
    }

    return <>
        <Modal
            open={open}
            width={`clamp(900px,75vw,1440px)`}
            footer={null}
            centered
            closable={isMobile}
            closeIcon={isMobile ? <img src={ModalExitIcon} alt="" /> : null}
            className="modal-pricing-plan"
            onCancel={() => {onClose()}}
        >
            <div className='pricing-plan-content'>
                <div className="pricing-plan-content-container">
                    <div className="content-title px-[18px]">
                        <div className="content-title-text">
                            We’ve got a plan that’s <span className="text-gradient">perfect for you</span>
                        </div>
                        <div className="toggle-select-pay-per-container">
                            <button className={`btn-select-pay-per ${selectedPayPer === 'Monthly' ? 'active' : ''}`} onClick={() => {setSelectedPayPer('Monthly')}}>
                                Monthly billing
                            </button>
                            <button className={`btn-select-pay-per ${selectedPayPer === 'Yearly' ? 'active' : ''}`} onClick={() => {setSelectedPayPer('Yearly')}}>
                                Annual billing
                            </button>
                        </div>
                    </div>
                    <div className="plans-container">
                        <Spin spinning={isLoading} wrapperClassName="loading-indicator-wrapper" indicator={<Lottie animationData={loadingAnimation} />}>
                            <Row className="pricing-wrapper min-h-[65vh] mt-[clamp(12px,2.6vh,28px)] justify-center" gutter={[26, 26]}>
                                {planType === PLANS_TYPES.DIGITAL_SHOWCASE && <DrobAPricingPlans 
                                    triedPlanIds={triedPlanIds}
                                    onTrialPlan={onTrialPlan}
                                    selectedPayPer={selectedPayPer}
                                    onPurchasePlan={onPurchasePlan}
                                />}
                                {planType === PLANS_TYPES.E_COMMERCE && <MetadrobPricingPlans 
                                    triedPlanIds={triedPlanIds}
                                    onTrialPlan={onTrialPlan}
                                    onPurchasePlan={onPurchasePlan}
                                    selectedPayPer={selectedPayPer}
                                />}
                            </Row>
                        </Spin>
                    </div>
                </div>
            </div>
        </Modal>
        <ModalPaypalForPricingPlan
            open={isShowModalPaypal}
            purchasePlanInfo={purchasePlanInfo}
            isPublishProject={isPublishProject}
            onClose={() => {setIsShowModalPaypal(false)}}
        />
    </>
}
export default ModalPricingPlan;