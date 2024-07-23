import { Col, Row, Select } from "antd";
import "./styles.scss"
import RetailerTotalNumberOfUsers from "../../../components/retailerComponents/retailerTotalNumberOfUsers/RetailerTotalNumberOfUsers";
import RetailerTotalProducts from "../../../components/retailerComponents/retailerTotalProducts/RetailerTotalProducts";
import StoreArrowDownIcon from "../../../assets/icons/StoreArrowDownIcon";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setRun } from "../../../redux/joyrideSlice";
import NewUsers from "../../../components/adminComponents/newUsers/NewUsers";
import RetailerLoginActivity from "../../../components/retailerComponents/retailerLoginActivity/RetailerLoginActivity";
import ArrowRightIcon from "../../../assets/images/home/arrow-right.png"
import { useNavigate } from "react-router-dom";
import routesConstant from "../../../routes/routesConstant";

const DrobAHomePage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    useEffect(() => {
        dispatch(setRun(true))
    },[])
    return <>
        <div className="drob-a-home-page-container template-page">
            <Row className="px-[18px] md:px-[47px] pb-[40px]">
                <Col span={24}>
                    <div className="flex items-center justify-between gap-[20px] flex-wrap mt-[32px] mb-[16px] md:mt-[45px] md:mb-[45px]">
                        <div className="text-welcome text-[20px] leading-[45px] md:text-[40px] md:leading-[48px]">
                            Welcome to Dashboard
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
                        <Col lg={6} md={12} span={12}>
                            <RetailerTotalNumberOfUsers />
                        </Col>
                        <Col lg={6} md={12} span={12}>
                            <RetailerTotalProducts />
                        </Col>
                        <Col lg={6} md={12} span={24}>
                            <NewUsers />
                        </Col>
                        <Col lg={6} md={12} span={24}>
                            <RetailerLoginActivity />
                        </Col>
                        <Col span={24}>
                            <div className="min-h-[60vh] md:min-h-[40vh] drob-a-manage-store">
                                <div className="absolute bottom-[24px] left-[24px] right-[24px] h-fit flex items-end justify-between gap-[24px] flex-wrap">
                                    <div className="text-info max-w-[380px] text-[16px] leading-[20px] md:text-[24px] md:leading-[30px]">
                                        Let's shape the future of product showcase with Metadrob.
                                    </div>
                                    <button className="btn-manage w-full md:w-fit text-[16px] leading-[20px] md:text-[24px] md:leading-[30px]" onClick={() => {navigate(routesConstant.dashboardStore.path)}}>
                                        Manage your store
                                        <img src={ArrowRightIcon} alt="" className="icon-arrow-right" />
                                    </button>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    </>
}
export default DrobAHomePage;