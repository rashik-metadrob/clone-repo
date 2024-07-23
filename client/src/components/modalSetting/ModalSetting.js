import { Modal, Select } from "antd";
import "./styles.scss"

const ModalSetting = ({
    open,
    onClose = () => {}
}) => {

    return <>
        <Modal
            open={open}
            onCancel={() => {onClose()}}
            closable={false}
            title={null}
            footer={null}
            className="modal-setting"
            centered
        >
            <div className="modal-setting-content">
                <div className="setting-item">
                    <div className="title">
                        Texture Quality
                    </div>
                    <div className="select">
                        <Select
                            className="select-setting w-full"
                            defaultValue={"HIGH"}
                            options={[{label: "HIGH", value: "HIGH"}]}
                        />
                    </div>
                </div>
                <div className="setting-item">
                    <div className="title">
                        Targeted FPS
                    </div>
                    <div className="select">
                        <Select
                            className="select-setting w-full"
                            defaultValue={"60 FPS"}
                            options={[{label: "60 FPS", value: "60 FPS"}]}
                        />
                    </div>
                </div>
                <div className="setting-item">
                    <div className="title">
                        Screen Resolution
                    </div>
                    <div className="select">
                        <Select
                            className="select-setting w-full"
                            defaultValue={"1080P"}
                            options={[{label: "1080P", value: "1080P"}]}
                        />
                    </div>
                </div>
            </div>
        </Modal>
    </>
}
export default ModalSetting;