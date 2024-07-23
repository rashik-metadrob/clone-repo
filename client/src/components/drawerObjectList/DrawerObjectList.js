import { Drawer, Input, Row } from "antd"
import { forwardRef } from "react"
import "./styles.scss"
import ExitIcon from "../../assets/images/project/exit.svg"
import ObjectListIcon from "../../assets/images/project/object-list.svg"
import { useSelector } from "react-redux"
import { getListProducts, getListTexts } from "../../redux/modelSlice"
import _ from "lodash"
import ObjectListTreeView from "./components/objectListTreeView/ObjectListTreeView"

const DrawerObjectList = forwardRef(({
    open,
    onClose = () => {},
    container,
}, ref) => {
    const listProducts = useSelector(getListProducts)
    const listTexts = useSelector(getListTexts)

    return <>
        <Drawer
            title={null}
            placement="left"
            closable={false}
            onClose={() => {onClose()}}
            open={open}
            getContainer={() => container}
            destroyOnClose={true}
            className="drawer-shared"
            width={377}
            mask={false}
        >
            <div className="drawer-object-list-container">
                <div className="drawer-title-container">
                    <div className="title-container">
                        <div className="title">
                            <img src={ObjectListIcon} alt="" />
                            <span>
                                Object List
                                <span className="text-total">
                                    ({_.get(listProducts, ['length'], 0) + _.get(listTexts, ['length'], 0)})
                                </span>
                            </span>
                        </div>
                        <div className="close-container flex items-center gap-[5px]" onClick={() => {onClose()}}>
                            <img src={ExitIcon} alt="" />
                            <div className="text-close">Close</div>
                        </div>
                    </div>
                </div>
                <div className="object-list !ml-0 !mr-0">
                    <ObjectListTreeView />
                </div>
            </div>
        </Drawer>
    </>
})

export default DrawerObjectList;