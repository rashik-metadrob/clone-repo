import { Drawer } from "antd";
import ExitIcon from "../../assets/images/project/preview/exit.svg"
import "./styles.scss"

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import { CART_MODE, DRAWER_BAG_TABS } from "../../utils/constants";
import MyOrders from "./components/myOrders/MyOrders";
import MyShopifyOrders from "./components/myShopifyOrders/MyShopifyOrder";
import { getCartMode, getDrawerBagActiveTab, setDrawerBagActiveTab } from "../../redux/uiSlice";

const DrawerBag = ({
    open,
    onClose = () => {},
    container,
    onShowDrawerCheckout = () => {},
    onPlayOpenMenuSound = () => {},
    onPlayCloseMenuSound = () => {}
}) => {
    const dispatch = useDispatch();
    const drawerBagActiveTab = useSelector(getDrawerBagActiveTab)
    const tabContentRef = useRef()
    const cartMode = useSelector(getCartMode)

    useEffect(() => {
        if(open){
            onPlayOpenMenuSound()
        } else {
            onPlayCloseMenuSound()
        }
    }, [open])

    const onTabContentWheel = (e) => {
        const maxScrollLeft = tabContentRef.current.scrollWidth - tabContentRef.current.offsetWidth
        if(e.deltaY > 0){
            if(maxScrollLeft > 0){
                if(tabContentRef.current.scrollLeft < maxScrollLeft){
                    tabContentRef.current.scrollLeft = tabContentRef.current.scrollLeft + 40 > maxScrollLeft ? maxScrollLeft : tabContentRef.current.scrollLeft + 40
                }
            }
        } else {
            if(maxScrollLeft > 0){
                if(tabContentRef.current.scrollLeft > 0){
                    tabContentRef.current.scrollLeft = tabContentRef.current.scrollLeft - 40 > 0 ? tabContentRef.current.scrollLeft - 40 : 0
                }
            }
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
        className="drawer-bag"
        width={600}
        mask={false}
    >
        <div className="drawer-bag-content">
            <div className="drawer-bag-header">
                <div ref={tabContentRef} className="tab-content flex gap-[42px] items-center text-[18px] sm:text-[24px] md:text-[32px]" onWheel={(e) => {onTabContentWheel(e)}}>
                    {cartMode === CART_MODE.METADROD && <div className={`title ${drawerBagActiveTab === DRAWER_BAG_TABS.MY_ORDERS ? 'selected' : ''}`} onClick={() => {dispatch(setDrawerBagActiveTab(DRAWER_BAG_TABS.MY_ORDERS))}}>
                        My Orders
                    </div>}
                    {cartMode === CART_MODE.SHOPIFY && <div className={`title ${drawerBagActiveTab === DRAWER_BAG_TABS.MY_SHOPIFY_ORDERS ? 'selected' : ''}`} onClick={() => {dispatch(setDrawerBagActiveTab(DRAWER_BAG_TABS.MY_SHOPIFY_ORDERS))}}>
                        My Orders
                    </div>}
                    {/* <div className={`title ${drawerBagActiveTab === DRAWER_BAG_TABS.SAVE_FOR_LATER ? 'selected' : ''}`} onClick={() => {dispatch(setDrawerBagActiveTab(DRAWER_BAG_TABS.SAVE_FOR_LATER))}}>
                        Save for later
                    </div> */}
                </div>
                <img src={ExitIcon} alt="" className="cursor-pointer" onClick={() => {onClose()}}/>
            </div>
            {
                drawerBagActiveTab === DRAWER_BAG_TABS.MY_ORDERS && <MyOrders onShowDrawerCheckout={onShowDrawerCheckout}/>
            }
            {
                drawerBagActiveTab === DRAWER_BAG_TABS.MY_SHOPIFY_ORDERS && <MyShopifyOrders/>
            }
        </div>
    </Drawer>
    </>
}
export default DrawerBag;