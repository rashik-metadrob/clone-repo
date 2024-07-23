import { Col, Row, Select } from "antd";
import "./styles.scss"
import RetailerGrossIncome from "../../../components/retailerComponents/retailerGrossIncome/RetailerGrossIncome";
import RetailerNoOfStores from "../../../components/retailerComponents/retailerNoOfStores/RetailerNoOfStores";
import RetailerTotalNumberOfUsers from "../../../components/retailerComponents/retailerTotalNumberOfUsers/RetailerTotalNumberOfUsers";
import RetailerTotalProducts from "../../../components/retailerComponents/retailerTotalProducts/RetailerTotalProducts";
import NewUsers from "../../../components/adminComponents/newUsers/NewUsers";
import RetailerLoginActivity from "../../../components/retailerComponents/retailerLoginActivity/RetailerLoginActivity";
import RetailerTimeSpentOnExploringStore from "../../../components/retailerComponents/retailerTimeSpentOnExploringStore/RetailerTimeSpentOnExploringStore";
import RetailerActiveUsersCard from "../../../components/retailerComponents/retailerActiveUsersCard/RetailerActiveUsersCard";
import RetailerHeatMapCard from "../../../components/retailerComponents/retailerHeatMapCard/RetailerHeatMapCard";
import RetailerLast5OrdersCard from "../../../components/retailerComponents/retailerLast5OrdersCard/RetailerLast5OrdersCard";
import RetailerProductOfTheMonthCard from "../../../components/retailerComponents/retailerProductOfTheMonthCard/RetailerProductOfTheMonthCard";
import StoreArrowDownIcon from "../../../assets/icons/StoreArrowDownIcon";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setRun } from "../../../redux/joyrideSlice";
import RetailerStorageAnalysis from "../../../components/retailerComponents/retailerStorageAnalysis/RetailerStorageAnalysis";
import { useTranslation } from "react-i18next";

const RetailerHomePage = () => {
    const dispatch = useDispatch()
    const { t } = useTranslation()
    useEffect(() => {
        dispatch(setRun(true))
    },[])
    return <>
        <div className="retailer-home-page-container template-page">
            <Row className="px-[18px] md:px-[47px] pb-[40px]">
                <Col span={24}>
                    <div className="flex items-center justify-between gap-[20px] flex-wrap mt-[32px] mb-[16px] md:mt-[45px] md:mb-[45px]">
                        <div className="text-welcome text-[20px] leading-[45px] md:text-[40px] md:leading-[48px]">
                            {t('global.welcome_to_dashboard')}
                        </div>
                        {/* <div className="retailer-filter-container">
                            <Select
                                className="retailer-select-store"
                                value={null}
                                onChange={(e) => {}}
                                options={[]}
                                popupClassName="retailer-form-select-popup"
                                placeholder="Select Store"
                                suffixIcon={<StoreArrowDownIcon/>}
                            />
                        </div> */}
                    </div>
                </Col>
                <Col span={24}>
                    <Row gutter={[16, 28]}>
                        <Col lg={6} md={12} span={24}>
                            <RetailerGrossIncome />
                        </Col>
                        <Col lg={6} md={12} span={24}>
                            <RetailerNoOfStores />
                        </Col>
                        <Col lg={12} md={12} span={24}>
                            <RetailerStorageAnalysis />
                        </Col>
                        <Col lg={6} md={12} span={24}>
                            <NewUsers />
                        </Col>
                        <Col lg={6} md={12} span={24}>
                            <RetailerLoginActivity />
                        </Col>
                        <Col lg={6} md={12} span={24}>
                            <RetailerTimeSpentOnExploringStore />
                        </Col>
                        <Col lg={6} md={12} span={24}>
                            
                        </Col>
                        {/* <Col lg={9} span={24}>
                            <RetailerActiveUsersCard />
                        </Col> */}
                        <Col lg={15} span={24}>
                            <RetailerProductOfTheMonthCard />
                        </Col>
                        <Col lg={9} span={24}>
                            <RetailerHeatMapCard />
                        </Col>
                        <Col lg={15} span={24}>
                            <RetailerLast5OrdersCard />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    </>
}
export default RetailerHomePage;