import { Col } from "antd"
import { useEffect, useState } from "react"
import pricingPlanApi from "../../../../api/pricingPlan.api"
import { PRICING_PLAN_FEATURES_KEY, TRIAL_EXPIRED_DAYS } from "../../../../utils/constants"
import { useSelector } from "react-redux"
import { getIsViewerMode } from "../../../../redux/modelSlice"
import _ from "lodash"

const DrobAPricingPlans = ({
    triedPlanIds,
    onTrialPlan = () => {},
    onPurchasePlan = () => {},
    selectedPayPer
}) => {
    const isViewerMode = useSelector(getIsViewerMode)
    const [plans, setPlans] = useState([])
    useEffect(() => {
        pricingPlanApi.getAvailablePricingPlans({isDrobA: 1}).then(rs => {
            setPlans(rs)
        })
    }, [])

    return <>
        {
            plans && plans.map(plan => (
                <Col lg={8} md={24} sm={24} xs={24} className="relative z-[2]">
                    <div className={`pricing-container`}>
                        <div className={`pricing-item high-light`}>
                            <div className="pricing-item-content">
                                <div className="flex justify-between gap-[12px] items-center mt-[12px]">
                                    <div className={`title`}>
                                        {plan?.name}
                                    </div>
                                    <div className="flex justify-start">
                                        <div className="tag-popular">
                                            Suggested     
                                        </div>
                                    </div>
                                </div>
                                <div className={`description mt-[7px]`}>
                                    {plan?.description}
                                </div>
                                <div className={`included-container mt-[clamp(12px,4.2vh,46px)]`}>
                                    <div className="text-included">
                                        <span className="text-bold">Features</span> everything in the plan...
                                    </div>
                                    <ol className="included-list mt-[clamp(12px,2.6vh,28px)]">
                                        {plan?.includedInfomation?.map((item, index) => (
                                            <li key={`${plan?.id}-${index}`}>
                                                <div className="list-style">
                                                    {index + 1}
                                                </div>
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
                                    {!isViewerMode && !(triedPlanIds || []).includes(plan?.id) && <>
                                        <div className="btn-trial-day" onClick={() => {onTrialPlan(plan)}}>
                                            Start your {_.get(_.find(_.get(plan, ['features'], []), {key: PRICING_PLAN_FEATURES_KEY.TRIAL_PERIOD}), ['value'], TRIAL_EXPIRED_DAYS)}-Days Free trial
                                        </div>
                                    </>}
                                    {!isViewerMode && (triedPlanIds || []).includes(plan?.id) && <>
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
                                            ${selectedPayPer === "Monthly" ? _.get(plan, ['pricing', 'monthly']) : _.get(plan, ['pricing', 'yearly'])}
                                        </span>
                                    </button>
                                    <button 
                                        className="btn-get-start mt-[9px]"
                                        onClick={() => {
                                            onPurchasePlan(plan, (selectedPayPer === "Monthly" ? _.get(plan, ['pricing', 'monthly']) : _.get(plan, ['pricing', 'yearly'])) * (selectedPayPer === "Monthly" ? 1 : 12), "Yearly")
                                        }}
                                    >
                                        Get Started
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Col>
            ))
        }
    </>
}
export default DrobAPricingPlans