import { Input } from "antd"
import "./styles.scss"

const CompanyDetailsTab = () => {
    return <>
        <div className="pt-[70px] company-details-tab-container">
            <div className="text-left text-[#16F6FE] font-inter text-[20px] leading-normal">
                Let’s Get Started
            </div>
            <div className="mt-[8px] text-justify text-[#FFF] opacity-[0.5] font-inter text-[16px] font-[700] leading-normal">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. lorem Ipsum is simply dummy text of the printing and typesetting industry.
            </div>
            <Input 
                className="shared-first-login-input mt-[30px]"
                placeholder="Company Name"
            />
            <Input 
                className="shared-first-login-input mt-[28px]"
                placeholder="Industry"
            />
            <Input 
                className="shared-first-login-input mt-[28px]"
                placeholder="Product Type"
            />
        </div>
    </>
}
export default CompanyDetailsTab