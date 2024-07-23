import { Col, Input, InputNumber, Row, Select, Spin, notification } from "antd"
import "./styles.scss"
import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react";
import _ from "lodash"
import { DEFAULT_PLAN, FORM_CONTROL_TYPE, OPTION_NO, OPTION_YES, PRICING_PLAN_FEATURES_FIELDS } from "../../../utils/constants";
import DownArrowIcon from "../../../assets/icons/DownArrowIcon";
import FormControlComboboxAndNumber from "../../../components/formControlComboboxAndNumber/FormControlComboboxAndNumber";
import pricingPlanApi from "../../../api/pricingPlan.api";

const AdminAddEditPlanPage = () => {
    const navigate = useNavigate()
    const {formMode, planId} = useParams();
    const [isLoading, setIsLoading] = useState(false)
    const [currentPlan, setCurrentPlan] = useState(DEFAULT_PLAN)

    useEffect(() => {
        if(formMode === 'edit' && planId){
            setIsLoading(true)
            pricingPlanApi.getPricingPlanById(planId).then(rs => {
                setIsLoading(false)

                const plan = _.cloneDeep(rs)
                delete plan.id
                setCurrentPlan(plan)
            })
        }
    },[formMode, planId])

    const onSubmit = () => {
        console.log('currentPlan', currentPlan)
        if(!currentPlan.name){
            notification.warning({
                message: "Plan name can't be null!"
            })
        }
        if(formMode === "create"){
            setIsLoading(true)
            pricingPlanApi.createPricingPlan(currentPlan).then(rs => {
                setIsLoading(false)
                notification.success({
                    message: "Create successfully!"
                })
                navigate(`/admin/plan`)
            }).catch(err => {
                setIsLoading(false)
                notification.error({
                    message: "Create failed!"
                })
            })
        } else if(formMode === "edit"){
            setIsLoading(true)
            pricingPlanApi.updatePricingPlan(planId, currentPlan).then(rs => {
                setIsLoading(false)
                notification.success({
                    message: "Update successfully!"
                })
                navigate(`/admin/plan`)
            }).catch(err => {
                setIsLoading(false)
                notification.error({
                    message: "Update failed!"
                })
            })
        }       
    }

    return <>
        <Spin spinning={isLoading}>
            <Row gutter={[26, 0]} className="!ml-0 !mr-0 mt-[30px] px-[56px] pricing-plan-form-container pb-[120px] relative">
                <Col lg={24} md={24} sm={24} xs={24}>
                    <Row className="plan-form-group">
                        <Col className="plan-form-label" lg={12} md={12} sm={24} xs={24}>
                            Plan Name
                        </Col>
                        <Col className="plan-form-control" lg={12} md={12} sm={24} xs={24}>
                            <Input 
                                className="plan-form-input" 
                                placeholder="Plan name"
                                value={currentPlan?.name}
                                onChange={(e) => {setCurrentPlan(_.set(_.cloneDeep(currentPlan), ["name"], e.target.value))}}
                            />
                        </Col>
                    </Row>
                    {/* <Row className="plan-form-group">
                        <Col className="plan-form-label" lg={12} md={12} sm={24} xs={24}>
                            Drob A Version
                        </Col>
                        <Col className="plan-form-control" lg={12} md={12} sm={24} xs={24}>
                            <div className="plan-group-form-input">
                                <Select
                                    className="filter-select"
                                    popupClassName="filter-select-popup"
                                    value={_.get(currentPlan, ["isDrobA"], false)} 
                                    options={[OPTION_YES, OPTION_NO]}
                                    onChange={(val) => {
                                        setCurrentPlan(_.set(_.cloneDeep(currentPlan), ["isDrobA"], val))
                                    }}
                                    suffixIcon={<DownArrowIcon/>}
                                />
                            </div>
                        </Col>
                    </Row> */}
                    <Row className="plan-form-group">
                        <Col className="plan-form-label" lg={12} md={12} sm={24} xs={24}>
                            Pricing
                        </Col>
                        <Col className="plan-form-control" lg={12} md={12} sm={24} xs={24}>
                            <div className="group-pricing-container">
                                <div className="pricing-container">
                                    <div className="text-price w-[78px] text-left">
                                        Monthly
                                    </div>
                                    <InputNumber 
                                        min={1} 
                                        max={99999}
                                        className="plan-form-input"
                                        value={currentPlan?.pricing?.monthly}
                                        onChange={(e) => {setCurrentPlan(_.set(_.cloneDeep(currentPlan), ["pricing", "monthly"], e))}}
                                    />
                                    <div className="text-price">
                                        /mo
                                    </div>
                                </div>
                                <div className="pricing-container mt-[12px]">
                                    <div className="text-price w-[78px] text-left">
                                        Yearly
                                    </div>
                                    <InputNumber 
                                        min={1} 
                                        max={99999}
                                        className="plan-form-input"
                                        value={currentPlan?.pricing?.yearly}
                                        onChange={(e) => {setCurrentPlan(_.set(_.cloneDeep(currentPlan), ["pricing", "yearly"], e))}}
                                    />
                                    <div className="text-price">
                                        /mo
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>

                    {
                        PRICING_PLAN_FEATURES_FIELDS.map(el => (
                            <Row className={`plan-form-group ${el.isHighLight ? 'highlight' : ''}`} key={el.key}>
                                <Col className="plan-form-label" lg={12} md={12} sm={24} xs={24}>
                                    <div>
                                        {el.displayText}
                                    </div>
                                    {el.description && <div className="plan-form-label-description">
                                        {el.description}
                                    </div>}
                                </Col>
                                <Col className="plan-form-control" lg={12} md={12} sm={24} xs={24}>
                                    {
                                        el.valueType === FORM_CONTROL_TYPE.NUMBER && 
                                        <InputNumber 
                                            min={1} 
                                            value={
                                                _.get(
                                                    _.find(currentPlan?.features, o => o.key === el.key ), 
                                                    ["value"], 
                                                    _.has(el, ['defaultValue']) ? el.defaultValue : 1
                                                )
                                            } 
                                            onChange={(val) => {
                                                const isExist = currentPlan?.features.find(f => f.key === el.key)
                                                if(isExist){
                                                    const newFeatures = currentPlan?.features.map(f => {
                                                        if(f.key === el.key) {
                                                            return {
                                                                ...f,
                                                                value: val,
                                                            }
                                                        }
    
                                                        return f;
                                                    })
    
                                                    setCurrentPlan(_.set(_.cloneDeep(currentPlan), ["features"], newFeatures))
                                                } else {
                                                    const newFeatures = [
                                                        ...currentPlan?.features, {
                                                            ...el,
                                                            value: val,
                                                        }
                                                    ]
    
                                                    setCurrentPlan(_.set(_.cloneDeep(currentPlan), ["features"], newFeatures))
                                                }
                                            }}
                                            className="plan-form-input"
                                        />
                                    }
                                    {
                                        el.valueType === FORM_CONTROL_TYPE.COMBOBOX && 
                                        <div className="plan-group-form-input">
                                            <Select
                                                className="filter-select"
                                                popupClassName="filter-select-popup"
                                                value={_.get(_.find(currentPlan?.features, o => o.key === el.key ), ["value"], 1)} 
                                                options={el.options}
                                                onChange={(val) => {
                                                    let newFeatures = currentPlan?.features
                                                    if(currentPlan?.features.find(f => f.key === el.key)){
                                                        newFeatures = currentPlan?.features.map(f => {
                                                            if(f.key === el.key) {
                                                                return {
                                                                    ...f,
                                                                    value: val,
                                                                }
                                                            }
    
                                                            return f;
                                                        })
                                                    } else {
                                                        newFeatures = [
                                                            {
                                                                ..._.pick(el, ['key', 'displayText', 'description']),
                                                                value: val,
                                                            },
                                                            ...newFeatures
                                                        ]
                                                    }
                                                    
                                                    setCurrentPlan(_.set(_.cloneDeep(currentPlan), ["features"], newFeatures))
                                                }}
                                                suffixIcon={<DownArrowIcon/>}
                                            />
                                            {el.key === "TRIAL_PERIOD" && <span className="plan-form-input-text">
                                                Days
                                            </span>}
                                        </div>
                                    }
                                    {
                                        el.valueType === FORM_CONTROL_TYPE.COMBOBOX_AND_NUMBER && 
                                        <>
                                            <FormControlComboboxAndNumber
                                                value={_.get(_.find(currentPlan?.features, o => o.key === el.key ), ["value"], 1)}
                                                options={el.options}
                                                onChange={(val) => {
                                                    const newFeatures = currentPlan?.features.map(f => {
                                                        if(f.key === el.key) {
                                                            return {
                                                                ...f,
                                                                value: val,
                                                            }
                                                        }
        
                                                        return f;
                                                    })

                                                    setCurrentPlan(_.set(_.cloneDeep(currentPlan), ["features"], newFeatures))
                                                }}
                                            ></FormControlComboboxAndNumber>
                                        </>
                                    }
                                </Col>
                            </Row>
                        ))
                    }
                </Col>
                <Col lg={24} md={24} sm={24} xs={24} className="py-[26px] flex justify-end admin-footer-sticky !bottom-[-5px]">
                    <div className="btn-save" onClick={onSubmit}>
                        Save
                    </div>
                </Col>
            </Row>
        </Spin>
    </>
}
export default AdminAddEditPlanPage