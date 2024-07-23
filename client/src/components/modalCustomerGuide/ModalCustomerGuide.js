import { Modal } from "antd";
import "./styles.scss"
import CustomerGuide from "../customerGuide/CustomerGuide";

const ModalCustomerGuide = ({
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
            className="modal-customer-guide"
            centered
            width={868}
        >
            <div className="modal-customer-guide-content">
                <CustomerGuide 
                    onSkip={() => {onClose()}}
                    showSkip={true}
                />
            </div>
        </Modal>
    </>
}
export default ModalCustomerGuide;