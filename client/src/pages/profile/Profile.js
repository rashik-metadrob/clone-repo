import { Checkbox, Col, Input, Radio, Row, Select, Space, Spin, notification } from "antd"
import "./styles.scss"
import { useDispatch, useSelector } from "react-redux"
import { getUser, setUser } from "../../redux/appSlice"
import { useEffect, useRef, useState } from "react"
import _ from "lodash"
import { getAssetsUrl, getBase64 } from "../../utils/util"
import TextArea from "antd/es/input/TextArea"
import { ACCOUNT_VISIBLE_FOR, DEFAULT_AVATAR, PERSONAL_QUESTIONS, PLAYER_GENDER, PROFILE_MODE, UPLOADS_FOLDER, USER_ROLE } from "../../utils/constants"
import SaveIcon from "../../assets/icons/SaveIcon"
import loadingAnimation from "../../assets/json/Add Products.json"
import ArrowIcon from "../../assets/images/products/arrow-down.svg"
import { uploadFile } from "../../api/upload.api"
import { userApi } from "../../api/user.api"
import { setStorageRefreshToken, setStorageToken, setStorageUserDetail } from "../../utils/storage"
import BreadcrumbIcon from "../../assets/images/app/breadcrumb-back-icon.svg"
import { useNavigate } from 'react-router-dom';
import routesConstant from "../../routes/routesConstant"

import LocationIcon from "../../assets/images/profile/location.svg"
import EmailIcon from "../../assets/images/profile/email.svg"
import PhoneIcon from "../../assets/images/profile/phone.svg"
import ArrowDownIcon from "../../assets/images/profile/arrow-down.svg"
import ModalPricingPlan from "../../components/modalPricingPlan/ModalPricingPlan"
import global from "../../redux/global"
import SelectCountry from "../../components/selectCountry/SelectCountry"
import EyeShowIcon from "../../assets/images/shopify/eye-show.svg"
import EyeHideIcon from "../../assets/images/shopify/eye-hide.svg"
import usePermissions from "../../hook/usePermissions"
import Lottie from "lottie-react"

