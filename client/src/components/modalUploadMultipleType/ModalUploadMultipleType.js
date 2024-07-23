import { Modal, Tabs } from "antd"
import "./styles.scss"
import AddProduct from "../addProduct/AddProduct"
import ModalExitIcon from "../../assets/images/project/modal-exit.svg"
import { PERMISSIONS, PRODUCT_TYPES } from "../../utils/constants"
import AddMedia from "../addMedia/AddMedia"
import { useEffect, useMemo, useState } from "react"
import global from "../../redux/global"
import DrobAAddProduct from "../drobAComponents/drobAAddProduct/DrobAAddProduct"
import usePermissions from "../../hook/usePermissions"

const ModalUploadMultipleType = ({
    open,
    onClose = () => {},
    onBack = () => {},
    onSuccess = () => {},
    defaultTab = PRODUCT_TYPES.PRODUCTS
}) => {
    const [activeKey, setActiveKey] = useState(PRODUCT_TYPES.PRODUCTS.toString())
    const { requirePermissionOfStaff, isStaff } = usePermissions()

    const items = [
        {
          key: PRODUCT_TYPES.PRODUCTS,
          label: `Product`,
          hidden: !requirePermissionOfStaff(PERMISSIONS.ALL),
          children: <>
            {
                !global.IS_DROB_A && <AddProduct 
                    onBack={() => {onBack()}}
                    onSuccess={(type) => {onSuccess(type)}}
                    isInModal={true}
                    type={PRODUCT_TYPES.PRODUCTS}
                />
            }
            {
                global.IS_DROB_A && <DrobAAddProduct 
                    onBack={() => {onBack()}}
                    onSuccess={(type) => {onSuccess(type)}}
                    isInModal={true}
                    type={PRODUCT_TYPES.PRODUCTS}
                />
            }
        </>,
        },
        {
            // Tab key
            key: PRODUCT_TYPES.MEDIA,
            label: `Media`,
            children: <>
                <AddMedia 
                    onSuccess={() => {onSuccess()}}
                    isInModal={true}
                />
            </>,
            hidden: global.IS_DROB_A || !requirePermissionOfStaff(PERMISSIONS.UPLOAD_MEDIA)
        },
        {
            key: PRODUCT_TYPES.ELEMENT,
            label: `Others`,
            hidden: !requirePermissionOfStaff(PERMISSIONS.UPLOAD_OTHERS),
            children: <>
                <AddProduct 
                    onBack={() => {onBack()}}
                    onSuccess={(type) => {onSuccess(type)}}
                    isInModal={true}
                    type={PRODUCT_TYPES.ELEMENT}
                />
            </>
        }
    ];

    useEffect(() => {
        if(isStaff) {
            const visibleItems = items.filter(el => !el.hidden).map(el => el.key)
            if(!visibleItems.includes(+defaultTab) && visibleItems.length > 0) {
                console.log(visibleItems[0].toString())
                setActiveKey(visibleItems[0].toString())
            }
        } else {
            if(defaultTab){
                setActiveKey(defaultTab?.toString())
            }
        }
    }, [isStaff, defaultTab])

    return <>
        <Modal
            open={open}
            width={794}
            footer={null}
            closeIcon={<img src={ModalExitIcon} alt="" />}
            destroyOnClose={true}
            closable={true}
            className="modal-add-multiple-type"
            onCancel={() => {onClose()}}
        >
            <div className="modal-add-multiple-type-content">
                <Tabs
                    className="upload-list-tabs"
                    activeKey={activeKey}
                    onChange={(key) => {setActiveKey(key.toString())}}
                >
                    {items.filter(el => !el.hidden).map((tab) => {
                        const { key, label, children } = tab;
                        return (
                            <Tabs.TabPane
                            key={key}
                            tab={label}
                            >
                                {children}
                            </Tabs.TabPane>
                        );
                    })}
                </Tabs>
            </div>
        </Modal>
    </>
}
export default ModalUploadMultipleType;