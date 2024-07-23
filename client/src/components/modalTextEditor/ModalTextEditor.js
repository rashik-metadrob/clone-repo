import { Modal, notification } from "antd"
import ModalExitIcon from "../../assets/images/project/modal-exit.svg"
import "./styles.scss"
import TextEditorContainer from "../textEditorContainer/TextEditorContainer"
import { uploadTextImageFileBase64 } from "../../api/upload.api"
import textApi from "../../api/text.api"
import _ from "lodash"

const ModalTextEditor = ({
    open,
    item,
    onClose = () => {},
    onSuccess = () => {}
}) => {

    const onSave = async (text) => {
        if(text.image){
            const imageResult = await uploadTextImageFileBase64(text.image)
            if(imageResult.status && imageResult.status !== 200){
                notification.error({
                    message: imageResult.data.message
                })
                return
            }

            const body = {
                ..._.cloneDeep(text),
                image: imageResult.results
            }

            if(!item) {
                textApi.createText(body).then(data => {
                    notification.success({
                        message: "Save successfully!"
                    })
                    onSuccess()
                }).catch(err => {
                    notification.error({
                        message: _.get(err, ['response', 'data', 'message'], `Save fail!`)
                    })
                })
            } else {
                textApi.updateText(item.id, body).then(data => {
                    notification.success({
                        message: "Save successfully!"
                    })
                    onSuccess()
                }).catch(err => {
                    notification.error({
                        message: _.get(err, ['response', 'data', 'message'], `Save fail!`)
                    })
                })
            }
        } else {
            notification.warning({
                message: "Image can't be null!"
            })
        }
    }

    return <>
    <Modal
        open={open}
        width={1200}
        footer={null}
        closeIcon={<img src={ModalExitIcon} alt="" />}
        destroyOnClose={true}
        closable={true}
        centered
        className="modal-text-editor"
        onCancel={() => {onClose()}}
    >
        <TextEditorContainer onSave={onSave} item={item}/>
    </Modal>
    </>
}
export default ModalTextEditor