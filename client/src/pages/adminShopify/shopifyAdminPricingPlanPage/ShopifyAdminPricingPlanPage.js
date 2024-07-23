import { Col, Dropdown, Input, InputNumber, Modal, Row, Select, Spin, notification } from "antd";
import "./styles.scss"
import { useEffect, useState } from "react";
import pricingPlanApi from "../../../api/pricingPlan.api";
import loadingAnimation from "../../../assets/json/Add Products.json"
import { FORM_CONTROL_TYPE, PRICING_PLAN_FEATURES_FIELDS } from "../../../utils/constants";
import _ from "lodash";
import FormControlComboboxAndNumber from "../../../components/formControlComboboxAndNumber/FormControlComboboxAndNumber";
import DownArrowIcon from "../../../assets/icons/DownArrowIcon";
import Lottie from "lottie-react";

const ShopifyAdminPricingPlanPage = () => {
    const [currentPlan, setCurrentPlan] = useState();
    const [isLoading, setIsLoading] = useState(false)

    function loadData() {
        setIsLoading(true)
        pricingPlanApi.getShopifyPricingPlan().then((rs) => {
            setCurrentPlan(rs)
            setIsLoading(false)
        }).catch(err => {
            notification.error({
                message: _.get(err, ['response', 'data', 'message'], `Can't get Shopify Plan!`)
            })
            setIsLoading(false)
        })
    }

    useEffect(() => {
        loadData();
    },[])

    const onSubmit = () => {
        if(!currentPlan.name){
            notification.warning({
                message: "Plan name can't be null!"
            })
        }
        setIsLoading(true)
        pricingPlanApi.updatePricingPlan(currentPlan.id, currentPlan).then(rs => {
            setIsLoading(false)
            notification.success({
                message: "Update successfully!"
            })
        }).catch(err => {
            setIsLoading(false)
            notification.error({
                message: "Update failed!"
            })
        }) 
    }

    return <>
        <Row gutter={[26, 89]} className="!ml-0 !mr-0 mt-[30px] shopify-admin-pricing-plan-page-container mb-[120px]">
            <Col lg={24} md={24} sm={24} xs={24}>
                <div className="admin-container-header">
                    <div className="left-side__template">
                        <div className="title">{currentPlan?.name}</div>
                    </div>
                </div>
                <div className="mt-[0px] admin-content-container">
                    {
                        currentPlan && <>
                            <Spin spinning={isLoading} className="loading-indicator-wrapper-center" indicator={<Lottie animationData={loadingAnimation} />}>
                                <Row gutter={[26, 0]} className="!ml-0 !mr-0 mt-[30px] px-[56px] pricing-plan-form-container pb-[120px] relative">
                                    <Col lg={24} md={24} sm={24} xs={24}>
                                        {/* <Row className="plan-form-group">
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
                                        </Row> */}
                                        {/* <Row className="plan-form-group">
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
                                        </Row> */}

                                        {
                                            PRICING_PLAN_FEATURES_FIELDS.filter(el => el.key !== 'TRIAL_PERIOD').map(el => (
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
                </div>
            </Col>
        </Row>
    </>
}
export default ShopifyAdminPricingPlanPage;