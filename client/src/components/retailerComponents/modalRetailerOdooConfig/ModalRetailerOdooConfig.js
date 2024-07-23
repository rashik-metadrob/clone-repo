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
import userConfigApi from "../../../api/userConfig.api";
import { USER_CONFIG_KEY } from "../../../utils/constants";
import odooApi from "../../../api/odoo.api";

const ModalRetailerOdooConfig = ({
    open,
    onClose = () => {},
    onSuccess = () => {}
}) => {
    const dispatch = useDispatch()
    const user = useSelector(getUser)
    const [formData, setFormData] = useState({
        password: "",
        dbName: "",
        userName: "",
        serverUrl: ""
    })
    const [loading, setLoading] = useState(false)
    const [passwordInputType, setPasswordInputType] = useState("password")
    const [canConnet, setCanConnect] = useState(false)
    const [isConnecting, setIsConnecting] = useState(false)

    const handleFormDataChange = (type, value) => {
        setCanConnect(false)
        setFormData({
            ...formData,
            [type]: value
        })
    }

    useEffect(() => {
        if(user?.id) {
            userConfigApi.getConfig(USER_CONFIG_KEY.ODOO_CONFIG).then(rs => {
                setFormData(_.pick(_.get(rs, ['value']), ['password', 'dbName', 'userName', 'serverUrl']))
            })
       }
    }, [user?.id])

    const onSave = () => {
        if(!formData.password || !formData.dbName || !formData.serverUrl || !formData.userName){
            notification.warning({
                message: "Data is invalid!"
            })
            return
        }
        setLoading(true)

        userConfigApi.createOrUpdateConfig({
            key: USER_CONFIG_KEY.ODOO_CONFIG,
            value: formData
        }).then(data => {
            setLoading(false)
            notification.success({
                message: "Update successfully!"
            })
            onSuccess()
        }).catch(err => {
            notification.error({
                message: "Update failed!"
            })
            setLoading(false)
        })
    }

    const onTestConnection = () => {
        if(!formData.password || !formData.dbName || !formData.serverUrl || !formData.userName){
            notification.warning({
                message: "Data is invalid!"
            })
            return
        }
        setIsConnecting(true)
        odooApi.testConnection(formData).then(rs => {
            notification.success({
                message:'Connect successfully!'
            }) 
            setCanConnect(true)
            setIsConnecting(false)
        }).catch(err => {
            notification.error({
                message: _.get(err, ['response', 'data', 'message'], `Can't connect to Odoo server!`)
            })
            setIsConnecting(false)
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
        className="retailer-odoo-config-modal"
        onCancel={() => {
          onClose();
        }}
        title="Enter your Odoo config"
      >
        <Row gutter={[26, 26]} className="!ml-0 !mr-0 mt-[12px] modal-odoo-manager-container mb-[12px]">
            <Col lg={24} md={24} sm={24} xs={24}>
                <div className="mt-[22px] odoo-manager-card-container">
                    <Spin spinning={loading} className="loading-indicator-wrapper-center" indicator={<Lottie animationData={loadingAnimation} />}>
                        <Row gutter={[16, 16]}>
                            <Col span={24}>
                                <label className="form-input-label">
                                    Server url
                                </label>
                                <Input 
                                    placeholder="metadrob.odoo.com" 
                                    className="form-input mt-[6px]" 
                                    value={formData.serverUrl}
                                    onChange={(e) => {handleFormDataChange("serverUrl", e.target.value)}}
                                />
                            </Col>
                            <Col span={24}>
                                <label className="form-input-label">
                                    Your Odoo user name
                                </label>
                                <Input 
                                    placeholder="metadrob@gmail.com" 
                                    className="form-input mt-[6px]" 
                                    value={formData.userName}
                                    onChange={(e) => {handleFormDataChange("userName", e.target.value)}}
                                />
                            </Col>
                            <Col span={24}>
                                <label className="form-input-label">
                                    Database name
                                </label>
                                <Input 
                                    placeholder="metadrob" 
                                    className="form-input mt-[6px]" 
                                    value={formData.dbName}
                                    onChange={(e) => {handleFormDataChange("dbName", e.target.value)}}
                                />
                            </Col>
                            <Col span={24} className="relative">
                                <label className="form-input-label">
                                    Password
                                </label>
                                <Input 
                                    type={passwordInputType}
                                    placeholder="********" 
                                    className="form-input mt-[6px]" 
                                    value={formData.password} 
                                    onChange={(e) => {handleFormDataChange("password", e.target.value)}}
                                />
                                {passwordInputType === "password" && <img src={EyeShowIcon} alt=""  className="icon-view-token" onClick={() => {setPasswordInputType("text")}}/>}
                                {passwordInputType === "text" && <img src={EyeHideIcon} alt=""  className="icon-view-token" onClick={() => {setPasswordInputType("password")}}/>}
                            </Col>
                        </Row>
                    </Spin>
                </div>
                <Row gutter={[30, 30]} className="!ml-0 !mr-0 mt-[27px] justify-center pr-[30px] items-center gap-[12px]">
                   <Spin spinning={isConnecting}>
                        <button className="btn-save" onClick={() => {onTestConnection()}}>
                            Test connection
                        </button>
                   </Spin>
                   <Spin spinning={loading}>
                    <button className="btn-save" onClick={() => {onSave()}} disabled={!canConnet}>
                            Save
                        </button>
                   </Spin>
                </Row>
            </Col>
        </Row>
      </Modal>
    </>
}
export default ModalRetailerOdooConfig