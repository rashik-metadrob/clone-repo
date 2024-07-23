import { useEffect, useMemo, useState } from "react"
import "./styles.scss"
import { useNavigate, useLocation } from "react-router-dom"
import LogoImage from "../../assets/images/project/logo.svg"
import { Col, Input, Progress, Row, Spin, notification } from "antd"
import MailIcon from "../../assets/images/project/mail.svg"
import GuestImage from "../../assets/images/project/guest.png"
import { useParams } from "react-router"

import RemyImage from "../../assets/images/project/avatar/remy.png"
import KateImage from "../../assets/images/project/avatar/kate.png"
import LeonardImage from "../../assets/images/project/avatar/leonard.png"
import LouisImage from "../../assets/images/project/avatar/louis.png"
import { PLAYER_GENDER, PROJECT_MODE, PUBLISH_ROLE, STORE_THEME_CSS_STYLES, TEXT_DECORATION } from "../../utils/constants"
import CustomerGuide from "../customerGuide/CustomerGuide"
import GoogleButton from "../googleButton/GoogleButton"
import { getStorageUserDetail, setStorageRefreshToken, setStorageToken, setStorageUserDetail } from "../../utils/storage"
import { useDispatch, useSelector } from "react-redux"
import { setUser } from "../../redux/appSlice"
import FacebookButton from "../facebookButton/FacebookButton"
import { encodeUrl, getAssetsUrl, htmlDecode, isImageFile, isPublishModeLocation, isVideoFile } from "../../utils/util"
import CustomerPreviewImage from "../../assets/images/project/customer-preview.png"
import Lottie from "lottie-react"
import loadingAnimation from "../../assets/json/Add Products.json"
import { getIsActiveStore, getIsLoadingCheckActiveStore, getStoreInfo } from "../../redux/modelSlice"
import ModalLogin from "../modalLogin/ModalLogin"
import { getStoreBrandSetupInfo } from "../../redux/storeThemeSlice"
import _ from "lodash"
import avatarModelApi from "../../api/avatarModel.api"
import usePublishStoreRole from "../../hook/usePublishStoreRole"

