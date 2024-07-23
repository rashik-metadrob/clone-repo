import { Input } from "antd"
import "./styles.scss"
import { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import { useSelector } from "react-redux"
import { getUser } from "../../../redux/appSlice"
import _ from "lodash"

const ShopifyCompanyDetailsTab = forwardRef(({}, ref) => {
    const [formData, setFormData] = useState({
        companyName: "",
        industry: "",
        productType: ""
    })
    const user = useSelector(getUser)

    useImperativeHandle(ref, () => ({
        getFormData: () => {
            return formData
        }
    }));

    useEffect(() => {
        setFormData({
            companyName: _.get(user, ['companyName'], ''),
            industry: _.get(user, ['industry'], ''),
            productType: _.get(user, ['productType'], '')
        })
    }, [user])

    const onFormDataChange = (key, value) => {
        setFormData({
            ...formData,
            [key]: value
        })
    }

    return <>
        <div className="shopify-company-details-tab-container">
            {/* <div className="mt-[8px] text-justify text-[#FFF] opacity-[0.5] font-inter text-[16px] font-[700] leading-normal">
                Sport keeps us fit. Keeps you mindful. Brings us together. Through sport we have the power to change lives. Whether it is through stories of inspiring athletes.
            </div> */}
            <Input 
                className="shared-first-login-input mt-[30px]"
                placeholder="Company Name"
                value={formData.companyName}
                onChange={(e) => {onFormDataChange('companyName', e.target.value)}}
            />
            <Input 
                className="shared-first-login-input mt-[28px]"
                placeholder="Industry"
                value={formData.industry}
                onChange={(e) => {onFormDataChange('industry', e.target.value)}}
            />
            <Input 
                className="shared-first-login-input mt-[28px]"
                placeholder="Product Type"
                value={formData.productType}
                onChange={(e) => {onFormDataChange('productType', e.target.value)}}
            />
        </div>
    </>
})
export default ShopifyCompanyDetailsTab