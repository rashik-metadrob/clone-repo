import { DRAWER_THEME_WIDTH, STORE_THEME_CSS_STYLES, STORE_THEME_TYPES, TEXT_DECORATION } from "../../../../utils/constants"
import CustomerPreviewImage from "../../../../assets/images/project/customer-preview.png"
import "./styles.scss"
import useMeasure from "react-use-measure"
import LogoImage from "../../../../assets/images/project/logo.svg"
import { useSelector } from "react-redux"
import { getStoreBrandSetupInfo, setStoreBrandSetupInfo } from "../../../../redux/storeThemeSlice"
import { useEffect, useState } from "react"
import { useAppDispatch } from "../../../../redux"
import { Progress, notification } from "antd"
import _ from "lodash"
import { getAssetsUrl, htmlDecode, isImageFile, isVideoFile } from "../../../../utils/util"
import { updateProjectById } from "../../../../api/project.api"
import { useParams } from "react-router-dom"
import { setStoreInfo } from "../../../../redux/modelSlice"
import { getUser } from "../../../../redux/appSlice"

const PreviewLoadingScreen = () => {
    const {id: projectId} = useParams()
    const dispatch = useAppDispatch()
    const [ref, bounds] = useMeasure()
    const storeBrandSetupInfo = useSelector(getStoreBrandSetupInfo)
    const [isLoading, setIsLoading] = useState(false)
    const user = useSelector(getUser)

    const onStoreThemeTypeChange = (value) => {
        dispatch(
            setStoreBrandSetupInfo({
                storeThemeType: value
            })
        )
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

    const onSave = () => {
        if(user?.id){
            setIsLoading(true)
            updateProjectById(projectId, storeBrandSetupInfo).then(rs => {
                dispatch(setStoreInfo(rs))
                setIsLoading(false)
                notification.success({
                    message: "Update successfully!"
                })
            }).catch(err => {
                setIsLoading(false)
                notification.error({
                    message: "Update fail!"
                })
            })
        } else {
            notification.warning({
                message: "Please login before save!"
            })
        }
    }

    return <>
        <div 
            className="preview-loading-screen-mask" 
            style={{
                left: DRAWER_THEME_WIDTH,
            }}
            ref={ref}
            tabIndex={-1}
        >
            <div
                className="preview-loading-screen-wrapper"
                style={{
                    display: bounds.width < 700 ? 'none' : 'block'
                }}
            >
                <div
                    className="preview-loading-screen-container"
                >
                    <div className="flex justify-between items-center gap-[10px]">
                        <div className="font-inter font-[500] text-[16px] leading-[19px] pl-[4px] text-[#FFFFFF]">
                            Preview- Loading Screen
                        </div>
                        <div className="flex flex-nowrap gap-[9px]">
                            <button className={`btn-type ${storeBrandSetupInfo.storeThemeType === STORE_THEME_TYPES.TYPE_1 ? 'active' : ''}`} onClick={() => {onStoreThemeTypeChange(STORE_THEME_TYPES.TYPE_1)}}>
                                Type 1
                            </button>
                            <button className={`btn-type ${storeBrandSetupInfo.storeThemeType === STORE_THEME_TYPES.TYPE_2 ? 'active' : ''}`} onClick={() => {onStoreThemeTypeChange(STORE_THEME_TYPES.TYPE_2)}}>
                                Type 2
                            </button>
                        </div>
                    </div>
                    <div 
                        className="preview-loading-screen-content"
                        style={{
                            backgroundColor: "#FFFFFF",
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
                                            percent={94} 
                                            showInfo={false} 
                                            className='w-full max-w-[500px] mb-0 flex-auto min-w-[250px]' 
                                            strokeColor='#FFFFFF'
                                            trailColor='rgba(0, 0, 0, 0.60)'
                                        />
                                        <span className="font-inter font-[500] text-[14px] leading-[16.9px] text-[#FFFFFF] whitespace-nowrap">
                                            94 %
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <button className="btn-enter-store">
                                    Enter the store
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <button className="btn-save" onClick={() => {onSave()}}>
                    Save
                </button>
            </div>
        </div>
    </>
}
export default PreviewLoadingScreen