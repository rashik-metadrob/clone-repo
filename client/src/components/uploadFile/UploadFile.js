import { Upload } from 'antd';
import { forwardRef, useImperativeHandle, useState } from 'react';
import "./styles.scss"
import UploadImagePic from "../../assets/images/products/model.svg"

const UploadFile = forwardRef(({
    extraText = "",
    placeholderFileName = "",
    title = "Add 3d Model",
    accept = "",
    className
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
        setFile(file)
    }

    const onRemove = (file) => {
        setFile(null)
    }

    const uploadButton = (
        <div className='upload-button'>
            <img src={UploadImagePic} alt="" />
            <div className='text-add-3d-model mt-[12px]'>
                {title}
            </div>
            <div className='text-upload mt-[12px]'>
                {extraText}
            </div>
        </div>
    );

    return (
          <Upload
            name="avatar"
            listType="picture-card"
            className={className ? className :"file-uploader"}
            showUploadList={false}
            onRemove={onRemove}
            onPreview={onPreview}
            beforeUpload={beforeUpload}
            accept={accept}
          >
            {(file || placeholderFileName) ? (
                <div className='preview-upload-image'>
                    <img
                        src={UploadImagePic}
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

export default UploadFile;