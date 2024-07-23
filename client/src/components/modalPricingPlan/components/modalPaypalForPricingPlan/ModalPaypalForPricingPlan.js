import { Modal } from "antd"
import "./styles.scss"
import ExitIcon from "../../../../assets/images/project/exit.svg"
import _ from "lodash"
import PaypalButtonForPricingPlanContainer from "../paypalButtonForPricingPlan/PaypalButtonForPricingPlan"

const ModalPaypalForPricingPlan = ({
    open,
    onClose = () => {},
    purchasePlanInfo,
    isPublishProject =  false
}) => {

    return<>
        <Modal
            open={open}
            width={400}
            footer={null}
            centered
            closable={false}
            destroyOnClose
            className="modal-paypal-for-pricing-plan"
            onCancel={() => {onClose()}}
        >
            <div className="modal-title-container">
                <div className="close-container flex items-center gap-[5px]" onClick={() => {onClose()}}>
                    <img src={ExitIcon} alt="" />
                    <div className="text-close">Close</div>
                </div>
            </div>
            <div className="modal-content">
                <div className="title">
                    Payment for {_.get(purchasePlanInfo, ['plan', 'name'], '')}
                </div>
                <div className="total mt-[8px]">
                    Total: <span className="total-price">${_.get(purchasePlanInfo, ['total'], 0)}</span>
                </div>
                <div className="flex justify-center mt-[25px]">
                    <PaypalButtonForPricingPlanContainer
                        plan={_.get(purchasePlanInfo, ['plan'], null)} 
                        total={_.get(purchasePlanInfo, ['total'], null)}
                        payPer={_.get(purchasePlanInfo, ['payPer'], null)}
                        isPublishProject={isPublishProject}
                    />
                </div>
            </div>
        </Modal>
    </>
}

export default ModalPaypalForPricingPlan