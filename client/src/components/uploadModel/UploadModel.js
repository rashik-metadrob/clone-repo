import { Upload, notification } from 'antd';
import { forwardRef, useImperativeHandle, useState } from 'react';
import "./styles.scss"
import UploadImagePic from "../../assets/images/products/model.svg"

const UploadModel = forwardRef(({
    extraText = "",
    placeholderFileName = "",
    title = "Add 3d Model",
    accept = ".glb,.fbx,.obj",
    className,
    icon,
    //Unit MB
    uploadLimit = 0
},ref) => {
    const [file, setFile] = useState();

    useImperativeHandle(ref, () => ({
        getFile: () => {
            return file
        },
    }), [file]);

    const onPreview = async (file) => {
       
    };

    const beforeUpload = async (file) => {
        const fileSizeMB = file.size / 1024 / 1024

        if(uploadLimit > 0 && fileSizeMB > uploadLimit){
            notification.warning({
                message: `File must smaller than ${uploadLimit}MB!`
            })

            setFile(null)

            return
        }

        setFile(file)
    }

    const onRemove = (file) => {
        setFile(null)
    }

    const uploadButton = (
        <div className='upload-button'>
            <img src={icon ? icon : UploadImagePic} alt="" />
            <div>
                <div className='text-add-3d-model mt-[12px]'>
                    {title}
                </div>
                <div className='text-upload mt-[12px]'>
                    {extraText || "Add 3d model of your product (upload in format .glb, .fbx)"}
                </div>
                {
                    uploadLimit > 0 &&
                    <div className='mt-[4px] text-[10px] text-[var(--dark-blue-text)] font-inter'>
                        Upload Limit is Upto {uploadLimit}mb
                    </div>
                }
            </div>
        </div>
    );

    return (
          <Upload
            name="avatar"
            listType="picture-card"
            className={className ? className : "model-uploader"}
            showUploadList={false}
            onRemove={onRemove}
            onPreview={onPreview}
            beforeUpload={beforeUpload}
            accept={accept}
          >
            {(file || placeholderFileName) ? (
                <div className='preview-upload-image'>
                    <img
                        src={icon ? icon : UploadImagePic}
                        alt="avatar"
                    />
                    <div className='file-name mt-[12px]'>
                        {file?.name || placeholderFileName}
                    </div>
                </div>
                
            ) : (
                uploadButton
            )}
          </Upload>
    );
})

export default UploadModel;