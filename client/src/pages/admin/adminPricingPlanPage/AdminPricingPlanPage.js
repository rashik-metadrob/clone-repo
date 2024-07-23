import { Col, Dropdown, Modal, Row, notification } from "antd";
import "./styles.scss"
import UploadIcon from "../../../assets/icons/UploadIcon";
import PlusIcon from "../../../assets/icons/PlusIcon";
import { useEffect, useState } from "react";
import WhitePlusIcon from "../../../assets/icons/WhitePlusIcon";
import pricingPlanApi from "../../../api/pricingPlan.api";
import { useNavigate } from "react-router-dom";
import OutlineStar from "../../../assets/icons/OutlineStar";
import ThreeDot from "../../../assets/icons/ThreeDot";
import EditPenIcon from "../../../assets/icons/EditPenIcon";

const AdminPricingPlanPage = () => {
    const navigate = useNavigate()
    const [plans, setPlans] = useState([]);
    const [freePlans, setFreePlans] = useState([]);

    const [openDropdown, setOpenDropdown] = useState(null);

    function loadData() {
        pricingPlanApi.getMetadrobPricingPlans().then((rs) => {
            setPlans([...rs].filter(item => !item.isFree))
            setFreePlans([...rs].filter(item => item.isFree))
        })
    }

    useEffect(() => {
        loadData();
    },[])

    const onDeleteRecord = (record) => {
        Modal.confirm({
          title: "Are you sure to delete this plan?",
          centered: true,
          className: "dialog-confirm",
          onOk: () => {
            pricingPlanApi.deletePricingPlan(record.id).then((rs) => {
              loadData()
              notification.success({
                message: "Deleted successfully!"
              })
            }).catch(() => {
              notification.error({
                message: "Delete fail"
              })
            })
          }
        })
      }

    return <>
        <Row gutter={[26, 89]} className="!ml-0 !mr-0 mt-[30px] admin-pricing-plan-page-container mb-[120px]">
            <Col lg={24} md={24} sm={24} xs={24}>
                <div className="admin-container-header">
                    <div className="left-side__template">
                        <div className="title">Plan</div>
                    </div>
                    <div className="right-side__template">
                        <div className="upload-btn" onClick={() => {navigate("/admin/plan/create/new")}}>
                            <span style={{ marginRight: 22 }}>
                                <WhitePlusIcon />
                            </span>Create New</div>
                        <div className="assign-role-btn">
                            <span style={{ marginRight: 22 }}>
                                <PlusIcon />
                            </span>Assign Role</div>
                    </div>
                </div>
                <div className="mt-[76px] admin-content-container">
                    {
                        plans && plans.map(el => (
                            <div className="pricing-plan-card min-h-[490px]" key={el.id}>
                                <div className="top-div">
                                    <div className="flex justify-between">
                                        <OutlineStar />
                                        <Dropdown
                                            menu={{
                                                items: []
                                            }}
                                            dropdownRender={() => (
                                                <div className="menu-plan-overlay-content">
                                                    <div className="item" onClick={() => {
                                                        setOpenDropdown(null)
                                                        onDeleteRecord(el)
                                                    }}>
                                                        Delete
                                                    </div>
                                                    <div className="item" onClick={(e) => {
                                                        setOpenDropdown(null)
                                                    }}>
                                                        Set on Display
                                                    </div>
                                                </div>
                                            )}
                                            placement="bottomRight"
                                            arrow={false}
                                            trigger="click"
                                            overlayClassName='menu-plan-overlay'
                                            open={openDropdown === el.id}
                                            onOpenChange={(e) => {
                                                if(openDropdown) {
                                                    if(e) {
                                                        setOpenDropdown(el.id)
                                                    }
                                                    else {
                                                        setOpenDropdown(null)
                                                    }
                                                }
                                                else {
                                                    setOpenDropdown(el.id)
                                                }
                                                
                                            }}
                                        >
                                            <div className="cursor-pointer">
                                                <ThreeDot />
                                            </div>
                                        </Dropdown>
                                    </div>
                                    <div className="text-title">
                                        {el.name}
                                    </div>
                                    <div className="text-description mt-[10px]">
                                        {el.description}
                                    </div>
                                    <div className="mt-[18px] group-month-price">
                                        <span className="text-price">
                                            ${el?.pricing?.monthly}
                                        </span>
                                        <span className="text-mo">
                                            /mo
                                        </span>
                                    </div>
                                    <div className="text-year-price">
                                        Yearly ${el?.pricing?.yearly}/mo
                                    </div>
                                    <div className="included-container mt-[15px]">
                                        <div className="text-included">
                                            What's included on Standard
                                        </div>
                                        <ul className="included-list mt-[18px]">
                                            {el?.includedInfomation?.map((item) => (
                                                <li key={item}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <div className="mt-[60px] flex justify-center items-center">
                                    <div className="btn-edit" onClick={() => {navigate(`/admin/plan/edit/${el.id}`)}}>
                                        Edit
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                    {
                        plans && plans.length % 3 !== 0 && [...Array(3 - plans.length % 3).keys()].map((key) => {
                            return <div key={key} style={{ flexBasis: 400 }}></div>
                        })
                    }
                </div>
            </Col>
            {
                freePlans.length > 0 && <Col lg={24} md={24} sm={24} xs={24}>
                    <div className="admin-container-header">
                        <div className="left-side__template">
                            <div className="title">More Plans</div>
                        </div>
                    </div>
                    <div className="mt-[76px] admin-content-container">
                        {
                            freePlans && freePlans.map(el => (
                                <div className="pricing-plan-card min-h-[490px]" key={el.id}>
                                    <div className="top-div">
                                        <div className="flex justify-between">
                                            <OutlineStar />
                                            <Dropdown
                                                menu={{
                                                    items: []
                                                }}
                                                dropdownRender={() => (
                                                    <div className="menu-plan-overlay-content">
                                                        <div className="item">
                                                            Set on Display
                                                        </div>
                                                    </div>
                                                )}
                                                placement="bottomRight"
                                                arrow={false}
                                                trigger="click"
                                                overlayClassName='menu-plan-overlay'
                                            >
                                                <div className="cursor-pointer">
                                                    <ThreeDot />
                                                </div>
                                            </Dropdown>
                                        </div>
                                        <div className="text-title">
                                            {el.name}
                                        </div>
                                        <div className="text-description mt-[10px]">
                                            {el.description}
                                        </div>
                                        <div className="mt-[18px] group-month-price">
                                            <span className="text-price">
                                                ${el?.pricing?.monthly}
                                            </span>
                                            <span className="text-mo">
                                                /mo
                                            </span>
                                        </div>
                                        <div className="text-year-price">
                                            Yearly ${el?.pricing?.yearly}/mo
                                        </div>
                                        <div className="included-container mt-[15px]">
                                            <div className="text-included">
                                                What's included on Standard
                                            </div>
                                            <ul className="included-list mt-[18px]">
                                                {el?.includedInfomation?.map((item) => (
                                                    <li key={item}>{item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="mt-[60px] flex justify-center items-center">
                                        <div className="btn-edit" onClick={() => { navigate(`/admin/plan/edit/${el.id}`) }}>
                                            Edit
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                        {
                            freePlans && freePlans.length % 3 !== 0 && [...Array(3 - freePlans.length % 3).keys()].map((key) => {
                                return <div key={key} style={{ flexBasis: 400 }}></div>
                            })
                        }
                    </div>
                    <div className="admin-container-header w-full mt-[25px] pr-[110px]">
                        <div className="right-side__template w-full justify-end">
                            <div className="upload-btn" style={{ paddingInline: 19 }}>
                                <span style={{ marginRight: 32 }}>
                                    <EditPenIcon />
                                </span>Free tier</div>
                        </div>
                    </div>
                </Col>
            }
        </Row>
    </>
}
export default AdminPricingPlanPage;