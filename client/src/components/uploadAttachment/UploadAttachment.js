import { Upload, notification } from 'antd';
import { forwardRef, useImperativeHandle, useState } from 'react';
import AttachmentIcon from "../../assets/images/project/preview/attachment.svg"
import "./styles.scss"
import UploadImagePic from "../../assets/images/products/model.svg"

const UploadAttachment = forwardRef(({},ref) => {
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

        if(fileSizeMB > 2){
            notification.warning({
                message: `File must smaller than 2MB!`
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
           <img src={AttachmentIcon} alt=""/>
           <div className='text-uplaod'>
            Attachment
           </div>
        </div>
    );

    return (
          <Upload
            name="avatar"
            listType="picture-card"
            className="attachment-uploader"
            showUploadList={false}
            onRemove={onRemove}
            onPreview={onPreview}
            beforeUpload={beforeUpload}
          >
            {(file) ? (
                <div className='preview-upload-image'>
                    <img
                        src={UploadImagePic}
                        alt="avatar"
                    />
                    <div className='file-name mt-[12px]'>
                        {file?.name}
                    </div>
                </div>
                
            ) : (
                uploadButton
            )}
          </Upload>
    );
})

export default UploadAttachment;