import { Modal } from "antd"
import ExitIcon from "../../../assets/images/project/exit.svg"
import './styles.scss'
import { NOTIFICATION_TYPES } from "../../../utils/constants"
import ModalPricingPlan from "../../modalPricingPlan/ModalPricingPlan"
import { useEffect, useState } from "react"

const ModalRetailerCapacityRemind = ({
    open,
    type,
    onClose = () => {},
    subject = "",
    content = ""
}) => {
    const [isShowModalPricing, setIsShowModalPricing] = useState(false)

    useEffect(() => {
        return () => {
            setIsShowModalPricing(false)
        }
    }, [])

    return <>
        <Modal
            open={open}
            width={`clamp(500px,50vw,768px)`}
            footer={null}
            centered
            closable={false}
            className="modal-retailer-remind"
            onCancel={() => {onClose()}}
        >
            <div className="modal-title-container">
                <div className="close-container flex items-center gap-[5px]" onClick={() => {onClose()}}>
                    <img src={ExitIcon} alt="" />
                    <div className="text-close">Close</div>
                </div>
            </div>
            {subject && <div className="title">
                {subject}
            </div>}
            <div className="content">
                {content}
            </div>
            {type === NOTIFICATION_TYPES.EXCEEDED_STORAGE_LIMIT && <div className="footer-btn-container">
                <button className="btn-cancel" onClick={() => {onClose()}}>Cancel</button>
                <button className="btn-upgrade" onClick={() => {setIsShowModalPricing(true)}}>Upgrade</button>
            </div>}
        </Modal>

        <ModalPricingPlan 
            open={isShowModalPricing}
            onClose={() => {setIsShowModalPricing(false)}}
        />
    </>
}

export default ModalRetailerCapacityRemind