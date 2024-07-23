import { Col, Row } from "antd"
import "./styles.scss"
import RetailerTicketHistoryTable from "../../../components/retailerComponents/retailerTicketHistoryTable/RetailerTicketHistoryTable"
import RetailerQACard from "../../../components/retailerComponents/retailerQACard/RetailerQACard"
import PlusIcon from "../../../assets/icons/PlusIcon"
import ModalRetailerRaiseTicket from "../../../components/retailerComponents/modalRetailerRaiseTicket/ModalRetailerRaiseTicket"
import { useRef, useState } from "react"

const RetailerSupportPage = () => {
    const [isShowModalRaiseTicket, setIsShowModalRaiseTicket] = useState(false)
    const tableRef = useRef()

    return <>
        <div className="retailer-support-page-container template-page">
            <Row className="px-[7px] py-[37px]">
                <Col span={24}>
                    <div className="container-header retailer-container-header">
                        <div className="left-side__template">
                            <div className="title">Ticket History</div>
                        </div>
                        <div className="right-side__template pr-[11px]">
                            <button className="btn-add-new" onClick={() => {setIsShowModalRaiseTicket(true)}}>
                                <PlusIcon />
                                <span>Raise Ticket</span>
                            </button>
                        </div>
                    </div>
                </Col>
                <Col span={24} className="mt-[24px] px-[11px]">
                    <div className="ticket-history-card">
                        <RetailerTicketHistoryTable ref={tableRef}/>
                    </div>
                </Col>
                <Col span={24} className="mt-[56px]">
                    <div className="container-header retailer-container-header">
                        <div className="left-side__template">
                            <div className="title">Q & A</div>
                        </div>
                    </div>
                </Col>
                <Col span={24} className="mt-[24px] px-[11px]">
                    <RetailerQACard />
                </Col>
            </Row>
        </div>
        <ModalRetailerRaiseTicket
            open={isShowModalRaiseTicket}
            onClose={() => {
                tableRef.current.loadData()
                setIsShowModalRaiseTicket(false)
            }}
        />
    </>
}
export default RetailerSupportPage