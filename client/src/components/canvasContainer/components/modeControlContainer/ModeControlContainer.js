import { useLocation, useParams } from "react-router-dom"
import useDetectDevice from "../../../../hook/useDetectDevice"
import { isPublishModeLocation } from "../../../../utils/util"
import { useSelector } from "react-redux"
import { getIsPreviewModel, getIsShowAutoSaving, getStoreInfo, setIsPreviewModel, setIsShowNameModal, setStoreInfo } from "../../../../redux/modelSlice"
import AutosavingIcon from "../../../../assets/images/project/auto.svg"
import PreviewIcon from "../../../../assets/images/project/preview.svg"
import { CONFIG_TEXT, PERMISSIONS, PROJECT_MODE, USER_CONFIG_KEY, USER_ROLE } from "../../../../utils/constants"
import ShareIcon from "../../../../assets/images/store/share.png"
import PublishIcon from "../../../../assets/images/project/publish.svg"
import ArchiveIcon from "../../../../assets/images/project/archive.svg"
import usePermissions from "../../../../hook/usePermissions"
import { useAppDispatch } from "../../../../redux"
import { Dropdown, Modal, Spin, notification } from "antd"
import userSubcriptionApi from "../../../../api/userSubcription.api"
import { getStorageUserDetail } from "../../../../utils/storage"
import { userApi } from "../../../../api/user.api"
import projectApi from "../../../../api/project.api"
import userConfigApi from "../../../../api/userConfig.api"
import { useAppBridgeRedirect } from "../../../../modules/shopify/hooks/useAuthenticatedFetch"
import _ from "lodash"
import './styles.scss'
import DropdownIcon from "../../../../assets/images/project/btn-mode-dropdown-icon.svg"
import SyncIcon from "../../../../assets/images/project/sync-icon.svg"
import UpgradeIcon from "../../../../assets/images/project/upgrade-icon.svg"
import { useState } from "react"

