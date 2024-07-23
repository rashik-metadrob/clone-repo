import { Drawer } from "antd";
import "./styles.scss";
import ExitIcon from "../../assets/images/project/preview/exit.svg"
import { useState } from "react";
import { ORDER_STATUS } from "../../utils/constants";

const DrawerOrder = ({
    open,
    onClose = () => {},
    container
}) => {
    const [listOrder, setListOrder] = useState([
        {
            name: "Product Name",
            trackingNumber: "IW3475453455",
            amount: 112,
            orderDate: "08-16-2023",
            quantity: 3,
            status: ORDER_STATUS.OUT_OF_DELIVERED.value
        },
        {
            name: "Product Name",
            trackingNumber: "IW3475453455",
            amount: 112,
            orderDate: "08-16-2023",
            quantity: 3,
            status: ORDER_STATUS.DELIVERED.value
        },
        {
            name: "Product Name",
            trackingNumber: "IW3475453455",
            amount: 112,
            orderDate: "08-16-2023",
            quantity: 3,
            status: ORDER_STATUS.DELIVERED.value
        },
        {
            name: "Product Name",
            trackingNumber: "IW3475453455",
            amount: 112,
            orderDate: "08-16-2023",
            quantity: 3,
            status: ORDER_STATUS.DELIVERED.value
        }
    ])

    const findOrderStatusText = (value) => {
        let text = "";
        Object.keys(ORDER_STATUS).forEach(el => {
            if(ORDER_STATUS[el].value === value){
                text = ORDER_STATUS[el].text
            }
        })

        return text;
    }

    const findOrderStatusColor = (value) => {
        let color = "";
        Object.keys(ORDER_STATUS).forEach(el => {
            if(ORDER_STATUS[el].value === value){
                color = ORDER_STATUS[el].color
            }
        })

        return color;
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
        className="drawer-order"
        width={540}
        mask={false}
    >
        <div className="drawer-order-content">
            <div className="drawer-order-header">
                <div className="title">
                    My Orders
                </div>
                <img src={ExitIcon} alt="" className="cursor-pointer" onClick={() => {onClose()}}/>
            </div>
            <div className="content">
                {
                    listOrder && listOrder.map((el, index) => (
                        <div className="order-item" key={`order-${index}`}>
                            <div className="order-item-image">

                            </div>
                            <div className="order-item-content">
                                <div className="flex items-center justify-between">
                                    <div className="text-name">
                                        {el.name}
                                    </div>
                                    <div className="text-title">
                                        {el.orderDate}
                                    </div>
                                </div>
                                <div className="flex items-center gap-[15px] mt-[13px]">
                                    <div className="text-title">
                                        Tracking number:
                                    </div>
                                    <div className="text-value">
                                        {el.trackingNumber}
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mt-[13px]">
                                    <div className="flex items-center gap-[15px]">
                                        <div className="text-title">
                                            Total Amount:
                                        </div>
                                        <div className="text-value">
                                            ${el.amount}
                                        </div>
                                    </div>
                                    <div className="text-delivery" style={{color: findOrderStatusColor(el.status)}}>
                                        { findOrderStatusText(el.status) }
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mt-[7px]">
                                    <div className="flex items-center gap-[15px]">
                                        <div className="text-title">
                                            Quantity:
                                        </div>
                                        <div className="text-value">
                                            {el.quantity}
                                        </div>
                                    </div>
                                    <button className="btn-track">
                                        Track Order
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                }
                
            </div>
        </div>
    </Drawer>
    </>
}
export default DrawerOrder;