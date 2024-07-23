import { useState } from "react";
import ImageIcon from "../../../../assets/images/project/theme/image.svg"
import "./styles.scss"
import { useAppDispatch } from "../../../../redux";
import { useSelector } from "react-redux";
import { getStoreBrandSetupInfo, setStoreBrandSetupInfo } from "../../../../redux/storeThemeSlice";
import PreviewAsset from "../../../previewAsset/PreviewAsset";
import ModalUploadedMedia from "../../../drawerObjectDetail/components/modalUploadedMedia/ModalUploadedMedia";

const UploadBackground = () => {
    const dispatch = useAppDispatch()
    const storeBrandSetupInfo = useSelector(getStoreBrandSetupInfo)
    const [isShowModalUploadMedia, setIsShowModalUploadMedia] = useState(false)
    const onSelectMedia = (newBackground) => {
        if(newBackground.filePath) {
            dispatch(setStoreBrandSetupInfo({background: newBackground.filePath}))
        }
    }

    return <>
        <div className="upload-background-container" onClick={() => {setIsShowModalUploadMedia(true)}}>
            {
                !storeBrandSetupInfo?.background && <>
                    <div className="upload-info">
                        <img src={ImageIcon} alt="" className="w-[38px] h-[32px]"/>
                        <div className="text-title mt-[3px]">
                            Upload BG Image/Video
                        </div>
                        <div className="text-sub-title mt-[7px]">
                            Upload an image or video in the resolution of 1280 X 720. this image/video on the loading screen of the store
                        </div>
                    </div>
                </>
            }
            {
                storeBrandSetupInfo?.background && <>
                    <div className="upload-info">
                        <PreviewAsset fileName={storeBrandSetupInfo.background} />
                    </div>
                </>
            }
        </div>
        <ModalUploadedMedia 
            open={isShowModalUploadMedia}
            onClose={() => {setIsShowModalUploadMedia(false)}}
            onSelectMedia={(data) => {
                onSelectMedia(data)
                setIsShowModalUploadMedia(false)
            }}
            filterExts=".mp4,.jpg,.png,.jpeg,.gif"
        />
    </>
}
export default UploadBackground