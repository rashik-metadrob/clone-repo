import { Input } from "antd"
import { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import { useSelector } from "react-redux"
import { getUser } from "../../../redux/appSlice"
import EyeShowIcon from "../../../assets/images/shopify/eye-show.svg"
import EyeHideIcon from "../../../assets/images/shopify/eye-hide.svg"
import _ from "lodash"
import { Link } from "react-router-dom"

const ShopifyStoreFrontTab = forwardRef(({}, ref) => {
    const [formData, setFormData] = useState({
        shopifyAccessToken: "",
        shopifyStoreName: ""
    })
    const user = useSelector(getUser)
    const [accessTokenInputType, setAccessTokenInputType] = useState("password")

    useImperativeHandle(ref, () => ({
        getFormData: () => {
            return formData
        }
    }));

    useEffect(() => {
        const newFormData = _.pick(user, ['shopifyAccessToken', 'shopifyStoreName'])
        setFormData(newFormData)
    }, [user])

    const onFormDataChange = (key, value) => {
        setFormData({
            ...formData,
            [key]: value
        })
    }

    return <>
        <div className="shopify-store-front-tab-container text-left">
            <div className="mt-[8px] text-justify text-[#FFF] opacity-[0.5] font-inter text-[16px] font-[700] leading-normal">
            Enter your Headless config
            </div>
            <Input 
                className="shared-first-login-input mt-[30px] max-w-[600px]"
                placeholder="Store name"
                value={formData.shopifyStoreName}
                onChange={(e) => {onFormDataChange('shopifyStoreName', e.target.value)}}
            />
            <div className="relative mt-[28px] max-w-[600px]">
                <Input 
                    className="shared-first-login-input"
                    placeholder="Access token"
                    value={formData.shopifyAccessToken}
                    type={accessTokenInputType}
                    onChange={(e) => {onFormDataChange('shopifyAccessToken', e.target.value)}}
                />
                {accessTokenInputType === "password" && <img src={EyeShowIcon} alt=""  className="absolute top-[50%] right-[20px] w-[25px] cursor-pointer translate-y-[-50%]" onClick={() => {setAccessTokenInputType("text")}}/>}
                {accessTokenInputType === "text" && <img src={EyeHideIcon} alt=""  className="absolute top-[50%] right-[20px] w-[25px] cursor-pointer translate-y-[-50%]" onClick={() => {setAccessTokenInputType("password")}}/>}
            </div>
            <div className="mt-[16px]">
                <Link className="text-[16px] underline cursor-pointer text-[#FFF]" to="https://shopify.dev/docs/custom-storefronts/headless#install-the-headless-channel" target="_blank">
                    Install support app
                </Link>
            </div>
        </div>
    </>
})
export default ShopifyStoreFrontTab