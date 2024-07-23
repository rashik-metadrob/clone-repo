import { Col, Row, Slider, Spin, Switch, notification } from "antd"
import "./styles.scss"
import { useEffect, useState } from "react"
import configApi from "../../../api/config.api"
import { CONFIG_TYPE } from "../../../utils/constants"
import { useSelector } from "react-redux"
import { getIsAntialiasDesktop, getIsAntialiasMobile, getIsOverrideMaterialDesktop, getIsOverrideMaterialMobile, getIsShowHDRIDesktop, getIsShowHDRIMobile, getPixelRatioDesktop, getPixelRatioMobile, setIsAntialiasDesktop, setIsAntialiasMobile, setIsOverrideMaterialDesktop, setIsOverrideMaterialMobile, setIsShowHDRIDesktop, setIsShowHDRIMobile, setPixelRatioDesktop, setPixelRatioMobile } from "../../../redux/configSlice"
import { getUser } from "../../../redux/appSlice"
import _ from "lodash"
import { useAppDispatch } from "../../../redux"

const AdminSettingsPage = () => {
    const dispatch = useAppDispatch()
    const isOverrideMaterialDesktop = useSelector(getIsOverrideMaterialDesktop)
    const isOverrideMaterialMobile = useSelector(getIsOverrideMaterialMobile)
    const isAntialiasDesktop = useSelector(getIsAntialiasDesktop)
    const isAntialiasMobile = useSelector(getIsAntialiasMobile)
    const isShowHDRIDesktop = useSelector(getIsShowHDRIDesktop)
    const isShowHDRIMobile = useSelector(getIsShowHDRIMobile)
    const pixelRatioDesktop = useSelector(getPixelRatioDesktop)
    const pixelRatioMobile = useSelector(getPixelRatioMobile)
    const [localPixelRatioDesktop, setLocalPixelRatioDesktop] = useState(100)
    const [localPixelRatioMobile, setLocalPixelRatioMobile] = useState(100)
    const user = useSelector(getUser)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setLocalPixelRatioDesktop(pixelRatioDesktop)
    }, [pixelRatioDesktop])

    useEffect(() => {
        setLocalPixelRatioMobile(pixelRatioMobile)
    }, [pixelRatioMobile])

    const onOverrideMaterialDesktopChange = (e)  => {
        let configData = {
            content: {
                value: e
            },
            createdBy: user.id,
            type: CONFIG_TYPE.OVERRIDE_MATERIAL
        }

        setIsLoading(true)

        configApi.uniqueConfig(configData).then(rs => {
            notification.success({
                message: "Updated successfully!"
            })
            dispatch(setIsOverrideMaterialDesktop(_.get(rs, ['content', 'value'], false)))
            setIsLoading(false)
        }).catch(err => {
            notification.error({
                message: _.get(err, ['response', 'data', 'message'], `Udpated failed!`)
            })
        })
    }

    const onOverrideMaterialMobileChange = (e)  => {
        let configData = {
            content: {
                value: e
            },
            createdBy: user.id,
            type: CONFIG_TYPE.OVERRIDE_MATERIAL_MOBILE
        }

        setIsLoading(true)

        configApi.uniqueConfig(configData).then(rs => {
            notification.success({
                message: "Updated successfully!"
            })
            dispatch(setIsOverrideMaterialMobile(_.get(rs, ['content', 'value'], false)))
            setIsLoading(false)
        }).catch(err => {
            notification.error({
                message: _.get(err, ['response', 'data', 'message'], `Udpated failed!`)
            })
        })
    }

    const onAntialiasDesktopChange = (e) => {
        let configData = {
            content: {
                value: e
            },
            createdBy: user.id,
            type: CONFIG_TYPE.ANTIALIAS_DESKTOP
        }

        setIsLoading(true)

        configApi.uniqueConfig(configData).then(rs => {
            notification.success({
                message: "Updated successfully!"
            })
            dispatch(setIsAntialiasDesktop(_.get(rs, ['content', 'value'], false)))
            setIsLoading(false)
        }).catch(err => {
            notification.error({
                message: _.get(err, ['response', 'data', 'message'], `Udpated failed!`)
            })
        })
    }

    const onAntialiasMobileChange = (e) => {
        let configData = {
            content: {
                value: e
            },
            createdBy: user.id,
            type: CONFIG_TYPE.ANTIALIAS_MOBILE
        }

        setIsLoading(true)

        configApi.uniqueConfig(configData).then(rs => {
            notification.success({
                message: "Updated successfully!"
            })
            dispatch(setIsAntialiasMobile(_.get(rs, ['content', 'value'], false)))
            setIsLoading(false)
        }).catch(err => {
            notification.error({
                message: _.get(err, ['response', 'data', 'message'], `Udpated failed!`)
            })
        })
    }

    const onShowHDRIDesktopChange = (e) => {
        let configData = {
            content: {
                value: e
            },
            createdBy: user.id,
            type: CONFIG_TYPE.SHOW_HDRI_DESKTOP
        }

        setIsLoading(true)

        configApi.uniqueConfig(configData).then(rs => {
            notification.success({
                message: "Updated successfully!"
            })
            dispatch(setIsShowHDRIDesktop(_.get(rs, ['content', 'value'], false)))
            setIsLoading(false)
        }).catch(err => {
            notification.error({
                message: _.get(err, ['response', 'data', 'message'], `Udpated failed!`)
            })
        })
    }

    const onShowHDRIMobileChange = (e) => {
        let configData = {
            content: {
                value: e
            },
            createdBy: user.id,
            type: CONFIG_TYPE.SHOW_HDRI_MOBILE
        }

        setIsLoading(true)

        configApi.uniqueConfig(configData).then(rs => {
            notification.success({
                message: "Updated successfully!"
            })
            dispatch(setIsShowHDRIMobile(_.get(rs, ['content', 'value'], false)))
            setIsLoading(false)
        }).catch(err => {
            notification.error({
                message: _.get(err, ['response', 'data', 'message'], `Udpated failed!`)
            })
        })
    }

    const onPixelRatioDesktopChange = (e) => {
        let configData = {
            content: {
                value: e
            },
            createdBy: user.id,
            type: CONFIG_TYPE.PIXEL_RATIO_DESKTOP
        }

        setIsLoading(true)

        configApi.uniqueConfig(configData).then(rs => {
            notification.success({
                message: "Updated successfully!"
            })
            dispatch(setPixelRatioDesktop(_.get(rs, ['content', 'value'], false)))
            setIsLoading(false)
        }).catch(err => {
            notification.error({
                message: _.get(err, ['response', 'data', 'message'], `Udpated failed!`)
            })
        })
    }

    const onPixelRatioMobileChange = (e) => {
        let configData = {
            content: {
                value: e
            },
            createdBy: user.id,
            type: CONFIG_TYPE.PIXEL_RATIO_MOBILE
        }

        setIsLoading(true)

        configApi.uniqueConfig(configData).then(rs => {
            notification.success({
                message: "Updated successfully!"
            })
            dispatch(setPixelRatioMobile(_.get(rs, ['content', 'value'], false)))
            setIsLoading(false)
        }).catch(err => {
            notification.error({
                message: _.get(err, ['response', 'data', 'message'], `Udpated failed!`)
            })
        })
    }

    return <>
        <Row gutter={[26, 26]} className="!ml-0 !mr-0 mt-[30px] admin-settings-page-container mb-[120px]">
            <Col span={24} md={12} lg={8} xl={8} xxl={8}>
                <Spin spinning={isLoading}>
                    <div className="checkbox-setting-container">
                        <div className="setting-content">
                            Override MeshLambertMaterial Desktop
                        </div>
                        <div className="setting-value">
                            <Switch checked={isOverrideMaterialDesktop} onChange={(e) => {onOverrideMaterialDesktopChange(e)}} className="admin-shared-switch"/>
                        </div>
                    </div>
                </Spin>
            </Col>
            <Col span={24} md={12} lg={8} xl={8} xxl={8}>
                <Spin spinning={isLoading} wrapperClassName="checkbox-setting-wrapper">
                    <div className="checkbox-setting-container h-full">
                        <div className="setting-content">
                            Override MeshLambertMaterial Mobile
                        </div>
                        <div className="setting-value">
                            <Switch checked={isOverrideMaterialMobile} onChange={(e) => {onOverrideMaterialMobileChange(e)}} className="admin-shared-switch"/>
                        </div>
                    </div>
                </Spin>
            </Col>
            <Col span={0} md={0} lg={8} xl={8} xxl={8}></Col>
            <Col span={24} md={12} lg={8} xl={8} xxl={8}>
                <Spin spinning={isLoading}>
                    <div className="checkbox-setting-container">
                        <div className="setting-content">
                            Antialias Desktop
                        </div>
                        <div className="setting-value">
                            <Switch checked={isAntialiasDesktop} onChange={(e) => {onAntialiasDesktopChange(e)}} className="admin-shared-switch"/>
                        </div>
                    </div>
                </Spin>
            </Col>
            <Col span={24} md={12} lg={8} xl={8} xxl={8}>
                <Spin spinning={isLoading} wrapperClassName="checkbox-setting-wrapper">
                    <div className="checkbox-setting-container h-full">
                        <div className="setting-content">
                        Antialias Mobile
                        </div>
                        <div className="setting-value">
                            <Switch checked={isAntialiasMobile} onChange={(e) => {onAntialiasMobileChange(e)}} className="admin-shared-switch"/>
                        </div>
                    </div>
                </Spin>
            </Col>
            <Col span={0} md={0} lg={8} xl={8} xxl={8}></Col>
            <Col span={24} md={12} lg={8} xl={8} xxl={8}>
                <Spin spinning={isLoading}>
                    <div className="checkbox-setting-container">
                        <div className="setting-content">
                            Show HDRI Desktop
                        </div>
                        <div className="setting-value">
                            <Switch disabled checked={isShowHDRIDesktop} onChange={(e) => {onShowHDRIDesktopChange(e)}} className="admin-shared-switch"/>
                        </div>
                    </div>
                </Spin>
            </Col>
            <Col span={24} md={12} lg={8} xl={8} xxl={8}>
                <Spin spinning={isLoading} wrapperClassName="checkbox-setting-wrapper">
                    <div className="checkbox-setting-container h-full">
                        <div className="setting-content">
                        Show HDRI Mobile
                        </div>
                        <div className="setting-value">
                            <Switch disabled checked={isShowHDRIMobile} onChange={(e) => {onShowHDRIMobileChange(e)}} className="admin-shared-switch"/>
                        </div>
                    </div>
                </Spin>
            </Col>
            <Col span={0} md={0} lg={8} xl={8} xxl={8}></Col>
            <Col span={24} md={12} lg={8} xl={8} xxl={8}>
                <Spin spinning={isLoading}>
                    <div className="checkbox-setting-container flex-col !items-start">
                        <div className="setting-content">
                            Pixel Ratio Desktop
                        </div>
                        <div className="setting-value w-full">
                            <Slider 
                                className="shared-admin-slider"
                                min={10}
                                max={100}
                                step={1}
                                value={localPixelRatioDesktop}
                                onChange={(e) => {setLocalPixelRatioDesktop(e)}}
                                onChangeComplete={(e) => {onPixelRatioDesktopChange(e)}}
                            />
                        </div>
                    </div>
                </Spin>
            </Col>
            <Col span={24} md={12} lg={8} xl={8} xxl={8}>
                <Spin spinning={isLoading} wrapperClassName="checkbox-setting-wrapper">
                    <div className="checkbox-setting-container flex-col !items-start">
                        <div className="setting-content">
                            Pixel Ratio Mobile
                        </div>
                        <div className="setting-value w-full">
                            <Slider 
                                className="shared-admin-slider"
                                min={10}
                                max={100}
                                step={1}
                                value={localPixelRatioMobile}
                                onChange={(e) => {setLocalPixelRatioMobile(e)}}
                                onChangeComplete={(e) => {onPixelRatioMobileChange(e)}}
                            />
                        </div>
                    </div>
                </Spin>
            </Col>
            <Col span={0} md={0} lg={8} xl={8} xxl={8}></Col>
        </Row>
    </>
}
export default AdminSettingsPage