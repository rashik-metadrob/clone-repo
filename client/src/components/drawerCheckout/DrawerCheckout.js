import { Col, Drawer, Dropdown, Row, Spin, notification } from "antd";
import ExitIcon from "../../assets/images/project/preview/exit.svg"
import "./styles.scss"
import { useDispatch, useSelector } from "react-redux";
import { deleteProductInCart, getCart, setCart } from "../../redux/orderSlice";
import _ from "lodash";
import { useEffect, useMemo, useState } from "react";
import { getIntentSecret } from "../../api/stripe.api";
import orderApi from "../../api/order.api";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutRates from "../checkoutRates/CheckoutRates";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutFormStripe from "./components/checkoutFormStripe/CheckoutFormStripe";
import CheckoutCards from "../checkoutCards/CheckoutCards";
import { PAYMENT_GATE } from "../../utils/constants";
import paypalApi from "../../api/paypal.api";
import { useParams } from "react-router-dom";
import ArrowLeftBack from "../../assets/icons/ArrowLeftBack";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY, {locale: "en"});

const DrawerCheckout = ({
    open,
    onClose = () => {},
    container,
    onPlayOpenMenuSound = () => {},
    onPlayCloseMenuSound = () => {}
}) => {
    const dispatch = useDispatch()
    const [step, setStep] = useState(1)
    const {id: projectId} = useParams()
    const [clientSecret, setClientSecret] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const [selectedPaymentGate, setSelectedPaymentGate] = useState(PAYMENT_GATE.STRIPE)
    const allItemsInCart = useSelector(getCart)
    const cart = useMemo(() => {return (allItemsInCart || []).filter(el => el?.storeId === projectId)}, [allItemsInCart, projectId])

    useEffect(() => {
        if(open){
            onPlayOpenMenuSound()
        } else {
            onPlayCloseMenuSound()
        }
    }, [open])

    const [newOrder, setNewOrder] = useState()
    const onGetStripeIntent = (amount, order) => {
        setIsLoading(true)
        getIntentSecret({amount: +amount}).then(rs => {
            orderApi.createOrder({
                ...order,
                paymentGate: PAYMENT_GATE.STRIPE,
                stripeIntentSecret: rs.client_secret
            }).then(data => {
                
            })
            setIsLoading(false)
            setClientSecret(rs.client_secret)
            setStep(3)
        })
    }

    const handleCheckout = (o) => {
        const order = {
            ...o,
            paymentStatus: 0,
            shipmentStatus: 0
        }
        setNewOrder(order)
        setStep(2)
    }

    const handleCreatePayment = (paymentGate) => {
        setSelectedPaymentGate(paymentGate)
        if(paymentGate === PAYMENT_GATE.STRIPE){
            onGetStripeIntent(newOrder.totalAmount, newOrder)
        }
    }

    const onBack = () => {
        if(step === 2){
            setStep(1)
        } else {
            onClose()
        }
    }

    return <>
    <Drawer
        title={null}
        placement="right"
        closable={false}
        onClose={() => {onClose()}}
        open={open}
        getContainer={() => container}
        destroyOnClose={true}
        className="drawer-checkout"
        width={600}
        mask={false}
    >
        <div className="drawer-checkout-content">
            <div className="drawer-checkout-header">
                <div className="flex gap-[12px] items-center">
                    <button className="btn-back" onClick={() => {onBack()}}>
                        <ArrowLeftBack />
                    </button>
                    <div className="title selected">
                        Checkout
                    </div>
                </div>
                <img src={ExitIcon} alt="" className="cursor-pointer" onClick={() => {onClose()}}/>
            </div>
            <div className="content">
                <Row>
                    {step === 1 && <Col lg={24} md={24} sm={24} xs={24}>
                        <Spin spinning={isLoading}>
                            <CheckoutRates onOrder={(o) => {handleCheckout(o)}} isShowHeader={false} isShow={open}/>
                        </Spin>
                    </Col>}
                    {step === 2 && <Col lg={24} md={24} sm={24} xs={24}>
                        <Spin spinning={isLoading}>
                            <CheckoutCards 
                                order={newOrder}
                                onPayment={(gate) => {handleCreatePayment(gate)}}
                            />
                        </Spin>
                    </Col>}
                    {
                        clientSecret && selectedPaymentGate === PAYMENT_GATE.STRIPE && step === 3 && <>
                            <Col lg={24} md={24} sm={24} xs={24} className="h-fit">
                                <Spin spinning={isLoading}>
                                    <div className="mt-[32px]">
                                        {clientSecret && <Elements stripe={stripePromise} options={{
                                            clientSecret: clientSecret,
                                            appearance: {
                                                theme: 'night',
                                            }}
                                        }>
                                            <CheckoutFormStripe 
                                                cart={cart}
                                                setIsLoading={(value) => {setIsLoading(value)}} 
                                                total={newOrder.totalAmount || 0}
                                                cartAmount={newOrder.cartAmount || 0}
                                                deliveryAmount={newOrder.deliveryAmount || 0}
                                            />
                                        </Elements>}
                                    </div>
                                </Spin>
                            </Col>
                        </>
                    }
                </Row>
            </div>
        </div>
    </Drawer>
    </>
}
export default DrawerCheckout;