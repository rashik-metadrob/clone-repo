import { getAssetsUrl } from '../../utils/util'
import './styles.scss'
import UploadImagePic from "../../assets/images/products/model.svg"
import { useState } from 'react'
import ModalUploadedMedia from '../drawerObjectDetail/components/modalUploadedMedia/ModalUploadedMedia'

const UploadImageFromUploadedMedia = ({
    extraText = "Add image of your product",
    placeholderFileName = "",
    title = "Add image",
    uploadImage,
    className,
    onSelectMedia = () => {}
}) => {
    const [isShowModalUploaded, setIsShowModalUploaded] = useState(false)

    return <>
        <div className='image-uploader-from-uploaded-media' onClick={() => {setIsShowModalUploaded(true)}}>
            {placeholderFileName && (placeholderFileName.includes('.png') || placeholderFileName.includes('.jpg') || placeholderFileName.includes('.gif')) ? (
                <div className='preview-upload-image'>
                    <img
                        src={getAssetsUrl(placeholderFileName)}
                        alt="avatar"
                    />
                </div>
                
            ) : (
                <div className='upload-button'>
                    {uploadImage ? uploadImage : <img src={UploadImagePic} alt="" />}
                    <div className='text-add-3d-model mt-[12px]'>
                        {title}
                    </div>
                    <div className='text-upload mt-[12px]'>
                        {extraText}
                    </div>
                </div>
            )}
        </div>

        <ModalUploadedMedia 
            open={isShowModalUploaded}
            onClose={() => {setIsShowModalUploaded(false)}}
            filterExts='.png,.jpg,.gif'
            onSelectMedia={(media) => {
                onSelectMedia(media)
                setIsShowModalUploaded(false)
            }}
        />
    </>
}
export default UploadImageFromUploadedMedia