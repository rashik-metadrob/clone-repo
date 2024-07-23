import { Modal, Spin, notification } from "antd"
import "./styles.scss"
import TextArea from "antd/es/input/TextArea"
import UploadAttachment from "../uploadAttachment/UploadAttachment"
import { useEffect, useRef, useState } from "react"
import { uploadFile } from "../../api/upload.api"
import { useSelector } from "react-redux"
import { getUser } from "../../redux/appSlice"
import { sendFeedback } from "../../api/feedback.api"
import { getAssetsUrl } from "../../utils/util"
import { UPLOADS_FOLDER } from "../../utils/constants"
import TextAreaOrDragTxtFile from "./components/textAreaOrDragTxtFile/TextAreaOrDragTxtFile"
const ModalReportIssue = ({
    open,
    onClose = () => {}
}) => {
    const uploadRef = useRef()
    const [feedbackContent, setFeedbackContent] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const user = useSelector(getUser)

    useEffect(() => {
        if(open){
            setFeedbackContent("")
        }
    }, [open])

    const onSubmitFeedback = async () => {
        const attachmentFile = uploadRef.current.getFile()
        if(!feedbackContent){
            notification.warning({
                message: "Feedback content can't be null!"
            })
            return
        }

        setIsLoading(true)

        let attachments = []
        if(attachmentFile) {
            const formAttachmentData = new FormData();
            formAttachmentData.append("file", attachmentFile);
            const modelResult = await uploadFile(formAttachmentData, 0, UPLOADS_FOLDER.ATTACHMENT)
            if(modelResult.status && modelResult.status !== 200){
                notification.error({
                    message: modelResult.data.message
                })
                setIsLoading(false)
                return
            }
            let attachmentFilePath = modelResult.results
            attachments = [
                {
                    filename: attachmentFile.name,
                    path: getAssetsUrl(attachmentFilePath),
                    relativePath: attachmentFilePath,
                }
            ]
        }

        const data = {
            from: `${user?.name} (${user?.id || user?.email})`, 
            email: user?.email || user?.shopifyShopEmail,
            userName: user?.name || 'Undefined user',
            content: feedbackContent,
            attachments: attachments
        }
        sendFeedback(data).then(rs => {
            notification.success({
                message: "Send success!"
            })
            setIsLoading(false)
            onClose()
        }).catch(err => {
            notification.error({
                message: "Send fail!"
            })
            setIsLoading(false)
        })
    }

    return <>
        <Modal
            open={open}
            onCancel={() => {onClose()}}
            closable={false}
            title={null}
            footer={null}
            className="modal-report-issue"
            centered
            width={800}
            destroyOnClose
        >
            <div className="modal-report-issue-content">
                <div className="title">
                    Facing some issue
                </div>
                <div className="description mt-[12px]">
                    Share your thought with us regarding any technical issue you are facing
                </div>
                <div className="upload-attachment-container mt-[17px]">
                    <UploadAttachment 
                        ref={uploadRef}
                    />
                </div>
                <div className="issue-content mt-[17px]">
                    <TextAreaOrDragTxtFile 
                        value={feedbackContent}
                        onChange={(e) => {setFeedbackContent(e)}}
                    />
                </div>
                <div className="flex justify-center mt-[17px]">
                    <Spin spinning={isLoading} wrapperClassName="rounded-[5px] overflow-hidden">
                        <button className="btn-submit" onClick={() => {onSubmitFeedback()}}>
                            Submit
                        </button>
                    </Spin>
                </div>
            </div>
        </Modal>
    </>
}
export default ModalReportIssue