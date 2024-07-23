import { Col, Input, Row, Spin, notification } from "antd"
import "./styles.scss"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getUser, setUser } from "../../redux/appSlice"
import _ from "lodash"
import { userApi } from "../../api/user.api"
import { setStorageRefreshToken, setStorageToken, setStorageUserDetail } from "../../utils/storage"
import Lottie from "lottie-react"
import loadingAnimation from "../../assets/json/Add Products.json"
import EyeShowIcon from "../../assets/images/shopify/eye-show.svg"
import EyeHideIcon from "../../assets/images/shopify/eye-hide.svg"

const ShopifyManager = () => {
    const dispatch = useDispatch()
    const user = useSelector(getUser)
    const [formData, setFormData] = useState({
        shopifyAccessToken: "",
        shopifyStoreName: ""
    })
    const [loading, setLoading] = useState(false)
    const [accessTokenInputType, setAccessTokenInputType] = useState("password")

    const handleFormDataChange = (type, value) => {
        setFormData({
            ...formData,
            [type]: value
        })
    }

    useEffect(() => {
        const newFormData = _.pick(user, ['shopifyAccessToken', 'shopifyStoreName'])
        setFormData(newFormData)
    }, [user])

    const onSave = () => {
        if(!formData.shopifyAccessToken || !formData.shopifyStoreName){
            notification.warning({
                message: "Data is invalid!"
            })
            return
        }
        setLoading(true)

        userApi.updateLoggedInUser(formData).then(data => {
            setStorageUserDetail(data.user)
            dispatch(setUser(data.user))
            setStorageToken(data.tokens.access.token)
            setStorageRefreshToken(data.tokens.refresh.token)
            notification.success({
                message: "Update successfully!"
            })
            setLoading(false)
        }).catch(err => {
            notification.error({
                message: "Update failed!"
            })
            setLoading(false)
        })
        
    }
    
    return <>
        <Row gutter={[26, 26]} className="!ml-0 !mr-0 mt-[12px] shopify-manager-container mb-[120px]">
            <Col lg={17} md={24} sm={24} xs={24}>
                <div className="shopify-manager-container-header">
                    <div className="shopify-manager-container-tittle">
                        Shopify manager
                    </div>
                </div>
                <div className="mt-[22px] shopify-manager-card-container">
                    <Spin spinning={loading} className="loading-indicator-wrapper-center" indicator={<Lottie animationData={loadingAnimation} />}>
                        <Row gutter={[16, 16]}>
                            <Col span={24} className="relative">
                                <Input 
                                    type={accessTokenInputType}
                                    placeholder="Access token" 
                                    className="form-input" 
                                    value={formData.shopifyAccessToken} 
                                    onChange={(e) => {handleFormDataChange("shopifyAccessToken", e.target.value)}}
                                />
                                {accessTokenInputType === "password" && <img src={EyeShowIcon} alt=""  className="icon-view-token" onClick={() => {setAccessTokenInputType("text")}}/>}
                                {accessTokenInputType === "text" && <img src={EyeHideIcon} alt=""  className="icon-view-token" onClick={() => {setAccessTokenInputType("password")}}/>}
                            </Col>
                            <Col span={24}>
                                <Input 
                                    placeholder="Store name" 
                                    className="form-input" 
                                    value={formData.shopifyStoreName}
                                    onChange={(e) => {handleFormDataChange("shopifyStoreName", e.target.value)}}
                                />
                            </Col>
                        </Row>
                    </Spin>
                </div>
                <Row gutter={[30, 30]} className="!ml-0 !mr-0 mt-[27px] justify-center pr-[30px]">
                    <button className="btn-save" onClick={() => {onSave()}}>
                        Save
                    </button>
                </Row>
            </Col>
        </Row>
    </>
}
export default ShopifyManager