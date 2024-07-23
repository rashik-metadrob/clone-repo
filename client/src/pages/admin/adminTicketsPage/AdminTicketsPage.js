import { Checkbox, Col, Input, Row, Select, Spin } from "antd";
import "./styles.scss"
import UsersTable from "../../../components/usersTable/UsersTable";
import DownArrowIcon from "../../../assets/icons/DownArrowIcon"
import SearchIcon from "../../../assets/images/layout/admin/search.svg"
import SearchSuffixIcon from "../../../assets/images/layout/admin/search-suffix.svg"
import ExitIcon from "../../../assets/images/drob-a/exit.svg"
import { useEffect, useMemo, useRef, useState } from "react";
import PlusIcon from "../../../assets/icons/PlusIcon";
import ExcelIcon from "../../../assets/icons/ExcelIcon";
import AdminSearchInput from "../adminSearchInput/AdminSearchInput";
import AdminTicketsTable from "../../../components/adminComponents/adminTicketsTable/AdminTicketsTable";
import zohoApi from "../../../api/zoho.api";
import _ from "lodash";

const AdminTicketsPage = () => {
    const [isLoading, setIsLoading] = useState(false)
    const ticketsTableRef = useRef()
    const [ticketsStatuses] = useState([
        {
            value: 'All',
            label: 'All',
        },
        {
            value: 'Open',
            label: 'Open',
        },
        {
            value: 'On Hold',
            label: 'On Hold',
        },
        {
            value: 'Escalated',
            label: 'Escalated',
        },
        {
            value: 'Closed',
            label: 'Closed',
        },
    ])
    const [selectedStatus, setSelectedStatus] = useState('All')
    const [ticketsInfo, setTicketsInfo] = useState({})

    const numOfOpenTicket = useMemo(() => {
        return _.get(_.find(_.get(ticketsInfo, ['status'], []), (el) => el.value === 'open'), ['count'], 0)
    }, [ticketsInfo])
    const numOfOnHoldTicket = useMemo(() => {
        return _.get(_.find(_.get(ticketsInfo, ['status'], []), (el) => el.value === 'on hold'), ['count'], 0)
    }, [ticketsInfo])
    const numOfEscalatedTicket = useMemo(() => {
        return _.get(_.find(_.get(ticketsInfo, ['status'], []), (el) => el.value === 'escalated'), ['count'], 0)
    }, [ticketsInfo])
    const numOfClosedTicket = useMemo(() => {
        return _.get(_.find(_.get(ticketsInfo, ['status'], []), (el) => el.value === 'closed'), ['count'], 0)
    }, [ticketsInfo])

    useEffect(() => {
        zohoApi.getTicketCountByField().then((rs) => {
            setTicketsInfo(rs)
            setIsLoading(false)
          }).catch(err => {
            setIsLoading(false)
          })
    }, [])

    return <>
        <Row gutter={[26, 26]} className="!ml-0 !mr-0 mt-[30px] admin-tickets-page-container template-page mb-[120px]">
            <Col span={24}>
                <Row gutter={[26, 26]}>
                    <Col lg={6} md={12} sm={24} xs={24}>
                        <div className="statistical-card flex justify-between items-center">
                            <span></span>
                            <div className="flex flex-col items-end">
                                <div className="text-total">
                                    {numOfOpenTicket}
                                </div>
                                <div className="text-description">
                                    Open ticket
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col lg={6} md={12} sm={24} xs={24}>
                        <div className="statistical-card flex justify-between items-center">
                            <span></span>
                            <div className="flex flex-col items-end">
                                <div className="text-total">
                                    {numOfOnHoldTicket}
                                </div>
                                <div className="text-description">
                                    On hold ticket
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col lg={6} md={12} sm={24} xs={24}>
                        <div className="statistical-card flex justify-between items-center">
                            <span></span>
                            <div className="flex flex-col items-end">
                                <div className="text-total">
                                    {numOfEscalatedTicket}
                                </div>
                                <div className="text-description">
                                    Escalated ticket
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col lg={6} md={12} sm={24} xs={24}>
                        <div className="statistical-card flex justify-between items-center">
                            <span></span>
                            <div className="flex flex-col items-end">
                                <div className="text-total">
                                    {numOfClosedTicket}
                                </div>
                                <div className="text-description">
                                    Closed ticket
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Col>
            <Col lg={24} md={24} sm={24} xs={24}>
                <div className="admin-users-container-header">
                    <div className="left-side__template">
                        <div className="title">Tickets</div>
                        <div className="filter-container">
                            <span className="filter-title">Status</span>
                            <Select
                                className="filter-select"
                                defaultValue="all"
                                options={ticketsStatuses}
                                suffixIcon={<DownArrowIcon/>}
                                value={selectedStatus}
                                onChange={(value) => {setSelectedStatus(value)}}
                            />
                        </div>
                    </div>
                </div>
                <div className="mt-[18px]">
                    <AdminTicketsTable ref={ticketsTableRef} status={selectedStatus} />
                </div>
            </Col>
        </Row>
    </>
}
export default AdminTicketsPage;