import "./styles.scss"
import XIcon from "../../assets/images/project/x-icon.svg"
import { useEffect, useMemo, useState } from "react"
import { Checkbox, Modal, Radio, Space, notification } from "antd";
import { useSelector } from "react-redux";
import { getCart } from "../../redux/orderSlice";
import easyShipApi from "../../api/easyShip.api";
import RateInfomation from "../rateInfomation/RateInfomation";
import { ADDRESS_TYPE, CONFIG_TEXT, DEFAULT_PRODUCT } from "../../utils/constants";
import ModalAddAddress from "../modalAddAddress/ModalAddAddress";
import addressApi from "../../api/address.api";
import TrashIcon from "../../assets/images/products/trash.svg"
import EditIcon from "../../assets/images/products/edit.svg"
import AutosavingIcon from "../../assets/images/project/auto.svg"
import { useParams } from "react-router-dom";

const CheckoutRates = ({
    onOrder = () => {},
    isShowHeader = true,
    isShow
}) => {
    const [isLoading, setIsLoading] = useState(false)
    const [rateError, setRateError] = useState("")
    const [isEditMode, setIsEditMode] = useState(false);
    const [editAddressId, setEditAddressId] = useState("")

    const [addressType, setAddressType] = useState(ADDRESS_TYPE.SHIPPING_ADDRESS)
    const [isShowModalAddAddress, setIsShowModalAddAddress] = useState(false)

    const [originAddress, setOriginAddress] = useState({
        "line_1": "new york",
        "state": "new york",
        "city": "new york",
        "postal_code": "10001",
        "country_alpha2": "US",
        "company_name": "ABCS",
        "contact_name": "ABC",
        "contact_phone": "989458943583",
        "contact_email": "ashdhasdh@gmail.com"
    })
    const [selectedAddress, setSelectedAddress] = useState();
    const [destinationAddresses, setDestinationAddresses] = useState([
        // {
        //     id: 1,
        //     "country_alpha2": "US",
        //     "line_1": "3 Newbridge Court",
        //     "line_2": "Chino Hills, CA 91709, United States",
        //     "state": "California",
        //     "city": "Los Angeles",
        //     "postal_code": "90001",
            
        //     "receiverName": "Jane Doe",
        //     "block": "Home",
        //     "phone": "+1-9844833513"
        // },
        // {
        //     id: 2,
        //     "country_alpha2": "US",
        //     "line_1": "3 Newbridge Court",
        //     "line_2": "Chino Hills, CA 91709, United States",
        //     "state": "California",
        //     "city": "Los Angeles",
        //     "postal_code": "90001",
            
        //     "receiverName": "James",
        //     "block": "Work",
        //     "phone": "+1-9841546346"
        // }
    ])

    const [selectedBillingAddress, setSelectedBillingAddress] = useState();
    const [billingAddresses, setBillingAddresses] = useState([])

    const [rates, setRates] = useState([]);
    const [selectedRate, setSelectedRate] = useState();
    const [isSameAsShipping, setIsSameAsShipping] = useState(true)

    const {id: projectId} = useParams()
    const allItemsInCart = useSelector(getCart)
    const cart = useMemo(() => {return (allItemsInCart || []).filter(el => el?.storeId === projectId)}, [allItemsInCart, projectId])
    const cartAmount = useMemo(() => {return cart.reduce((total, item) => { return total + item.quantity * item.lastPrice}, 0)}, [cart]);

    const [rateSetting, setRateSetting] = useState()

    const deliveryAmount = useMemo(() => {
        if(!selectedRate){
            return 0;
        } else {
            let rate = rates.find(el => el.courier_id === selectedRate);
            if(rate){
                return rate.total_charge || 0;
            } else {
                return 0;
            }
        }
    }, [selectedRate, rates])

    useEffect(() => {
        getAllDestinationAddress();
        getAllBillingAddress();
    }, [])

    const onAddressChange = (e) => {
        setSelectedAddress(e.target.value)
    }

    const onBillingAddressChange = (e) => {
        setSelectedBillingAddress(e.target.value)
    }

    const getAllDestinationAddress = () => {
        addressApi.getAllAddress({type: ADDRESS_TYPE.SHIPPING_ADDRESS}).then(rs => {
            if(rs.length > 0){
                setDestinationAddresses(rs);
                setSelectedAddress(rs[0].id)
            } else {
                setDestinationAddresses([]);
                setSelectedAddress()
            }
        })
    }

    const getAllBillingAddress = () => {
        addressApi.getAllAddress({type: ADDRESS_TYPE.BILLING_ADDRESS}).then(rs => {
            if(rs.length > 0){
                setBillingAddresses(rs);
                setSelectedBillingAddress(rs[0].id)
            } else {
                setBillingAddresses([]);
                setSelectedBillingAddress()
            }
        })
    }

    useEffect(() => {
        if(!isShow){
            return
        }
        if(cart.length === 0){
            return;
        }
        if(selectedAddress && (isSameAsShipping || selectedBillingAddress)){
            let rateItems = cart.map(el => {
                return {
                    "description": el.description || "",
                    "quantity": el.quantity,
                    "dimensions": el.dimensions || DEFAULT_PRODUCT.DIMENSIONS,
                    "sku": "0001",
                    "hs_code": "00000000",
                    "contains_battery_pi966": false,
                    "contains_battery_pi967": false,
                    "contains_liquids": false,
                    "actual_weight": el.actualWeight || DEFAULT_PRODUCT.ACTUALWEIGHT,
                    "declared_currency": "USD",
                    "declared_customs_value": 100
                }
            })
            let selectedDesAdd = destinationAddresses.find(el => el.id === selectedAddress)
            let destinationAddress = {
                "country_alpha2": selectedDesAdd.countryAlpha2,
                "line_1": selectedDesAdd.line1,
                "line_2": selectedDesAdd.line2,
                "state": selectedDesAdd.state,
                "city": selectedDesAdd.city,
                "postal_code": selectedDesAdd.postalCode,
                "company_name": selectedDesAdd.companyName,
                "contact_name": selectedDesAdd.contactName,
                "contact_phone": selectedDesAdd.contactPhone,
                "contact_email": selectedDesAdd.contactEmail,
            }
            let data = {
                "origin_address": originAddress,
                "destination_address": destinationAddress,
                "incoterms": "DDU",
                "insurance": {
                  "is_insured": false
                },
                "courier_selection": {
                  "apply_shipping_rules": true
                },
                "shipping_settings": {
                  "units": {
                    "weight": "kg",
                    "dimensions": "cm"
                  }
                },
                "parcels": [
                  {
                    "items": rateItems
                  }
                ]
            }
            setIsLoading(true)
            setRateSetting(data)
            easyShipApi.getRates(data).then(rs => {
                setRateError("")
                setRates(rs.rates)
                setIsLoading(false)
                if(rs.rates.length > 0){
                    setSelectedRate(rs.rates[0].courier_id)
                } else {
                    setSelectedRate()
                }
            }).catch(err => {
                setIsLoading(false)
                setRateError(err?.response?.data?.message?.details?.length > 0 ? err?.response?.data?.message?.details[0] : CONFIG_TEXT.NO_RATES)
                setRates([])
                setSelectedRate()
            })
        }
    }, [selectedAddress, destinationAddresses, cart, originAddress, isSameAsShipping, selectedBillingAddress, billingAddresses, isShow])

    const handleSaveAndNext = () => {
        if(selectedRate && selectedAddress && originAddress && (isSameAsShipping || selectedBillingAddress)){
            const shippingAddress = destinationAddresses.find(el => el.id === selectedAddress);
            const billingAddress = isSameAsShipping ? shippingAddress : billingAddresses.find(el => el.id === selectedBillingAddress);
            let rate = rates.find(el => el.courier_id === selectedRate);
            onOrder({
                shippingAddress: shippingAddress,
                billingAddress: billingAddress,
                delivery: rate,
                rateSetting: rateSetting,
                items: cart,
                totalAmount: +((cartAmount + deliveryAmount).toFixed(2)),
                cartAmount: cartAmount,
                deliveryAmount: deliveryAmount
            })
        } else {
            if(!selectedRate){
                notification.warning({
                    message: "Delivery Method is required!"
                })
            } else if(!(isSameAsShipping || selectedBillingAddress)){
                notification.warning({
                    message: "Billing address is required!"
                })
            } else if(!selectedAddress){
                notification.warning({
                    message: "Shipping address is required!"
                })
            } else {
                notification.warning({
                    message: "Please check invalid fields!"
                })
            }
        }
    }

    const onReloadListAddress = () => {
        setIsShowModalAddAddress(false)
        if(addressType === ADDRESS_TYPE.SHIPPING_ADDRESS){
            getAllDestinationAddress()
        } else {
            getAllBillingAddress()
        }
    }

    const onDeleteAddress = (e, id, type) => {
        e.preventDefault();
        Modal.confirm({
            title: "Are you sure to delete address",
            centered: true,
            className: "dialog-confirm",
            onOk: () => {
                addressApi.deleteAddress(id).then(() => {
                    notification.success({
                        message: "Deleted successfully!!"
                    })
                    if(type === ADDRESS_TYPE.SHIPPING_ADDRESS){
                        getAllDestinationAddress()
                    } else {
                        getAllBillingAddress()
                    }
                })
            }
          })
    }

    const onEditAddress = (e, el, type) => {
        e.preventDefault();

        setAddressType(type)
        setIsEditMode(true)
        setEditAddressId(el.id);
        setIsShowModalAddAddress(true)
    }

    return <>
        <div className="checkout-rates-wrapper">
            {isShowHeader && <div className="checkout-rates-header">
                <div className="text-checkout">
                    Checkout
                </div>
                <img src={XIcon} alt="" className="cursor-pointer"/>
            </div>}
            <div className="shipping-address-container mt-[43px]">
                <div className="title-container">
                    <div className="title">
                        Shipping address
                    </div>
                    <div className="text-add" onClick={() => {
                        setAddressType(ADDRESS_TYPE.SHIPPING_ADDRESS)
                        setIsEditMode(false)
                        setIsShowModalAddAddress(true)
                    }}>
                        Add
                    </div>
                </div>
                {destinationAddresses && destinationAddresses.length > 0 && <div className="address-list mt-[17px] p-[8px] md:p-[26px]">
                    <Radio.Group onChange={onAddressChange} value={selectedAddress}>
                        <Space direction="vertical">
                            {
                                destinationAddresses && destinationAddresses.map(el => (
                                    <Radio value={el.id} key={el.id}>
                                        <div className="address-container ps-[16px] sm:ps-[16px] md:ps-[47px]">
                                            <div>
                                                <div className="address-name">
                                                    <div className="text">
                                                        {el.alias}
                                                    </div>
                                                    <div className="circle"></div>
                                                    <div className="text">
                                                        {el.contactName}
                                                    </div>
                                                    <div className="circle"></div>
                                                    <div className="text">
                                                        {el.contactPhone}
                                                    </div>
                                                </div>
                                                <div className="address-detail mt-[7px]">
                                                    <div className="line-1">
                                                        {el.line1}
                                                    </div>
                                                    <div className="line-2">
                                                        {el.line2}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-[12px]">
                                                <img src={TrashIcon} alt="" className="cursor-pointer" onClick={(e) => {onDeleteAddress(e, el.id, ADDRESS_TYPE.SHIPPING_ADDRESS)}}/>
                                                <img src={EditIcon} alt="" className="cursor-pointer" onClick={(e) => {onEditAddress(e, el, ADDRESS_TYPE.SHIPPING_ADDRESS)}}/>
                                            </div>
                                        </div>
                                    </Radio>
                                ))
                            }
                        </Space>
                    </Radio.Group>
                </div>}
            </div>
            <div className="shipping-address-container billing-address-container mt-[22px]">
                <div className="title-container">
                    <div className="title">
                        Billing address address
                    </div>
                    <div className="text-add" onClick={() => {
                        setAddressType(ADDRESS_TYPE.BILLING_ADDRESS)
                        setIsShowModalAddAddress(true)
                        setIsEditMode(false)
                    }}>
                        Add
                    </div>
                </div>
                <div className="checkbox-container mt-[22px]">
                    <Checkbox value={isSameAsShipping} onChange={(e) => {setIsSameAsShipping(e.target.checked)}}><span className="text">Same as Shipping address</span></Checkbox>  
                </div>
                {billingAddresses && billingAddresses.length > 0 && <div className="address-list mt-[17px] p-[8px] md:p-[26px]">
                    <Radio.Group onChange={onBillingAddressChange} value={selectedBillingAddress}>
                        <Space direction="vertical">
                            {
                                billingAddresses && billingAddresses.map(el => (
                                    <Radio value={el.id} key={el.id}>
                                        <div className="address-container ps-[16px] sm:ps-[16px] md:ps-[47px]">
                                            <div>
                                                <div className="address-name">
                                                    <div className="text">
                                                        {el.alias}
                                                    </div>
                                                    <div className="circle"></div>
                                                    <div className="text">
                                                        {el.contactName}
                                                    </div>
                                                    <div className="circle"></div>
                                                    <div className="text">
                                                        {el.contactPhone}
                                                    </div>
                                                </div>
                                                <div className="address-detail mt-[7px]">
                                                    <div className="line-1">
                                                        {el.line1}
                                                    </div>
                                                    <div className="line-2">
                                                        {el.line2}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-[12px]">
                                                <img src={TrashIcon} alt="" className="cursor-pointer" onClick={(e) => {onDeleteAddress(e, el.id, ADDRESS_TYPE.BILLING_ADDRESS)}}/>
                                                <img src={EditIcon} alt="" className="cursor-pointer" onClick={(e) => {onEditAddress(e, el, ADDRESS_TYPE.BILLING_ADDRESS)}}/>
                                            </div>
                                        </div>
                                    </Radio>
                                ))
                            }
                        </Space>
                    </Radio.Group>
                </div>}
            </div>
            <div className="shipping-address-container rates-container mt-[36px] pb-[17px]">
                <div className="title-container">
                    <div className="title">
                        Delivery Method
                    </div>
                </div>
                <div className="rates-list mt-[17px] gap-[8px] md:gap-[22px] py-[12px] px-[8px] md:py-[24px] md:px-[17px]">
                    {
                        isLoading && <div className="flex justify-center w-full">
                            <img src={AutosavingIcon} alt="" className="animation-rotate"/>
                        </div>
                    }
                    {
                        !isLoading && rates.length === 0 && <div className="text-error">
                            {rateError}
                        </div>
                    }
                    {
                        !isLoading && rates.map((el, index) => (
                            <RateInfomation 
                                key={el.courier_id} 
                                rate={el} 
                                isSelected={selectedRate === el.courier_id}
                                onSelect={(id) => {setSelectedRate(id)}}
                            />
                        ))
                    }
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
                        {deliveryAmount}$
                    </div>
                </div>
                <div className="item">
                    <div className="title">
                        Summary:
                    </div>
                    <div className="value">
                        {(cartAmount + deliveryAmount).toFixed(2)}$
                    </div>
                </div>
            </div>
            <div className="footer-container mt-[21px]">
                <button className="btn-save text-[14px] sm:text-[16px] md:text-[20px] px-[21px] py-[8px] md:px-[42px] md:py-[13px]" disabled={cart.length === 0} onClick={() => {handleSaveAndNext()}}>
                    Save & Next
                </button>
                <div className="text-amount">
                    {(cartAmount + deliveryAmount).toFixed(2)}$
                </div>
            </div>
        </div>
        <ModalAddAddress 
            open={isShowModalAddAddress}
            onClose={() => {setIsShowModalAddAddress(false)}}
            onSuccess={() => {onReloadListAddress()}}
            type={addressType}
            isEditMode={isEditMode}
            addressId={editAddressId}
        />
    </>
}
export default CheckoutRates;