const Profile = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const user = useSelector(getUser)
    const [formData, setFormData] = useState({})
    const [loading, setLoading] = useState(false)
    const [file, setFile] = useState()
    const uploadRef = useRef()
    const [planName, setPlanName] = useState("")
    const [isShowModalPricing, setIsShowModalPricing] = useState(false)
    const [mode, setMode] = useState(PROFILE_MODE.VIEW)
    const [isDefaultPassword, setIsDefaultPassword] = useState()
    const [passwordForm, setPasswordForm] = useState({
        oldPassword: "",
        oldPasswordType: "password",
        newPassword: "",
        newPasswordType: "password",
    })
    const [isSavingPassword, setIsSavingPassword] = useState(false)
    const { staffRoleOptions } = usePermissions()
    const [isSavingAccountVisibleFor, setIsSavingAccountVisibleFor] = useState(false)

    useEffect(() => {
        const newData = _.pick(user, 'avatar', 'socialAvatar', 'name', 'phone', 'email', 'gender', 'address', 'personalInfo')
        setFormData(newData)

        userApi.getActivePricingPlan().then(rs => {
            setPlanName(_.get(rs, ['plan', 'name'], 'Free user') || 'Free user')
        })

        userApi.checkIsUserHasDefaultPassword().then(rs => {
            setIsDefaultPassword(!!rs)
        })
    }, [user?.id])

    const handleFormDataChange = (path, value) => {
        const clone = _.cloneDeep(formData)
        _.set(clone, path, value)
        setFormData(clone)
    }

    const onChangeAvatar = () => {
        uploadRef.current.click()
    }

    const onChangeAvatarFile = async (e) => {
        if(e.target.files.length > 0){
            const previewUrl = await getBase64(e.target.files[0]);
            handleFormDataChange('avatar', previewUrl)

            setFile(e.target.files[0])
        }
    }

    const onSave = async () => {
        if(mode === PROFILE_MODE.VIEW){
            setMode(PROFILE_MODE.EDIT)
            return
        }
        if(!formData.name){
            notification.warning({
                message: "Full name can't be null!"
            })
            return
        }
        // if(!formData.phone){
        //     notification.warning({
        //         message: "Phone can't be null!"
        //     })
        //     return
        // }
        // if(!formData.gender){
        //     notification.warning({
        //         message: "Gender can't be null!"
        //     })
        //     return
        // }

        const bodyData = {
            ...formData,
            isCompleteEnterProfile: true
        }

        setLoading(true)
        if(file){
            const formImageData = new FormData();
            formImageData.append("file", file);
            const modelImageResult = await uploadFile(formImageData, 0, UPLOADS_FOLDER.AVATAR)
            if(modelImageResult.status && modelImageResult.status !== 200){
                notification.error({
                    message: modelImageResult.data.message
                })
                return
            }
            bodyData.avatar = modelImageResult.results
        }

        userApi.updateLoggedInUser(bodyData).then(data => {
            setStorageUserDetail(data.user)
            dispatch(setUser(data.user))
            setStorageToken(data.tokens.access.token)
            setStorageRefreshToken(data.tokens.refresh.token)
            notification.success({
                message: "Update successfully!"
            })
            setLoading(false)
            setMode(PROFILE_MODE.VIEW)
        }).catch(err => {
            notification.error({
                message: _.get(err, ['response', 'data', 'message'], `Update fail!`)
            })
            setLoading(false)
        })
    }

    const onChangePassword = () => {
        if(!passwordForm.newPassword){
            notification.warning({
                message: "New password can't be null!"
            })
            return 
        } else if(!passwordForm.oldPassword && !isDefaultPassword){
            notification.warning({
                message: "Old password can't be null!"
            })
            return 
        }

        setIsSavingPassword(true)
        userApi.updateLoggedInUserPassword(_.pick(passwordForm, ['newPassword', 'oldPassword'])).then(rs => {
            notification.success({
                message: isDefaultPassword ? "Create password successfully!" : "Change password successfully!"
            })
            setIsSavingPassword(false)
        }).catch(err => {
            setIsSavingPassword(false)
            notification.error({
                message: _.get(err, ['response', 'data', 'message'], `Can't change password!`)
            })
        })
    }

    const onAccountVisibleForChange = (visibleFor) => {
        setIsSavingAccountVisibleFor(true)
        userApi.updateLoggedInUser({staffAccountFor: visibleFor}).then(data => {
            setStorageUserDetail(data.user)
            dispatch(setUser(data.user))
            setStorageToken(data.tokens.access.token)
            setStorageRefreshToken(data.tokens.refresh.token)
            notification.success({
                message: "Update successfully!"
            })
            setIsSavingAccountVisibleFor(false)
            setMode(PROFILE_MODE.VIEW)
        }).catch(err => {
            notification.error({
                message: _.get(err, ['response', 'data', 'message'], `Update fail!`)
            })
            setIsSavingAccountVisibleFor(false)
        })
    }

    return <>
        <Row gutter={[52, 26]} className="!ml-0 !mr-0 px-[19px] mt-[23.7px] profile-page mb-[41px]">
            <Col span={24}>
                <div className="flex flex-wrap justify-between items-center gap-[32px]">
                    <div className="breadcrumb" onClick={() => {navigate(routesConstant.dashboardHome.path)}}>
                        <img src={BreadcrumbIcon} alt="" />
                        <span className="breadcrumb-text">
                            Home/ <span className="text-[var(--normal-text-color)]">Edit profile</span>
                        </span>
                    </div>
                    <Spin spinning={loading}>
                        <button className="btn-update" onClick={() => {onSave()}}>
                            {mode === PROFILE_MODE.VIEW ? 'Edit' : 'Update'}
                        </button>
                    </Spin>
                </div>
            </Col>
            <Col span={24} lg={6} md={12} className="profile-col !px-[0]">
                <div className="!px-[26px]">
                    <div className="profile-info-card">
                        <div className="profile-top-content">
                            <div className="flex justify-center avatar-container">
                                <img 
                                    src={formData?.avatar ? getAssetsUrl(formData.avatar) : formData?.socialAvatar ? formData.socialAvatar : getAssetsUrl(DEFAULT_AVATAR)} 
                                    alt="" 
                                    className="w-[150px] h-[150px] rounded-[50%]"
                                />
                                <div className="text-change w-[150px] h-[150px] rounded-[50%]" onClick={() => {onChangeAvatar()}}>
                                    Change
                                </div>
                                <input type="file" accept="image/*" ref={uploadRef} hidden onChange={(e) => {onChangeAvatarFile(e)}}/>
                            </div>
                            {mode === PROFILE_MODE.VIEW && <div className="profile-name mt-[24px]">
                                {formData.name}
                            </div>}
                            {mode === PROFILE_MODE.EDIT && 
                            <input className="content-input mt-[24px] w-[100%]" value={formData?.name} onChange={(e) => {handleFormDataChange(['name'], e.target.value)}}/>}
                            <div className="flex items-center gap-[12px] mt-[12px]">
                                <div className="plane-name">
                                    {planName}
                                </div>
                                <div className="text-upgrade" onClick={() => {setIsShowModalPricing(true)}}>
                                    Upgrade Plan
                                </div>
                            </div>
                        </div>
                        <div className="profile-bottom-content">
                            <div className="content-item">
                                <div className="content-icon">
                                    <img src={LocationIcon} alt="" />
                                </div>
                                {mode === PROFILE_MODE.VIEW && <div className="content-text">
                                    {formData?.address}
                                </div>}
                                {mode === PROFILE_MODE.EDIT && <input className="content-input w-[150px]" value={formData?.address} onChange={(e) => {handleFormDataChange(['address'], e.target.value)}}/>}
                            </div>
                            <div className="content-item mt-[18px]">
                                <div className="content-icon">
                                    <img src={EmailIcon} alt="" />
                                </div>
                                <input className="content-input w-[150px]" value={formData?.email} disabled/>
                            </div>
                            <div className="content-item mt-[18px]">
                                <div className="content-icon">
                                    <img src={PhoneIcon} alt="" />
                                </div>
                                {mode === PROFILE_MODE.VIEW && <div className="content-text">
                                    {formData?.phone}
                                </div>}
                                {mode === PROFILE_MODE.EDIT && <input className="content-input w-[150px]" value={formData?.phone} onChange={(e) => {handleFormDataChange(['phone'], e.target.value)}}/>}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="profile-credentials-wrapper mt-[24px] !px-[26px]">
                    <div className="profile-credentials py-[24px]">
                        <div className="text-credentials">
                            LOGIN Credentials
                        </div>
                        <Input 
                            value={_.get(user, ['email'])} 
                            disabled
                            className="input-credentials mt-[12px]"
                        />
                        {!isDefaultPassword && 
                            <div className="relative mt-[12px]">
                                <Input 
                                    placeholder="Old password"
                                    value={passwordForm.oldPassword} 
                                    className="input-credentials"
                                    onChange={(e) => {
                                            setPasswordForm({
                                            ...passwordForm,
                                            oldPassword: e.target.value
                                        })
                                    }}
                                    type={passwordForm.oldPasswordType}
                                />
                                {passwordForm.oldPasswordType === "password" && 
                                    <img 
                                        src={EyeShowIcon} alt=""  
                                        className="icon-view-password" 
                                        onClick={() => {
                                                setPasswordForm({
                                                ...passwordForm,
                                                oldPasswordType: "text"
                                            })
                                        }}
                                    />
                                }
                                {passwordForm.oldPasswordType === "text" && 
                                    <img 
                                        src={EyeHideIcon} alt=""  
                                        className="icon-view-password" 
                                        onClick={() => {
                                                setPasswordForm({
                                                ...passwordForm,
                                                oldPasswordType: "password"
                                            })
                                        }}
                                    />
                                }
                            </div>
                        }
                        <div className="relative mt-[12px]">
                            <Input 
                                placeholder={isDefaultPassword ? "Create password" : "New password"}
                                value={passwordForm.newPassword} 
                                className="input-credentials"
                                onChange={(e) => {
                                        setPasswordForm({
                                        ...passwordForm,
                                        newPassword: e.target.value
                                    })
                                }}
                                type={passwordForm.newPasswordType}
                            />
                            {passwordForm.newPasswordType === "password" && 
                                <img 
                                    src={EyeShowIcon} alt=""  
                                    className="icon-view-password" 
                                    onClick={() => {
                                            setPasswordForm({
                                            ...passwordForm,
                                            newPasswordType: "text"
                                        })
                                    }}
                                />
                            }
                            {passwordForm.newPasswordType === "text" && 
                                <img 
                                    src={EyeHideIcon} alt=""  
                                    className="icon-view-password" 
                                    onClick={() => {
                                            setPasswordForm({
                                            ...passwordForm,
                                            newPasswordType: "password"
                                        })
                                    }}
                                />
                            }
                        </div>
                        <div className="flex justify-start mt-[12px]">
                            <Spin spinning={isSavingPassword} wrapperClassName="rounded-[8px] overflow-hidden">
                                <button className="btn-create-password" onClick={() => {onChangePassword()}}>
                                    {isDefaultPassword ? "Create Password" : "Change Password"}
                                </button>
                            </Spin>
                        </div>
                    </div>
                </div>
                <div className="account-visible-for-wrapper mt-[24px]">
                    <Spin spinning={isSavingAccountVisibleFor} className="loading-indicator-wrapper-center" indicator={<Lottie animationData={loadingAnimation} />}>
                        <div className="py-[24px] !px-[26px]">
                            <div className="retailer-form-label !text-left mb-[12px]">
                                Switch account:
                            </div>
                            <Select
                                placeholder="Type"
                                value={user?.staffAccountFor}
                                onChange={(value) => {onAccountVisibleForChange(value)}}
                                className="retailer-form-select w-full"
                                popupClassName="retailer-form-select-popup retailer-form-select-popup-item-wrap"
                                suffixIcon={<img src={ArrowIcon} alt="" />}
                                options={staffRoleOptions}
                            />
                        </div>
                    </Spin>
                </div>
            </Col>
            <Col span={24} lg={18} md={12}>
                {
                    mode === PROFILE_MODE.VIEW &&
                    <Row gutter={[26, 26]} className="">
                        {
                            PERSONAL_QUESTIONS.map(el => (
                                <>
                                    <Col span={24} lg={12} key={el.id} className="h-auto">
                                        <div className="question-card h-full">
                                            <div className="title">
                                                {el.title}
                                            </div>
                                            <div className="sub-title mt-[12px]">
                                                {el.subTitle}
                                            </div>
                                            <div className="mt-[16px] preview-answer-text">
                                                {
                                                    el.answer.filter(a => a.value === _.get(formData, ['personalInfo', el.personalInfoKey])).map(ans => (
                                                        <>
                                                            {ans.text}
                                                        </>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    </Col>
                                </>
                            ))
                        }
                    </Row>
                }
                {mode === PROFILE_MODE.EDIT && <Row gutter={[26, 26]} className="">
                    {
                        PERSONAL_QUESTIONS.map(el => (
                            <>
                                <Col span={24} lg={12} key={el.id} className="h-auto">
                                    <div className="question-card h-full">
                                        <div className="title">
                                            {el.title}
                                        </div>
                                        <div className="sub-title mt-[12px]">
                                            {el.subTitle}
                                        </div>
                                        <div className="mt-[16px]">
                                            <Radio.Group 
                                                className="answer-group"
                                                onChange={(e) => {handleFormDataChange(['personalInfo', el.personalInfoKey], e.target.value)}} 
                                                value={_.get(formData, ['personalInfo', el.personalInfoKey])}
                                            >
                                                <div className="radio-container">
                                                    {
                                                        el.answer.map(ans => (
                                                            <>
                                                                <Radio value={ans.value} key={ans.id}>
                                                                    {ans.text}
                                                                </Radio>
                                                            </>
                                                        ))
                                                    }
                                                </div>
                                            </Radio.Group>
                                            {
                                                el.personalInfoKey === "tried" && _.get(formData, ['personalInfo', el.personalInfoKey]) === "Yes"
                                                && <>
                                                    <div className="question-card-input-label mt-[12px]">
                                                        If Yes, please type the name:
                                                    </div>
                                                    <Input 
                                                        className="question-card-input mt-[8px]"  
                                                        value={_.get(formData, ['personalInfo', 'triedPlatform'])}
                                                        onChange={(e) => {handleFormDataChange(['personalInfo', 'triedPlatform'], e.target.value)}} 
                                                    />
                                                </>
                                            }
                                            {
                                                el.personalInfoKey === "salesArea" && _.get(formData, ['personalInfo', el.personalInfoKey]) === "Specific Region"
                                                && <>
                                                    <SelectCountry 
                                                        value={_.get(formData, ['personalInfo', 'area'])}
                                                        onChange={(e) => {handleFormDataChange(['personalInfo', 'area'], e)}} 
                                                    />
                                                </>
                                            }
                                        </div>
                                    </div>
                                </Col>
                            </>
                        ))
                    }
                </Row>}
            </Col>
        </Row>
        <ModalPricingPlan 
            open={isShowModalPricing}
            onClose={() => {setIsShowModalPricing(false)}}
            isPublishProject={true}
            isChangeToOrther={true}
        />
    </>
}
export default Profile