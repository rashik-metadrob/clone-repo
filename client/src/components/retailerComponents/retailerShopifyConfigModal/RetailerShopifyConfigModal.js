import "./styles.scss"
import { Col, Input, Modal, Row, Spin, notification } from "antd";
import ModalExitIcon from "../../../assets/images/project/modal-exit.svg"
import { useDispatch, useSelector } from "react-redux";
import { getUser, setUser } from "../../../redux/appSlice";
import { useEffect, useState } from "react";
import { userApi } from "../../../api/user.api";
import { setStorageRefreshToken, setStorageToken, setStorageUserDetail } from "../../../utils/storage";
import Lottie from "lottie-react";
import loadingAnimation from "../../../assets/json/Add Products.json"
import EyeShowIcon from "../../../assets/images/shopify/eye-show.svg"
import EyeHideIcon from "../../../assets/images/shopify/eye-hide.svg"
import _ from "lodash";
import { Link, useNavigate } from "react-router-dom";

const RetailerShopifyConfigModal = ({
    open,
    onClose = () => {},
    onSuccess = () => {}
}) => {
    const navigate = useNavigate()
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
            onSuccess()
        }).catch(err => {
            notification.error({
                message: "Update failed!"
            })
            setLoading(false)
        })
    }

    return <>
     <Modal
        open={open}
        width={794}
        footer={null}
        closeIcon={<img src={ModalExitIcon} alt="" />}
        destroyOnClose={true}
        closable={true}
        className="retailer-shopify-config-modal"
        onCancel={() => {
          onClose();
        }}
        title="Enter your Headless config"
      >
        <Row gutter={[26, 26]} className="!ml-0 !mr-0 mt-[12px] modal-shopify-manager-container mb-[12px]">
            <Col lg={24} md={24} sm={24} xs={24}>
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
                <div className="mt-[16px]">
                    <Link className="text-install-app" to="https://shopify.dev/docs/custom-storefronts/headless#install-the-headless-channel" target="_blank">
                        Install support app
                    </Link>
                </div>
                <Row gutter={[30, 30]} className="!ml-0 !mr-0 mt-[27px] justify-center pr-[30px]">
                    <button className="btn-save" onClick={() => {onSave()}}>
                        Save
                    </button>
                </Row>
            </Col>
        </Row>
      </Modal>
    </>
}
export default RetailerShopifyConfigModal