import { Col, Row, Select } from "antd"
import "./styles.scss"
import ArrowLeftIcon from "../../../assets/images/products/arrow-left.svg"
import StoreArrowDownIcon from "../../../assets/icons/StoreArrowDownIcon"
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
import RetailerProductOfTheMonthTable from "../../../components/retailerComponents/retailerProductOfTheMonthTable/RetailerProductOfTheMonthTable";
import RetailerActiveUsersChart from "../../../components/retailerComponents/retailerActiveUsersChart/RetailerActiveUsersChart";

const RetailerAnalyticsPage = () => {

    const onBack = () => {

    }

    return <>
        <Row gutter={[26, 34]} className="!mr-0 !ml-0 pt-[18px] pb-[40px] px-[18px] retailer-analytic-page template-page">
            <Col span={24}>
                <div className="flex gap-[16px] justify-between items-center flex-wrap">
                    <div className="back-container">
                        <button className="btn-back" onClick={() => {onBack()}}>
                            <img src={ArrowLeftIcon} alt="" />
                            Back
                        </button>
                    </div>
                    <div className="retailer-filter-container">
                        <Select
                            className="retailer-select-store"
                            value={null}
                            onChange={(e) => {}}
                            options={[]}
                            popupClassName="retailer-form-select-popup"
                            placeholder="Select Store"
                            suffixIcon={<StoreArrowDownIcon/>}
                        />
                    </div>
                </div>
            </Col>
            <Col span={24} className="">
                <Row gutter={[16, 28]}>
                    <Col lg={6} md={12} span={24}>
                        <RetailerGrossIncome />
                    </Col>
                    <Col lg={6} md={12} span={24}>
                        <RetailerNoOfStores />
                    </Col>
                    <Col lg={6} md={12} span={24}>
                        <RetailerTotalNumberOfUsers />
                    </Col>
                    <Col lg={6} md={12} span={24}>
                        <RetailerTotalProducts />
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
                    <Col lg={9} span={24}>
                        <RetailerActiveUsersChart />
                    </Col>
                    <Col lg={15} span={24}>
                        <RetailerProductOfTheMonthTable />
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
    </>
}
export default RetailerAnalyticsPage