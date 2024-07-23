import { Modal, Spin } from "antd";
import "./styles.scss"
import {loadStripe} from '@stripe/stripe-js';
import ModalExitIcon from "../../assets/images/project/modal-exit.svg"
import { useEffect, useState } from "react";
import { getIntentSecret } from "../../api/stripe.api";
import { Elements } from "@stripe/react-stripe-js";
import PaymentHandleElement from "./components/paymentHandleElement/PaymentHandleElement";
import { useParams } from "react-router-dom";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY, {locale: "en"});
const ModalPaymentPricingPlan = ({
    open,
    selectedPricing,
    onClose = () => {},
    total,
    title = "Order",
    payPer,
    isPublishProject,
    isChangeToOrther
}) => {
    const [clientSecret, setClientSecret] = useState()
    const [isLoading, setIsLoading] = useState(false)

    const {id: projectId} = useParams()

    useEffect(() => {
        setClientSecret()
        if(open){
            onGetIntent(total)
        }
    }, [total, open])

    const onGetIntent = (amount) => {
        setIsLoading(true)
        getIntentSecret({amount: +amount}).then(rs => {
            setClientSecret(rs.client_secret)
            setIsLoading(false)
        })
    }

    return <>
        <Modal
            open={open}
            width={600}
            footer={null}
            centered
            closeIcon={<img src={ModalExitIcon} alt="" />}
            closable={true}
            className="modal-payment"
            onCancel={() => {onClose()}}
        >
            <div className="modal-payment-content">
                <div className="modal-payment-header">
                    <div className="title">
                        {title}
                    </div>
                </div>
                <div className="content mt-[32px]">
                    <Spin spinning={isLoading}>
                        <div>
                            {clientSecret && <Elements stripe={stripePromise} options={{
                                clientSecret: clientSecret,
                                appearance: {
                                    theme: 'night',
                                }}
                            }>
                                <PaymentHandleElement 
                                    selectedPricing={selectedPricing}
                                    total={total}
                                    setIsLoading={setIsLoading}
                                    clientSecret={clientSecret}
                                    payPer={payPer}
                                    isPublishProject={isPublishProject}
                                    projectId={projectId}
                                    isChangeToOrther={isChangeToOrther}
                                />
                            </Elements>}
                        </div>
                    </Spin>
                </div>
            </div>
        </Modal>
    </>
}
export default ModalPaymentPricingPlan;