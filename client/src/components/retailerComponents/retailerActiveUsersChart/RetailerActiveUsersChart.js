import { Col, Row } from "antd"
import DesignChartImage from "../../../assets/images/analytics/design.svg"

const RetailerActiveUsersChart = () => {
    return <>
     <div className="statistical-card">
        <div className="flex justify-between items-center">
            <div className="text-title">
                Active User
            </div>
        </div>
        <div className="mt-[29px]">
            <Row gutter={[16, 16]}>
                <Col span={24} lg={12}>
                    <div className="flex flex-row lg:flex-col gap-[32px] lg:pl-[32px]">
                        <div className="flex flex-row lg:flex-col lg:justify-start text-left gap-[2px]">
                            <div className="flex items-center gap-[3px]">
                                <div className="w-[7px] h-[7px] rounded-[50%] bg-[#BA46A1]">
                                </div>
                                <div className="text-[12px] leading-[18px] font-inter text-[var(--retailer-filter-input-placeholder-color-background)]">
                                    Inactive
                                </div>
                            </div>
                            <div className="text-[16px] font-inter font-[500] text-[var(--normal-text-color)]">
                                254
                            </div>
                        </div>
                        <div className="flex flex-row lg:flex-col lg:justify-start text-left gap-[2px]">
                            <div className="flex items-center gap-[3px]">
                                <div className="w-[7px] h-[7px] rounded-[50%] bg-[#4DB2AC]">
                                </div>
                                <div className="text-[12px] leading-[18px] font-inter text-[var(--retailer-filter-input-placeholder-color-background)]">
                                    Active
                                </div>
                            </div>
                            <div className="text-[16px] font-inter font-[500] text-[var(--normal-text-color)]">
                                109
                            </div>
                        </div>
                        <div className="flex flex-row lg:flex-col lg:justify-start text-left gap-[2px]">
                            <div className="flex items-center gap-[3px]">
                                <div className="w-[7px] h-[7px] rounded-[50%] bg-[#363F8F]">
                                </div>
                                <div className="text-[12px] leading-[18px] font-inter text-[var(--retailer-filter-input-placeholder-color-background)]">
                                    Total
                                </div>
                            </div>
                            <div className="text-[16px] font-inter font-[500] text-[var(--normal-text-color)]">
                                463
                            </div>
                        </div>
                    </div>
                </Col>
                <Col span={24} lg={12}>
                    <img src={DesignChartImage} alt="" />
                </Col>
            </Row>
        </div>
    </div>
    </>
}
export default RetailerActiveUsersChart