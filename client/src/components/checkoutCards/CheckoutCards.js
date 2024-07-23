import "./styles.scss"
import XIcon from "../../assets/images/project/x-icon.svg"
import { useEffect, useMemo, useState } from "react"
import MastercardIcon from "../../assets/images/project/mastercard.svg"
import { Input, Radio, Space } from "antd"
import { useSelector } from "react-redux"
import { getCart } from "../../redux/orderSlice"
import { PAYMENT_GATE } from "../../utils/constants"
import StripeIcon from "../../assets/images/project/stripe.svg"
import PaypalIcon from "../../assets/images/project/paypal.svg"
import PaypalButtonContainer from "../drawerCheckout/components/paypalButton/PaypalButton"
import { useParams } from "react-router-dom"

const CheckoutCards = ({
    order,
    onPayment = () => {}
}) => {
    const [selectedCard, setSelectedCard] = useState("4242 4242 4242 4242")
    const [listCards, setListCards] = useState([
        {
            name: "Credit Card",
            cardNumber: "4242 4242 4242 4242",
            icon: MastercardIcon
        },
        {
            name: "Debit Card",
            cardNumber: "4242 4242 4242 4243",
            icon: MastercardIcon
        }
    ])

    const [selectedUPI, setSelectedUPI] = useState();
    const [listUPIs, setListUPIs] = useState([
        {
            name: "7244724595@shashking"
        }
    ])

    const [selectedPaymentGate, setSelectedPaymentGate] = useState(PAYMENT_GATE.STRIPE)
    const [listPaymentGates, setListPaymentGates] = useState([
        {
            id: PAYMENT_GATE.STRIPE,
            icon: StripeIcon
        },
        {
            id: PAYMENT_GATE.PAYPAL,
            icon: PaypalIcon
        }
    ])

    const {id: projectId} = useParams()
    const allItemsInCart = useSelector(getCart)
    const cart = useMemo(() => {return (allItemsInCart || []).filter(el => el?.storeId === projectId)}, [allItemsInCart, projectId])
    const cartAmount = useMemo(() => {return cart.reduce((total, item) => { return total + item.quantity * item.lastPrice}, 0)}, [cart]);

    const onCardChange = (e) => {
        setSelectedCard(e.target.value)
    }

    const onUPIChange = (e) => {
        setSelectedUPI(e.target.value)
    }

    const handlePlaceOrder = () => {
        onPayment(selectedPaymentGate)
    }

    return <>
        <div className="checkout-cards-wrapper">
            <div className="content-container mt-[43px]">
                <div className="title-container">
                    <div className="title">
                        Saved Cards
                    </div>
                    <div className="text-add" onClick={() => {}}>
                        Add
                    </div>
                </div>
                {listCards && listCards.length > 0 && <div className="content-list mt-[11px] py-[8px] md:py-[18px] px-[8px] md:px-[35px]">
                    <Radio.Group onChange={onCardChange} value={selectedCard}>
                        <Space direction="vertical">
                            {
                                listCards && listCards.map(el => (
                                    <Radio value={el.cardNumber} key={el.cardNumber}>
                                        <div className="items-container ps-[12px] sm:ps-[12px] md:ps-[30px]">
                                            <div className="item-text">
                                                {el.name}
                                            </div>
                                            <div className="item-text">
                                                {el.cardNumber}
                                            </div>
                                            <div className="item-icon">
                                                <img src={el.icon} alt="" />
                                            </div>
                                        </div>
                                    </Radio>
                                ))
                            }
                        </Space>
                    </Radio.Group>
                </div>}
            </div>
            <div className="content-container mt-[21px]">
                <div className="title-container">
                    <div className="title">
                        UPI
                    </div>
                    <div className="text-add" onClick={() => {}}>
                        Add
                    </div>
                </div>
                {listUPIs && listUPIs.length > 0 && <div className="content-list mt-[11px] py-[8px] md:py-[18px] px-[8px] md:px-[35px]">
                    <Radio.Group onChange={onCardChange} value={selectedCard}>
                        <Space direction="vertical">
                            {
                                listUPIs && listUPIs.map(el => (
                                    <Radio value={el.name} key={el.name}>
                                        <div className="items-container ps-[12px] sm:ps-[12px] md:ps-[30px]">
                                            <div className="item-text">
                                                {el.name}
                                            </div>
                                        </div>
                                    </Radio>
                                ))
                            }
                        </Space>
                    </Radio.Group>
                </div>}
            </div>
            <div className="content-container mt-[21px]">
                <div className="title-container">
                    <div className="title">
                        Net Banking
                    </div>
                    <div className="text-add" onClick={() => {}}>
                        Add
                    </div>
                </div>
            </div>
            <div className="content-container content-border-bottom mt-[41px]">
                <div className="title-container">
                    <div className="title">
                        Other
                    </div>
                    <div className="text-add" onClick={() => {}}>
                        Add
                    </div>
                </div>
                <div className="select-payment-gate mt-[11px]">
                    {
                        listPaymentGates.map(el => (
                            <div className={`payment-gate-item ${selectedPaymentGate === el.id ? 'selected' : ''}`} key={el.id} onClick={() => {setSelectedPaymentGate(el.id)}}>
                                <img src={el.icon} alt="" />
                            </div>
                        ))
                    }
                </div>
                <div className="mt-[26px] pb-[17px]">
                    <Input
                        className="input-coupon-code"
                        placeholder="Coupon Code"
                        suffix={<span className="text-aplly">Apply</span>}
                    />
                </div>
            </div>
            <div className="order-info-container py-[15px]">
                <div className="item">
                    <div className="title">
                        Order:
                    </div>
                    <div className="value">
                        {cartAmount}$
                    </div>
                </div>
                <div className="item">
                    <div className="title">
                        Delivery:
                    </div>
                    <div className="value">
                        {(order?.deliveryAmount || 0)}$
                    </div>
                </div>
                <div className="item">
                    <div className="title">
                        Summary:
                    </div>
                    <div className="value">
                        {(cartAmount + (order?.deliveryAmount || 0)).toFixed(2)}$
                    </div>
                </div>
            </div>
            <div className="footer-container mt-[21px]">
                {selectedPaymentGate === PAYMENT_GATE.STRIPE && <button className="btn-save text-[14px] sm:text-[16px] md:text-[20px] px-[21px] py-[8px] md:px-[42px] md:py-[13px]" disabled={cart.length === 0} onClick={() => {handlePlaceOrder()}}>
                    Place Order
                </button>}
                {
                    selectedPaymentGate === PAYMENT_GATE.PAYPAL &&
                    <PaypalButtonContainer 
                        amount={(cartAmount + (order?.deliveryAmount || 0)).toFixed(2)}
                        order={order}
                    />
                }
                <div className="text-amount">
                    {(cartAmount + (order?.deliveryAmount || 0)).toFixed(2)}$
                </div>
            </div>
        </div>
    </>
}

export default CheckoutCards;