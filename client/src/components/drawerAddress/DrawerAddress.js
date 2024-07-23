import { Drawer, Modal, notification } from "antd"
import ExitIcon from "../../assets/images/project/preview/exit.svg"
import "./styles.scss"
import addressApi from "../../api/address.api"
import { ADDRESS_TYPE } from "../../utils/constants"
import { useEffect, useState } from "react"
import TrashIcon from "../../assets/images/products/trash.svg"
import EditIcon from "../../assets/images/products/edit.svg"
import ModalAddAddress from "../modalAddAddress/ModalAddAddress"
import PlusIcon from "../../assets/icons/PlusIcon"

const DrawerAddress = ({
    open,
    onClose = () => {},
    container,
}) => {
    const [destinationAddresses, setDestinationAddresses] = useState([])
    const [isEditMode, setIsEditMode] = useState(false);
    const [editAddressId, setEditAddressId] = useState("")

    const [addressType, setAddressType] = useState(ADDRESS_TYPE.SHIPPING_ADDRESS)
    const [isShowModalAddAddress, setIsShowModalAddAddress] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        getAllDestinationAddress()
    }, [])

    const getAllDestinationAddress = () => {
        addressApi.getAllAddress({type: ADDRESS_TYPE.SHIPPING_ADDRESS}).then(rs => {
            if(rs.length > 0){
                setDestinationAddresses(rs);
            } else {
                setDestinationAddresses([]);
            }
        }).catch(err => {
            
        })
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
                    getAllDestinationAddress()
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
    <Drawer
        title={null}
        placement="right"
        closable={false}
        onClose={() => {onClose()}}
        open={open}
        getContainer={() => container}
        destroyOnClose={true}
        className="drawer-address"
        width={600}
        mask={false}
    >
        <div className="drawer-address-content">
            <div className="drawer-address-header">
                <div className="tab-content flex gap-[42px] items-center text-[18px] sm:text-[24px] md:text-[32px]">
                    <div className={`title selected`}>
                        My Addresses
                    </div>
                </div>
                <img src={ExitIcon} alt="" className="cursor-pointer" onClick={() => {onClose()}}/>
            </div>
            <div className="drawer-address-content">
                <div>
                    <button className="btn-add-new" onClick={() => {
                        setAddressType(ADDRESS_TYPE.SHIPPING_ADDRESS)
                        setIsEditMode(false)
                        setIsShowModalAddAddress(true)
                    }}>
                        <PlusIcon />
                        <span>Add new</span>
                    </button>
                </div>
                {
                    destinationAddresses && destinationAddresses.map(el => (
                        <div className="address-container ps-[16px] sm:ps-[16px] md:ps-[47px]" key={el.id}>
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
                    ))
                }
            </div>
        </div>
    </Drawer>
        <ModalAddAddress 
            open={isShowModalAddAddress}
            onClose={() => {setIsShowModalAddAddress(false)}}
            onSuccess={() => {
                getAllDestinationAddress()
                setIsShowModalAddAddress(false)
            }}
            type={addressType}
            isEditMode={isEditMode}
            addressId={editAddressId}
        />
    </>
}
export default DrawerAddress;
