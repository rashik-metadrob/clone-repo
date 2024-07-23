import { Col, DatePicker, Row, Select } from "antd"
import UsersTable from "../../../components/usersTable/UsersTable";
import DownArrowIcon from "../../../assets/icons/DownArrowIcon"
import "./styles.scss"
import RetailerOrdersTable from "../../../components/retailerComponents/retailerOrdersTable/RetailerOrdersTable";
import { useState } from "react";
import { SHIPMENT_STATUS_OPTIONS } from "../../../utils/constants";
import moment from "moment";
import dayjs from "dayjs";
import RetailerCalendarIcon from "../../../assets/icons/RetailerCalendarIcon";

const RetailerOrdersPage = () => {
    const [pageSize, setPageSize] = useState(15)
    const [shipmentStatus, setShipmentStatus] = useState("All")
    const [selectedDate, setSelectedDate] = useState()

    const onSelectedDateChange = (date, dateString) => {
        setSelectedDate(dateString)
    };

    return <>
        <Row gutter={[26, 26]} className="!ml-0 !mr-0 px-[7px] mt-[41px] retailer-orders-page-container template-page mb-[41px]">
            <Col lg={24} md={24} sm={24} xs={24}>
                <div className="container-header retailer-container-header">
                    <div className="left-side__template">
                        <div className="title">Orders</div>
                        <div className="flex gap-[24px] items-center flex-nowrap">
                            <div className="retailer-filter-container">
                                <span className="filter-title">Date</span>
                                <DatePicker 
                                    value={selectedDate ? dayjs(selectedDate, "YYYY-MM-DD") : null} 
                                    onChange={onSelectedDateChange} 
                                    suffixIcon={<RetailerCalendarIcon />}
                                    className="date-picker"
                                    
                                />
                            </div>
                            <div className="retailer-filter-container">
                                <span className="filter-title">Status</span>
                                <Select
                                    className="filter-select"
                                    value={shipmentStatus}
                                    onChange={(e) => {setShipmentStatus(e)}}
                                    options={[
                                        {
                                            value: 'All',
                                            label: 'All',
                                        },
                                        ...SHIPMENT_STATUS_OPTIONS
                                    ]}
                                    popupClassName="retailer-form-select-popup"
                                    suffixIcon={<DownArrowIcon/>}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="right-side__template">
                        <span className="text">
                            Show
                        </span>
                        <div className="retailer-filter-container">
                            <Select
                                className="filter-page-size"
                                value={pageSize}
                                onChange={(e) => {setPageSize(e)}}
                                options={[5, 10, 15, 20, 25, 50].map(el => {return {label: el, value: el}})}
                                popupClassName="retailer-form-select-popup"
                                suffixIcon={<DownArrowIcon/>}
                            />
                        </div>
                        <span className="text">
                            Entries
                        </span>
                    </div>
                </div>
                <div className="mt-[35px]">
                    <RetailerOrdersTable pageSize={pageSize} shipmentStatus={shipmentStatus} selectedDate={selectedDate}/>
                </div>
            </Col>
        </Row>
    </>
}
export default RetailerOrdersPage