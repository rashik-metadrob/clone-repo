import { Upload } from 'antd';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { getAssetsUrl, getBase64 } from "../../utils/util"
import "./styles.scss"
import UploadImagePic from "../../assets/images/products/model.svg"
import ImgCrop from "antd-img-crop"

const UploadImage = forwardRef(({
    extraText = "Add image of your product",
    placeholderFileName = "",
    title = "Add image",
    uploadImage,
    className
},ref) => {
    const [imageUrl, setImageUrl] = useState();
    const [file, setFile] = useState();

    useImperativeHandle(ref, () => ({
        getFile: () => {
            return file
        },
    }), [file]);

    const onPreview = async (file) => {
        let src = file.url;
        if (!src) {
          src = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file.originFileObj);
            reader.onload = () => resolve(reader.result);
          });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow?.document.write(image.outerHTML);
    };

    const beforeUpload = async (file) => {
        const previewUrl = await getBase64(file);
        setFile(file)
        setImageUrl(previewUrl);
    }

    const onRemove = (file) => {
        setFile(null)
        setImageUrl(null);
    }

    const uploadButton = (
        <div className='upload-button'>
            {uploadImage ? uploadImage : <img src={UploadImagePic} alt="" />}
            <div className='text-add-3d-model mt-[12px]'>
                {title}
            </div>
            <div className='text-upload mt-[12px]'>
               {extraText}
            </div>
        </div>
    );

    return (
        // <ImgCrop showReset modalClassName="shared-modal-crop-image" aspect={1.77777} quality={1} modalTitle="Crop image">
          <Upload
            name="avatar"
            listType="picture-card"
            className={className ? className : 'image-uploader'}
            showUploadList={false}
            onRemove={onRemove}
            onPreview={onPreview}
            beforeUpload={beforeUpload}
            accept="image/*"
          >
            {imageUrl || (placeholderFileName && (placeholderFileName.includes('.png') || placeholderFileName.includes('.jpg') || placeholderFileName.includes('.gif'))) ? (
                <div className='preview-upload-image'>
                    <img
                        src={imageUrl || getAssetsUrl(placeholderFileName)}
                        alt="avatar"
                    />
                </div>
                
            ) : (
                uploadButton
            )}
          </Upload>
        // </ImgCrop>
    );
})

export default UploadImage;