const CustomerPreviewInit = ({
    loadingPercent,
    onPreview = () => {}
}) => {
    const location = useLocation()
    const { publishRole, isLoading: isLoadingRole } = usePublishStoreRole()
    const [part, setPart] = useState(2)
    const currentUser = getStorageUserDetail();
    const storeInfo = useSelector(getStoreInfo)
    
    const [name, setName] = useState("")
    const isActiveStore = useSelector(getIsActiveStore)

    const shouldEnableScene = useMemo(() => {
        if(isPublishModeLocation(location)){
            return isActiveStore && storeInfo?.mode === PROJECT_MODE.PUBLISH
        } else {
            return true
        }
    }, [isActiveStore, location, storeInfo])

    const isLoadingCheckActiveStore = useSelector(getIsLoadingCheckActiveStore)
    const isLoadingData = useMemo(() => {
        return !storeInfo || isLoadingCheckActiveStore
    }, [storeInfo, isLoadingCheckActiveStore])

    const [isShowModalLogin, setIsShowModalLogin] = useState(false)
    const storeBrandSetupInfo = useSelector(getStoreBrandSetupInfo)

    const [listAvatarModels, setListAvatarModels] = useState([])
    const [selectedAvatarModelId, setSelectedAvatarModelId] = useState()

    useEffect(() => {
        const isFromCustomer = new URLSearchParams(window.location.search).get(
            "isFromCustomer"
        );

        if(isFromCustomer && currentUser?.id){
            setPart(2)
        }
    }, [])

    useEffect(() => {
        if(!isLoadingRole) {
            avatarModelApi.getAllAvatarModels({roleFor: publishRole}).then(rs => {
                setListAvatarModels(rs)
            }).catch(err => {
                notification.error({
                    message: _.get(err, ['response', 'data', 'message'], `Can't get list avatars!`)
                })
            })
        }
    }, [publishRole, isLoadingRole])

    const onStart = () => {
        if(!name){
            notification.warning({
                message: "Kindly Add your name!",
                className: "z-[100000]"
            })
            return;
        }
        if(!selectedAvatarModelId || !_.find(listAvatarModels, el => el.id === selectedAvatarModelId)){
            notification.warning({
                message: "Kindly Select your avatar!",
                className: "z-[100000]"
            })
            return;
        }
        onPreview(name, _.find(listAvatarModels, el => el.id === selectedAvatarModelId))
    }

    // const onLoginSuccessWithSocialMedia = (data) => {
    //     setStorageUserDetail(data.user)
    //     dispatch(setUser(data.user))
    //     setStorageToken(data.tokens.access.token)
    //     setStorageRefreshToken(data.tokens.refresh.token)
    
    //     notification.success({
    //         message: "Login success"
    //     })
    
    //     setPart(2)
    // }

    // Handle for login with email
    const handleLoginWithEmail = () => {
        // let baseUrl = window.location.href;
        // if(window.location.href.includes('?')){
        //     baseUrl = `${baseUrl}&isFromCustomer=true`
        // } else {
        //     baseUrl = `${baseUrl}?isFromCustomer=true`
        // }
        // navigate(`/login?returnUrl=${encodeUrl(baseUrl)}`)

        setIsShowModalLogin(true)
    }

    const onLoginSuccessWithEmail = () => {
        setIsShowModalLogin(false)
        setPart(2)
    }

    const getText = (textString) => {
        if(!textString){
            return textString
        }
        if(_.get(storeBrandSetupInfo, ['storeNameStyle', 'textDecoration'], TEXT_DECORATION.NORMAL) === TEXT_DECORATION.LOWERCASE){
            textString = textString.toLowerCase()
        }

        if(_.get(storeBrandSetupInfo, ['storeNameStyle', 'textDecoration'], TEXT_DECORATION.NORMAL) === TEXT_DECORATION.UPPERCASE){
            textString = textString.toUpperCase()
        }

        return textString
    }

    return <>
        <div 
            className="customer-preview-mask xl:p-[clamp(10px,4vh,32px)] p-[12px]" 
            style={{
                backgroundColor: "#FFFFFF",
                backgroundPosition: "center",
                backgroundImage: !storeBrandSetupInfo?.background ? `url(${CustomerPreviewImage})` : isImageFile(storeBrandSetupInfo?.background) ? `url(${getAssetsUrl(storeBrandSetupInfo?.background)})` : 'none',
            }}
        >
            {storeBrandSetupInfo?.background && isVideoFile(storeBrandSetupInfo?.background) && 
                <video 
                    src={getAssetsUrl(storeBrandSetupInfo?.background)} 
                    muted
                    autoPlay
                    loop
                    className="background-image"
                />
            }
            {isLoadingData && <Spin spinning={true} wrapperClassName="w-full" className="loading-indicator-wrapper-center" indicator={<Lottie animationData={loadingAnimation} />}>
            </Spin>}
            {
                !isLoadingData && 
                <>
                    {
                        !shouldEnableScene &&
                        <div className="customer-preview-wrapper">
                            <span className="text-warning">
                                {
                                    !isActiveStore ? "App has been uninstalled. Please contact store owner" : "Contact Seller to Resolve Issue."
                                }
                            </span>
                        </div>
                    }
                    {
                        shouldEnableScene && <>
                        {/* {
                            part === 1 &&
                            <div className="customer-preview-wrapper">
                                <div className="logo">
                                    <img src={LogoImage} alt="" className="h-[5vh] max-h-[40px]"/>
                                </div>
                                <div className="text-signin mt-[4px]">
                                    Sign in or create an account
                                </div>
                                <Row className="card-wrapper w-fit !m-0 !mt-[clamp(5px,5vh,25px)] xl:!mt-[clamp(5px,6vh,49px)]" gutter={[77, 32]} >
                                    <Col lg={12} md={24} sm={24} xs={24} className="card-container-wrapper">
                                        <div className="card-container max-w-[clamp(250px,50vh,350px)] px-[clamp(5px,5vw,25px)] py-[clamp(5px,4vh,24px)] rounded-[10px] xl:rounded-[18px] xl:py-[clamp(5px,4vh,40px)]">
                                            <div className="title-text">
                                                Connect using
                                            </div>
                                            <GoogleButton renderType="PUBLISH_PAGE" onSuccess={(data) => {onLoginSuccessWithSocialMedia(data)}}/>
                                            <FacebookButton renderType="PUBLISH_PAGE" onSuccess={(data) => {onLoginSuccessWithSocialMedia(data)}}/>
                                            <div className="btn-social btn-email mt-[clamp(4px,1vh,16px)] xl:mt-[clamp(4px,3vh,25px)]" onClick={() => {handleLoginWithEmail()}}>
                                                <img src={MailIcon} alt="" />
                                                Continue with Email
                                            </div>
                                            <div className="text-connect mt-[clamp(10px,5vh,36px)] xl:mt-[clamp(10px,5vh,64px)]">
                                                Connect your account to fully enjoy the experience
                                            </div>
                                        </div>
                                    </Col>
                                    <Col lg={12} md={24} sm={24} xs={24} className="card-container-wrapper">
                                        <div className="card-container max-w-[clamp(250px,50vh,350px)] px-[clamp(5px,5vw,25px)] py-[clamp(5px,4vh,24px)] rounded-[10px] xl:rounded-[18px] xl:py-[clamp(5px,4vh,40px)]">
                                            <div className="title-text">
                                                Continue as guest
                                            </div>
                                            <div className="mt-[17px] flex justify-center">
                                                <img src={GuestImage} alt="" className="w-[clamp(80px,20vh,138px)] h-[clamp(80px,20vh,138px)] xl:w-[clamp(80px,20vh,204px)] xl:h-[clamp(80px,20vh,204px]"/>
                                            </div>
                                            <div className="btn-continue mt-[clamp(8px,4vh,23px)]" onClick={() => {setPart(2)}}>
                                                Continue
                                            </div>
                                            <div className="text-connect mt-[clamp(8px,2vh,17px)]">
                                                Your information will be locally stored and your experience limited.
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        } */}
                        {
                            part === 2 &&
                            <>
                                <div className="customer-preview-wrapper-2">
                                    <div 
                                        className="logo w-full flex relative z-[2]"
                                        style={{
                                            justifyContent: STORE_THEME_CSS_STYLES[storeBrandSetupInfo.storeThemeType].logoJustifyContent
                                        }}
                                    >
                                        {storeBrandSetupInfo?.brandLogo && <img src={storeBrandSetupInfo?.brandLogo ? getAssetsUrl(storeBrandSetupInfo.brandLogo) : LogoImage} alt="" className="h-[5vh] max-h-[40px]"/>}
                                    </div>
                                    <div className="relative z-[2]" style={STORE_THEME_CSS_STYLES[storeBrandSetupInfo.storeThemeType].storeContentLayoutCss}>
                                        <div style={{ maxWidth: STORE_THEME_CSS_STYLES[storeBrandSetupInfo.storeThemeType].textMaxWidth}}>
                                            <div 
                                                className="font-inter font-[900] text-[40px] text-[#FFFFFF]"
                                                style={{
                                                    textShadow: _.get(storeBrandSetupInfo, ['storeNameStyle', 'glow'], false) ? "0px 2.6895833015441895px 2.6895833015441895px #00000040" : "none",
                                                    fontSize: _.get(storeBrandSetupInfo, ['storeNameStyle', 'fontSize'], 40),
                                                    lineHeight: "120%",
                                                    color: _.get(storeBrandSetupInfo, ['storeNameStyle', 'color'], '#FFFFFF'),
                                                    background: _.get(storeBrandSetupInfo, ['storeNameStyle', 'background'], '#FFFFFF'),
                                                    textAlign: _.get(storeBrandSetupInfo, ['storeNameStyle', 'textAlign'], 'left').toLowerCase(),
                                                    opacity: _.get(storeBrandSetupInfo, ['storeNameStyle', 'transparency'], 1),
                                                }}
                                            >
                                                {getText(storeBrandSetupInfo.name)}
                                            </div>
                                            {storeBrandSetupInfo.description && <div 
                                                className="font-inter font-[400] text-[14px] leading-[16.9px] text-[#FFFFFF] mt-[8px]"
                                                dangerouslySetInnerHTML={{__html: htmlDecode(storeBrandSetupInfo.description)}}
                                            >
                                                {/* {storeBrandSetupInfo.description} */}
                                            </div>}
                                            <div className="flex gap-[8px] mt-[24px]" style={{justifyContent: STORE_THEME_CSS_STYLES[storeBrandSetupInfo.storeThemeType].progressJustify}}>
                                                <div className="max-w-[550px] w-full flex flex-nowrap items-center">
                                                    <Progress 
                                                        percent={loadingPercent} 
                                                        showInfo={false} 
                                                        className='w-full max-w-[500px] mb-0 flex-auto min-w-[250px]' 
                                                        strokeColor='#FFFFFF'
                                                        trailColor='rgba(0, 0, 0, 0.60)'
                                                    />
                                                    <span className="font-inter font-[500] text-[14px] leading-[16.9px] text-[#FFFFFF] whitespace-nowrap">
                                                        {_.round(loadingPercent)} %
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            {loadingPercent === 100 && <button className="btn-enter-store" onClick={() => {setPart(3)}}>
                                                Enter the store
                                            </button>}
                                        </div>
                                    </div>
                                    {/* <div className="logo">
                                        <img src={LogoImage} alt="" className="h-[5vh] max-h-[40px]"/>
                                    </div>
                                    <div className="content-container">
                                        <Row gutter={[20, 20]} className="!m-0">
                                            <Col xl={12} lg={8} md={24} sm={24} xs={24} className="card-container-wrapper lg:!pr-[80px]">
                                                <div className="loading-text-container">
                                                    <div className="text-showroom">
                                                        {project?.name}
                                                    </div>
                                                    {project?.description && <div className="text-des mt-[3px]">
                                                        {project?.description}
                                                    </div>}
                                                    <Progress 
                                                        percent={loadingPercent} 
                                                        showInfo={false} 
                                                        className='w-full' 
                                                        strokeColor='#FFFFFF'
                                                        trailColor='rgba(0, 0, 0, 0.20)'
                                                    />
                                                </div>
                                            </Col>
                                            <Col xl={12} lg={16} md={24} sm={24} xs={24} className="card-container-wrapper">
                                                <CustomerGuide
                                                    onSkip={() => {setPart(3)}}
                                                    showSkip={loadingPercent === 100 && isAvatarLoaded}
                                                />
                                            </Col>
                                        </Row>
                                    </div> */}
                                </div>
                            </>
                        }
                        {
                            part === 3 &&
                            <>
                                <div className="customer-preview-wrapper-3 gap-[clamp(5px,4vh,24px)] xl:gap-[clamp(5px,4vh,40px)]">
                                    <div className="logo">
                                        <img src={LogoImage} alt="" className="h-[5vh] max-h-[40px]"/>
                                    </div>
                                    <div className="content-container">
                                        <div className="choose-avatar-container max-w-[clamp(250px,100vh,90vw)] p-[clamp(5px,5vh,24px)] xl:p-[clamp(5px,5vh,40px)]">
                                            <div className="text-choose-avatar">
                                                Choose Your Avatar
                                            </div>
                                            <div>
                                                <Input className="input-name h-[40px] xl:h-[clamp(5px,7vh,50px)] mt-[clamp(5px,5vh,16px)] xl:mt-[clamp(5px,5vh,25px)]" value={name} onChange={(e) => {setName(e.target.value)}}/>
                                            </div>
                                            <div className="avatar-container mt-[clamp(5px,3vh,16px)] xl:mt-[clamp(5px,3.5vh,25px)] w-fit">
                                                {
                                                    listAvatarModels &&
                                                    listAvatarModels.map((el) => (
                                                        <>
                                                            <div 
                                                                key={el.id}
                                                                className={`avatar-item w-[clamp(60px,20vh,120px)] h-[clamp(60px,20vh,120px)] ${selectedAvatarModelId === el.id ? 'selected' : ''}`} 
                                                                onClick={() => {setSelectedAvatarModelId(el.id)}}
                                                            >
                                                                <img 
                                                                    src={getAssetsUrl(el?.thumnail)}
                                                                    alt="" 
                                                                />
                                                            </div>
                                                        </>
                                                    ))
                                                }
                                                <div className="w-[clamp(60px,20vh,120px)]"></div>
                                                <div className="w-[clamp(60px,20vh,120px)]"></div>
                                                <div className="w-[clamp(60px,20vh,120px)]"></div>
                                            </div>
                                            <div className="flex mt-[38px] justify-center">
                                                <button className="btn-get-start" disabled={loadingPercent !== 100} onClick={() => {onStart()}}>
                                                    Get Started
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        }
                        </>
                    }
                </>
            }
        </div>

        <ModalLogin 
            open={isShowModalLogin}
            onClose={() => {setIsShowModalLogin(false)}}
            onSuccess={onLoginSuccessWithEmail}
            loginTitle="Login to Store"
            loginSubTitle="This is your login Panel. Enter Your Login Credentials to enter store"
        />
    </>
}

export default CustomerPreviewInit