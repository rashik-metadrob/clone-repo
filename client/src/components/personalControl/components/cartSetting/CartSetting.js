import { useLocation } from "react-router-dom"
import global from "../../../../redux/global"
import { isPublishModeLocation } from "../../../../utils/util"
import BagIcon from "../../../../assets/images/project/bag.svg"
import { useAppDispatch } from "../../../../redux"
import { getIsShowDrawerBag, getIsShowDrawerCheckout, setIsShowDrawerBag, setIsShowDrawerCheckout } from "../../../../redux/uiSlice"
import DrawerBag from "../../../drawerBag/DrawerBag"
import DrawerCheckout from "../../../drawerCheckout/DrawerCheckout"
import { useSelector } from "react-redux"

const CartSetting = ({
    container,
    onPlayOpenMenuSound = () => {},
    onPlayCloseMenuSound = () => {}
}) => {
    const location = useLocation()
    const dispatch = useAppDispatch()

    const isShowDrawerBag = useSelector(getIsShowDrawerBag)
    const isShowDrawerCheckout = useSelector(getIsShowDrawerCheckout)

    const onChangeShowDrawerCheckout = (value) => {
        dispatch(setIsShowDrawerCheckout(value))
      }

    return <>
        {!global.IS_DROB_A && isPublishModeLocation(location) && <div className='setting' onClick={() => {dispatch(setIsShowDrawerBag(true))}}>
            <img src={BagIcon} alt='bag' className='!w-[26px] !h-[26px] object-contain'/>
        </div>}

        <DrawerBag 
            open={isShowDrawerBag && !isShowDrawerCheckout}
            onClose={() => {
                dispatch(setIsShowDrawerBag(false))
            }}
            container={container.current}
            onShowDrawerCheckout={onChangeShowDrawerCheckout}
            onPlayOpenMenuSound={onPlayOpenMenuSound}
            onPlayCloseMenuSound={onPlayCloseMenuSound}
        />

        <DrawerCheckout
            open={isShowDrawerCheckout}
            onClose={() => {
                onChangeShowDrawerCheckout(false)
            }}
            container={container}
            onPlayOpenMenuSound={onPlayOpenMenuSound}
            onPlayCloseMenuSound={onPlayCloseMenuSound}
        />
    </>
}

export default CartSetting