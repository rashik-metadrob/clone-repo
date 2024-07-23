import { useState } from "react";
import ImageIcon from "../../../../assets/images/project/theme/image.svg"
import "./styles.scss"
import { useAppDispatch } from "../../../../redux";
import { getStoreBrandSetupInfo, setStoreBrandSetupInfo } from "../../../../redux/storeThemeSlice";
import { useSelector } from "react-redux";
import { getAssetsUrl } from "../../../../utils/util";
import ModalUploadedMedia from "../../../drawerObjectDetail/components/modalUploadedMedia/ModalUploadedMedia";

const UploadBrandLogo = () => {
    const dispatch = useAppDispatch()
    const storeBrandSetupInfo = useSelector(getStoreBrandSetupInfo)
    const [isShowModalUploadMedia, setIsShowModalUploadMedia] = useState(false)

    const onSelectMedia = (newBrandLogo) => {
        if(newBrandLogo.filePath) {
            dispatch(setStoreBrandSetupInfo({brandLogo: newBrandLogo.filePath}))
        }
    }

    return <>
        <div className="upload-brand-logo-container" onClick={() => {setIsShowModalUploadMedia(true)}}>
            {
                !storeBrandSetupInfo?.brandLogo && <>
                    <div className="upload-info">
                        <img src={ImageIcon} alt="" className="w-[38px] h-[32px]"/>
                        <div className="text-title mt-[3px]">
                            Upload LOGO
                        </div>
                        <div className="text-sub-title mt-[7px]">
                            This will be brand logo of the store. that will be visible to the customers
                        </div>
                    </div>
                </>
            }
            {
                storeBrandSetupInfo?.brandLogo && <>
                    <div className="upload-info">
                        <img src={getAssetsUrl(storeBrandSetupInfo.brandLogo)} alt="" />
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
            filterExts=".jpg,.png,.jpeg,.gif"
        />
    </>
}
export default UploadBrandLogo