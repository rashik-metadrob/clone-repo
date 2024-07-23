import { useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { deleteProductInCart, getCart, setCart } from "../../../../redux/orderSlice"
import { useNavigate, useParams } from "react-router-dom";
import { getAssetsUrl, htmlDecode } from "../../../../utils/util";
import { Dropdown } from "antd";
import _ from "lodash";
import ThreeDotIcon from "../../../../assets/images/project/preview/three-dot.svg"
import MinusIcon from "../../../../assets/images/project/preview/minus.svg"
import PlusIcon from "../../../../assets/images/project/preview/plus.svg"
import ShipIcon from "../../../../assets/images/project/preview/ship.svg"
import { getUser } from "../../../../redux/appSlice";
import ModalLogin from "../../../modalLogin/ModalLogin";
import { getStorageUserDetail } from "../../../../utils/storage";
import { CURRENCY_LIST } from "../../../../utils/constants";

const MyOrders = ({
    onShowDrawerCheckout = () => {}
}) => {
    const dispatch = useDispatch();
    const [isShowModalLogin, setIsShowModalLogin] = useState(false)
    const user = useSelector(getUser)
    const {id: projectId} = useParams()
    const allItemsInCart = useSelector(getCart)
    const cart = useMemo(() => {return (allItemsInCart || []).filter(el => el?.storeId === projectId)}, [allItemsInCart, projectId])
    
    const items = [
        {
          key: 'save',
          label: (
            <div className='menu-cart-items'>
                Save for later
            </div>
          ),
        },
        {
          key: 'delete',
          label: (
            <div className='menu-cart-items'>
                Delete from list
            </div>
          ),
        }
    ];

    const deleteItemInCart = (id) => {
        dispatch(deleteProductInCart(id))
    }

    const changeItemQuantity = (id, quantity) => {
        if(quantity <= 0){
            deleteItemInCart(id)
        } else {
            dispatch(setCart([
                ..._.cloneDeep(cart).map(el => {
                    if(el.id === id){
                        el.quantity = quantity
                    }
    
                    return el
                })
            ]))
        }
    }

    const onMenuClick = (info, id) => {
        if(info.key === "delete"){
            deleteItemInCart(id)
        }
    }

    const onCheckout = () => {
        // //TODO: Check this logic
        // User is not binding when modal hide
        const storageUser = getStorageUserDetail()
        if(storageUser?.id){
            setIsShowModalLogin(false)
            onShowDrawerCheckout(true)
        } else {
            // Show drawer
            setIsShowModalLogin(true)
        }
    }

    return <>
    <div className="content">
        {
            cart && cart.map((el, index) => (
                <div className="cart-item" key={`item-${index}`}>
                    <img src={getAssetsUrl(el.image)} alt="" className="item-image w-[75px] h-[70px]  md:w-[150px] md:h-[137px]"/>
                    <div className="items-content">
                        <div className="flex justify-between items-center">
                            <div className="name">
                                {el.name}
                            </div>
                            <Dropdown
                                menu={{
                                    items: items,
                                    onClick: (info) => {
                                        onMenuClick(info, el.id)
                                    }
                                }}
                                placement="bottomLeft"
                                arrow={false}
                                trigger="click"
                                overlayClassName='menu-cart-overlay'
                            >
                                <img src={ThreeDotIcon} alt="" className="cursor-pointer"/>
                            </Dropdown>
                            
                        </div>
                        <div className="description mt-[9px]" dangerouslySetInnerHTML={{__html: htmlDecode(el.description)}}>
                        </div>
                        <div className="flex justify-between items-center gap-[10px] mt-[21px]">
                            <div className="flex items-center gap-[21px]">
                                <button className="btn-quantity" onClick={() => {changeItemQuantity(el.id, el.quantity - 1)}}>
                                    <img src={MinusIcon} alt="" />
                                </button>
                                <span className="quantity">
                                    {el.quantity}
                                </span>
                                <button className="btn-quantity" onClick={() => {changeItemQuantity(el.id, el.quantity + 1)}}>
                                    <img src={PlusIcon} alt="" />
                                </button>
                            </div>
                            <div className="price">
                                {`${_.get(CURRENCY_LIST.find(c => c.code === el?.displayCurrency), ['symbol'], '')}${el.quantity * el.lastPrice}`}
                            </div>
                        </div>
                    </div>
                </div>
            ))
        }
    </div>
    <div className="drawer-bag-footer gap-[12px] md:gap-[35px]">
        <button className="button-checkout text-[14px] sm:text-[16px] md:text-[20px] md:text-[20px] px-[21px] py-[8px] md:px-[42px] md:py-[13px]" disabled={cart.length === 0} onClick={() => {onCheckout()}}>
            Check Out
        </button>
        {/* {user?.id && <div className="flex justify-between items-center gap-[10px] flex-[auto]">
            <div className="flex flex-auto items-center gap-[12px] md:gap-[24px]">
                <img src={ShipIcon} alt="" className="h-[24px] md:h-[31px]"/>
                <span className="address flex-[auto] text-[12px] sm:text-[14px] md:text-[14px]">
                    3 Newbridge Court Chino Hills, CA 91709, United States
                </span>
            </div>
            <button className="btn-change">
                Change
            </button>
        </div>} */}
    </div>

    <ModalLogin 
        open={isShowModalLogin}
        onClose={() => {setIsShowModalLogin(false)}}
        onSuccess={onCheckout}
        loginTitle="Login to Store"
        loginSubTitle="This is your login Panel. Enter Your Login Credentials to enter store"
    />
    </>
}
export default MyOrders