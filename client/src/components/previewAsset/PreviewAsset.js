import DefaultThumnailImage from "../../assets/images/admin/hdri-default-thumnail.png"
import DefaultViodeoThumnail  from "../../assets/images/project/default-video-thumnail.jpg"
import { getAssetsUrl, isImageFile, isVideoFile } from "../../utils/util"

const PreviewAsset = ({
    fileName,
    className
}) => {

    return <>
        {
            !fileName && <img src={DefaultThumnailImage} alt="" className={`w-full ${className}`}/>
        }
        {
            fileName && isImageFile(fileName) && <img src={getAssetsUrl(fileName)} alt="" className={`w-full ${className}`}/>
        }
        {
            fileName && isVideoFile(fileName) && <img src={DefaultViodeoThumnail} alt="" className={`w-full ${className}`}/>
        }
    </>
}

export default PreviewAsset