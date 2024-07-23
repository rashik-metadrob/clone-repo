import { Col, Input, Modal, Row, Select } from "antd"
import "./styles.scss"

import PluginIcon from "../../../../assets/images/project/plugin.svg"
import ExitIcon from "../../../../assets/images/project/exit.svg"
import TriangleIcon from "../../../../assets/images/products/triangle.svg"
import SearchIcon from "../../../../assets/images/project/search.svg"
import ViewAllIcon from "../../../../assets/images/project/view-all.svg"

const ModalPlugin = ({
    open,
    onClose = () => {}
}) => {

    return <>
        <Modal
            open={open}
            closable={false}
            title={null}
            footer={null}
            onCancel={onClose}
            width={1100}
            className="modal-plugin"
            centered
        >
            <div className="modal-plugin-content">
                <div className="modal-title-container">
                    <div className="title-container">
                        <img src={PluginIcon} alt="" />
                        Plug-Ins
                        <div className="select-container ml-[20px]">
                            <Select
                                className="select-type w-full"
                                value={'All'}
                                suffixIcon={<img src={TriangleIcon} alt="" />}
                                options={[
                                    {label: "All", value: "All"},
                                    {label: "Purchased", value: "Purchased"},
                                    {label: "Active", value: "Active"},
                                    {label: "Featured", value: "Featured"}
                                ]}
                            />
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-[40px]">
                        <Input
                            placeholder="Search"
                            suffix={<img src={SearchIcon} alt=""/>}
                            className="input-search"
                        />
                        <div className="close-container flex items-center gap-[5px]" onClick={() => {onClose()}}>
                            <img src={ExitIcon} alt="" />
                            <div className="text-close">Close</div>
                        </div>
                    </div>
                </div>
                <div className="plugin-list-container">
                    <div className="text-title">
                        Vendor’s Choice
                    </div>
                    <Row className="!mt-[13px]" gutter={[40, 40]}>
                        {
                            new Array(2).fill(null).map((el, index) => (
                                <Col span={12} key={`vendor-${index}`}>
                                    <div className="choice-item">
                                        
                                    </div>
                                </Col>
                            ))
                        }
                    </Row>
                    <div className="mt-[24px] flex justify-between items-center">
                        <div className="text-title">
                            Delivery Partner
                        </div>
                        <div className="text-view-all">
                            View all
                            <img src={ViewAllIcon} alt="" />
                        </div>
                    </div>
                    <Row className="!mt-[13px]" gutter={[15, 15]}>
                        {
                            new Array(6).fill(null).map((el, index) => 
                                (<Col span={8} key={`vendor-${index}`}>
                                        <div className="plugin-item">
                                            
                                        </div>
                                    </Col>
                                )
                            )
                        }
                    </Row>
                    <div className="mt-[24px] flex justify-between items-center">
                        <div className="text-title">
                            Delivery Partner
                        </div>
                        <div className="text-view-all">
                            View all
                            <img src={ViewAllIcon} alt="" />
                        </div>
                    </div>
                    <Row className="!mt-[13px]" gutter={[15, 15]}>
                        {
                            new Array(6).fill(null).map((el, index) => 
                                (
                                    <Col span={8} key={`vendor-${index}`}>
                                        <div className="plugin-item">
                                            
                                        </div>
                                    </Col>
                                )
                            )
                        }
                    </Row>
                </div>
            </div>
        </Modal>
    </>
}
export default ModalPlugin