import { Col, Row, Select } from "antd"
import DownArrowIcon from "../../../assets/icons/DownArrowIcon"
import "./styles.scss"
import RetailerOrdersTable from "../../../components/retailerComponents/retailerOrdersTable/RetailerOrdersTable";
import { useEffect, useState } from "react";
import RetailerInvitationsTable from "../../../components/retailerComponents/retailerInvitationsTable/RetailerInvitationsTable";
import PlusIcon from "../../../assets/icons/PlusIcon";
import ModalRetailerInvite from "../../../components/retailerComponents/modalRetailerInvite/ModalRetailerInvite";
import { useAppDispatch } from "../../../redux";
import { fetchAllRoles } from "../../../redux/roleSlice";

const RetailerInvitePage = () => {
    const dispatch = useAppDispatch()
    const [pageSize, setPageSize] = useState(15)
    const [isShowModalInvite, setIsShowModalInvite] = useState(false)

    useEffect(() => {
        dispatch(fetchAllRoles())
    }, [])

    return <>
        <Row gutter={[26, 26]} className="!ml-0 !mr-0 px-[7px] mt-[41px] retailer-invite-page-container template-page mb-[41px]">
            <Col lg={24} md={24} sm={24} xs={24}>
                <div className="container-header retailer-container-header">
                    <div className="left-side__template">
                        <div className="title">Staff</div>
                    </div>
                    <div className="flex gap-[12px] flex-col">
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
                        <button className="btn-template-action" onClick={() => {setIsShowModalInvite(true)}}>
                            <PlusIcon />
                            <span>Invite</span>
                        </button>
                    </div>
                </div>
                <div className="mt-[35px]">
                    <RetailerInvitationsTable pageSize={pageSize}/>
                </div>
            </Col>
        </Row>
        <ModalRetailerInvite
            open={isShowModalInvite}
            onClose={() => {setIsShowModalInvite(false)}}
        />
    </>
}
export default RetailerInvitePage