const ModeControlContainer = ({
    setIsModalOpen = () => {},
    setIsShowModalPricing = () => {}
}) => {
    const dispatch = useAppDispatch()
    const { isMobile, isPortraitMode, requirePermissionOfStaff } = useDetectDevice()
    const { isStaff } = usePermissions()
    const location = useLocation()
    const isPreviewMode = useSelector(getIsPreviewModel)
    const storeInfo = useSelector(getStoreInfo)
    const { id: projectId, editorRole } = useParams()
    const isShowAutoSaving = useSelector(getIsShowAutoSaving)
    const [isSyncingData, setIsSyncingData] = useState(false)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const appBrigdeRedirect = global.IS_SHOPIFY ? useAppBridgeRedirect() : null

    const handlePreview = () => {
        if(isPublishModeLocation(location)){
            dispatch(setIsShowNameModal(true))
        } else {
            dispatch(setIsPreviewModel(true))
        }
    }

    const onClickProjectMode = () => {
        if(isStaff && requirePermissionOfStaff(PERMISSIONS.SALE_PERSON)){
            notification.warning({
                message: CONFIG_TEXT.YOU_DONT_HAVE_PERMISSION
            })
            return
        }
        if(storeInfo.mode !== PROJECT_MODE.PUBLISH){
            // Check user subcript pricing
            userSubcriptionApi.checkUserSubcriptPricingPlan().then( async rs => {
                if(rs.result){
                    onChangeModeProject()
                } else {
                    if(global.IS_SHOPIFY) {
                        // In shopify call api to check subscription=
                        const response = await fetch("/shopify/request-new-subcription", {
                            method: 'GET',
                            headers: {
                                "Content-Type": "application/json",
                            },
                        })

                        const data = await response.json()
                        const confirmationUrl = _.get(data, ['confirmationUrl'])
                        if(confirmationUrl){
                            appBrigdeRedirect(confirmationUrl)
                        } else {
                            onChangeModeProject()
                        }
                    } else {
                        setIsShowModalPricing(true)
                    }
                }
            })
        } else {
            onChangeModeProject()
        }
    }

    const onChangeModeProject = async () => {
        const currentUser = getStorageUserDetail();
        if(projectId){
            let newMode = PROJECT_MODE.PUBLISH
            if(storeInfo.mode === PROJECT_MODE.PUBLISH){
                let confirm = await confirmModal('Are you sure to unpublish this store?')
                
                if(!confirm){
                    return
                }
                
                newMode = PROJECT_MODE.UNSAVED
            } else if(storeInfo.mode === PROJECT_MODE.ARCHIVE){
                newMode = PROJECT_MODE.PUBLISH
            }
            if(newMode === PROJECT_MODE.PUBLISH && currentUser?.id){
                const rs = await userApi.checkCanPublishStore(currentUser?.id);
                if(!rs.result){
                    notification.warning({message: rs?.message || CONFIG_TEXT.REACH_LIMIT})
                    return
                }
            }
            projectApi.updateProjectMode(projectId, {mode: newMode}).then(rs => {
                dispatch(setStoreInfo(rs))
                if(newMode === PROJECT_MODE.PUBLISH){
                    if(currentUser?.id){
                        const body = {
                            userId: currentUser.id,
                            key: USER_CONFIG_KEY.NUM_OF_PUBLISH_STORE_IN_MONTH
                        }
                        userConfigApi.userPublishStore(body)
                    }
                    setIsModalOpen(true)
                } else {
                    notification.success({
                        message: CONFIG_TEXT.MOVED_TO_DRAFT
                    })
                }
            }).catch(err => {
                notification.error({
                    message: "Pulish fail!"
                })
            })
        }
    }

    const onSyncWithLive = () => {
        if(isShowAutoSaving) {
            notification.warning({
                message: 'Please waiting auto save done before sync live data!'
            })

            return
        }

        setIsSyncingData(true)
        projectApi.syncPublishStoreWithLive(projectId).then(rs => {
            notification.success({
                message: 'All set! ✅ Your store is now up-to-date.'
            })
            setIsSyncingData(false)
        }).catch(err => {
            notification.error({
                message: _.get(err, ['response', 'data', 'message'], `Can't sync data!`)
            })
            setIsSyncingData(false)
        })
    }

    const confirmModal = (title) => {
        return new Promise((resolve, reject) => {
            Modal.confirm({
                title: title,
                centered: true,
                className: "dialog-confirm",
                onOk: () => {
                    resolve(true)
                },
                onCancel: () => {
                    resolve(false)
                }
            })
        })
    }

    return <>
        {(!isPreviewMode && !isPublishModeLocation(location)) && <div className={`mode-control-container ${isMobile ? 'flex-col !gap-[12px] !right-[12px] mobile' : 'flex-row'} ${isPortraitMode ? "portrait" : "landscape"}`}>
            {isShowAutoSaving && <div className='autosaving-text'>
                <img src={AutosavingIcon} alt="" className='autosaving-animation'/>
                Autosaving
            </div>}
            {/* Id btnPreview to handle onboarding, don't delete */}
            <Dropdown.Button 
                menu={{
                    items: []
                }}
                placement="topRight"
                icon={
                    <img src={DropdownIcon} alt="" className="dropdown-icon"/>
                }
                trigger="click"
                className="btn-mode-control"
                overlayClassName="btn-mode-control-overlay"
                dropdownRender={() => (
                    <div className="btn-mode-control-overlay-container">

                    </div>
                )}
                onClick={() => {handlePreview()}}
                id="btnPreview"
            >
                {isMobile && <img src={PreviewIcon} alt=""  className="btn-icon"/>}
                {!isMobile && "Preview"}
            </Dropdown.Button>
            {storeInfo?.mode === PROJECT_MODE.PUBLISH && 
                <button className='btn-preview' onClick={() => {setIsModalOpen(true)}}>
                    <img src={ShareIcon} alt="" className='w-[20px] h-[20px]'/>
                    {!isMobile && "Share"}
                </button>
            }
            {(editorRole === USER_ROLE.RETAILERS && !isStaff) && 
                <Dropdown.Button 
                    menu={{
                        items: []
                    }} 
                    placement="topRight"
                    icon={
                        <img src={DropdownIcon} alt="" className="dropdown-icon"/>
                    }
                    trigger="click"
                    className="btn-mode-control"
                    overlayClassName="btn-mode-control-overlay"
                    dropdownRender={() => (
                        <Spin spinning={isSyncingData}>
                            <div className="btn-mode-control-overlay-container">
                                {storeInfo?.mode === PROJECT_MODE.PUBLISH && <div className="control-item" onClick={() => {onSyncWithLive()}}>
                                    <div className="flex justify-center items-center">
                                        <img src={SyncIcon} alt="" />
                                    </div>
                                    <span>Sync with live</span>
                                </div>}
                                <div className="control-item" onClick={() => {setIsShowModalPricing(true)}}>
                                    <div className="flex justify-center items-center">
                                        <img src={UpgradeIcon} alt="" />
                                    </div>
                                    <span>Upgrade</span>
                                </div>
                            </div>
                        </Spin>
                    )}
                    onClick={() => {onClickProjectMode()}}
                >
                    {isMobile && <img src={storeInfo?.mode === PROJECT_MODE.PUBLISH ? ArchiveIcon : PublishIcon} alt="" className="btn-icon"/>}
                    {!isMobile && (storeInfo?.mode === PROJECT_MODE.UNSAVED ? "Publish" : storeInfo?.mode === PROJECT_MODE.PUBLISH ? "Unpublish" :  "Republish")}
                </Dropdown.Button>
            }
        </div>}
    </>
}
export default ModeControlContainer