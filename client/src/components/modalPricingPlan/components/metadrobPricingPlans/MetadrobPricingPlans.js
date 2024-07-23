import { Col } from "antd"
import { useEffect, useState } from "react"
import pricingPlanApi from "../../../../api/pricingPlan.api"
import _ from "lodash"
import { PRICING_PLAN_FEATURES_KEY, TRIAL_EXPIRED_DAYS } from "../../../../utils/constants"
import { useSelector } from "react-redux"
import { getIsViewerMode } from "../../../../redux/modelSlice"
import PaypalButtonForPricingPlanContainer from "../paypalButtonForPricingPlan/PaypalButtonForPricingPlan"

const MetadrobPricingPlans = ({
    triedPlanIds,
    onTrialPlan = () => {},
    onPurchasePlan = () => {},
    selectedPayPer
}) => {
    const isViewerMode = useSelector(getIsViewerMode)
    const [plans, setPlans] = useState([])
    const [firstPlan, setFirstPlan] = useState([])
    const [secondPlan, setSecondPlan] = useState([])
    const [thirdPlan, setThirdPlan] = useState([])

    useEffect(() => {
        pricingPlanApi.getAvailablePricingPlans({isDrobA: 0}).then(rs => {
            setPlans(rs)
            const first = rs?.find(item => item.display === 'first');
            setFirstPlan(first)

            const second = rs?.find(item => item.display === 'second');
            setSecondPlan(second)

            const third = rs?.find(item => item.display === 'third');
            setThirdPlan(third)
        })
    }, [])

    function getHiddenClass(item) {
        return item ? '': ' hidden-cls'
    }

    return <>
        <Col lg={8} md={24} sm={24} xs={24} className="relative z-[1]">
            <div className={`pricing-container py-[27px]`}>
                <div className={`pricing-item`}>
                    <div className="pricing-item-content">
                        <div className={`title ${getHiddenClass(firstPlan)}`}>
                            {firstPlan?.name}
                        </div>
                        <div className={`description mt-[7px] ${getHiddenClass(firstPlan)}`}>
                            {firstPlan?.description}
                        </div>
                        <div className={`included-container mt-[clamp(12px,4.2vh,46px)] ${getHiddenClass(firstPlan)}`}>
                            <div className="text-included">
                                <span className="text-bold">Features</span> everything in the plan...
                            </div>
                            <ol className="included-list mt-[clamp(12px,2.6vh,28px)]">
                                {firstPlan?.includedInfomation?.map((item, index) => (
                                    <li key={`${firstPlan?.id}-${index}`}>
                                        <span className="list-style">
                                            {index + 1}
                                        </span>
                                        <span className="content">
                                            {item}
                                        </span>
                                    </li>
                                ))}
                            </ol>
                            <div className="text-view-full-plan mt-[12px]">
                                View Full Plan
                            </div>
                        </div>
                        <div className="price-container mt-[clamp(12px,2.6vh,28px)]">
                            {!isViewerMode && !(triedPlanIds || []).includes(firstPlan?.id) && <>
                                <div className="btn-trial-day" onClick={() => {onTrialPlan(firstPlan)}}>
                                    Start your {_.get(_.find(_.get(firstPlan, ['features'], []), {key: PRICING_PLAN_FEATURES_KEY.TRIAL_PERIOD}), ['value'], TRIAL_EXPIRED_DAYS)}-Days Free trial
                                </div>
                            </>}
                            {!isViewerMode && (triedPlanIds || []).includes(firstPlan?.id) && <>
                                <div className="trial-day">
                                    Trial expired
                                </div>
                            </>}
                            <button 
                                className="btn-buy-monthly mt-[4px]"
                            >
                                <span className="text-des">
                                    {selectedPayPer} Investment@
                                </span>
                                <span className="text-price">
                                    ${selectedPayPer === "Monthly" ? _.get(firstPlan, ['pricing', 'monthly']) : _.get(firstPlan, ['pricing', 'yearly'])}
                                </span>
                            </button>
                            <button 
                                className="btn-get-start mt-[9px]"
                                onClick={() => {
                                    onPurchasePlan(firstPlan, (selectedPayPer === "Monthly" ? _.get(firstPlan, ['pricing', 'monthly']) : _.get(firstPlan, ['pricing', 'yearly'])) * (selectedPayPer === "Monthly" ? 1 : 12), "Yearly")
                                }}
                            >
                                Get Started
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Col>
        <Col lg={8} md={24} sm={24} xs={24} className="relative z-[2]">
            <div className={`pricing-container`}>
                <div className={`pricing-item high-light`}>
                <div className="pricing-item-content">
                    <div className="flex justify-between gap-[12px] items-center mt-[12px]">
                        <div className={`title ${getHiddenClass(secondPlan)}`}>
                            {secondPlan?.name}
                        </div>
                        <div className="flex justify-start">
                            <div className="tag-popular">
                                Popular     
                            </div>
                        </div>
                    </div>
                    <div className={`description mt-[7px] ${getHiddenClass(secondPlan)}`}>
                        {secondPlan?.description}
                    </div>
                    <div className={`included-container mt-[clamp(12px,4.2vh,46px)] ${getHiddenClass(secondPlan)}`}>
                        <div className="text-included">
                            <span className="text-bold">Features</span> everything in the plan...
                        </div>
                        <ol className="included-list mt-[clamp(12px,2.6vh,28px)]">
                            {secondPlan?.includedInfomation?.map((item, index) => (
                                <li key={`${secondPlan?.id}-${index}`}>
                                    <span className="list-style">
                                        {index + 1}
                                    </span>
                                    <span className="content">
                                        {item}
                                    </span>
                                </li>
                            ))}
                        </ol>
                        <div className="text-view-full-plan mt-[12px]">
                            View Full Plan
                        </div>
                    </div>
                    <div className="price-container mt-[clamp(12px,2.6vh,28px)]">
                            {!isViewerMode && !(triedPlanIds || []).includes(secondPlan?.id) && <>
                                <div className="btn-trial-day" onClick={() => {onTrialPlan(secondPlan)}}>
                                    Start your {_.get(_.find(_.get(secondPlan, ['features'], []), {key: PRICING_PLAN_FEATURES_KEY.TRIAL_PERIOD}), ['value'], TRIAL_EXPIRED_DAYS)}-Days Free trial
                                </div>
                            </>}
                            {!isViewerMode && (triedPlanIds || []).includes(secondPlan?.id) && <>
                                <div className="trial-day">
                                    Trial expired
                                </div>
                            </>}
                            <button 
                                className="btn-buy-monthly mt-[4px]"
                            >
                                <span className="text-des">
                                    {selectedPayPer} Investment@
                                </span>
                                <span className="text-price">
                                    ${selectedPayPer === "Monthly" ? _.get(secondPlan, ['pricing', 'monthly']) : _.get(secondPlan, ['pricing', 'yearly'])}
                                </span>
                            </button>
                            <button 
                                className="btn-get-start mt-[9px]"
                                onClick={() => {
                                    onPurchasePlan(secondPlan, (selectedPayPer === "Monthly" ? _.get(secondPlan, ['pricing', 'monthly']) : _.get(secondPlan, ['pricing', 'yearly'])) * (selectedPayPer === "Monthly" ? 1 : 12), "Yearly")
                                }}
                            >
                                Get Started
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Col>
        <Col lg={8} md={24} sm={24} xs={24} className="relative z-[1]">
            <div className={`pricing-container py-[27px]`}>
                <div className={`pricing-item`}>
                    <div className="pricing-item-content">
                        <div className={`title ${getHiddenClass(thirdPlan)}`}>
                            {thirdPlan?.name}
                        </div>
                        <div className={`description mt-[7px] ${getHiddenClass(thirdPlan)}`}>
                            {thirdPlan?.description}
                        </div>
                        <div className={`included-container mt-[clamp(12px,4.2vh,46px)] ${getHiddenClass(thirdPlan)}`}>
                            <div className="text-included">
                                <span className="text-bold">Features</span> everything in the plan...
                            </div>
                            <ol className="included-list mt-[clamp(12px,2.6vh,28px)]">
                                {thirdPlan?.includedInfomation?.map((item, index) => (
                                    <li key={`${thirdPlan?.id}-${index}`}>
                                        <span className="list-style">
                                            {index + 1}
                                        </span>
                                        <span className="content">
                                            {item}
                                        </span>
                                    </li>
                                ))}
                            </ol>
                            <div className="text-view-full-plan mt-[12px]">
                                View Full Plan
                            </div>
                        </div>
                        <div className="price-container mt-[clamp(12px,2.6vh,28px)]">
                            {!isViewerMode && !(triedPlanIds || []).includes(thirdPlan?.id) && <>
                                <div className="btn-trial-day" onClick={() => {onTrialPlan(thirdPlan)}}>
                                    Start your {_.get(_.find(_.get(thirdPlan, ['features'], []), {key: PRICING_PLAN_FEATURES_KEY.TRIAL_PERIOD}), ['value'], TRIAL_EXPIRED_DAYS)}-Days Free trial
                                </div>
                            </>}
                            {!isViewerMode && (triedPlanIds || []).includes(thirdPlan?.id) && <>
                                <div className="trial-day">
                                    Trial expired
                                </div>
                            </>}
                            <button 
                                className="btn-buy-monthly mt-[4px]"
                            >
                                <span className="text-des">
                                    {selectedPayPer} Investment@
                                </span>
                                <span className="text-price">
                                    ${selectedPayPer === "Monthly" ? _.get(thirdPlan, ['pricing', 'monthly']) : _.get(thirdPlan, ['pricing', 'yearly'])}
                                </span>
                            </button>
                            <button 
                                className="btn-get-start mt-[9px]"
                                onClick={() => {
                                    onPurchasePlan(thirdPlan, (selectedPayPer === "Monthly" ? _.get(thirdPlan, ['pricing', 'monthly']) : _.get(thirdPlan, ['pricing', 'yearly'])) * (selectedPayPer === "Monthly" ? 1 : 12), "Yearly")
                                }}
                            >
                                Get Started
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Col>
    </>
}
export default MetadrobPricingPlans