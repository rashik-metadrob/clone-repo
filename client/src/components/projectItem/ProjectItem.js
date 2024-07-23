import { Dropdown } from "antd"
import { PERMISSIONS, PROJECT_MENU_ACTION, PROJECT_TAB_NO } from "../../utils/constants"
import ThreeDotIcon from "../../assets/images/order/three-dot.svg"
import "./styles.scss"
import { useMemo, useState } from "react"

import DraftIcon from "../../assets/images/store/draft.svg"
import EditIcon from "../../assets/images/store/edit.svg"
import ArchieveIcon from "../../assets/images/store/archive.png"
import PublishIcon from "../../assets/images/store/publish.png"
import DeleteIcon from "../../assets/images/store/delete.png"
import ExitIcon from "../../assets/images/store/exit.png"
import QRIcon from "../../assets/images/store/qr.png"
import ShareIcon from "../../assets/images/store/share.png"
import ModalPublishProject from "../modalPublishProject/ModalPublishProject"
import { getAssetsUrl } from "../../utils/util"
import AutosavingIcon from "../../assets/images/project/auto.svg"
import usePermissions from "../../hook/usePermissions"

const ProjectItem = ({
    activeKey,
    el,
    handleTemplateClick = () => {},
    handleProjectClick = () => {},
    handleMenuClick = () => {}
}) => {
    const [isShowMenu, setIsShowMenu] = useState(false)
    const [isModalQROpen, setIsModalQROpen] = useState(false);
    const [currentProjectId, setCurrentProjectId] = useState();
    const { requirePermissionOfStaff, isStaff } = usePermissions()

    const menuItemDraft = [
        {
            key: PROJECT_MENU_ACTION.EDIT,
            label: "Edit",
            icon: EditIcon
        },
        {
            key: PROJECT_MENU_ACTION.RESTORE,
            label: "Publish",
            icon: PublishIcon
        },
        {
            key: PROJECT_MENU_ACTION.DELETE,
            label: "Delete",
            icon: DeleteIcon
        }
    ];

    const menuItemArchive = [
        {
          key: PROJECT_MENU_ACTION.RESTORE,
          label: "Restore",
          icon: PublishIcon
        },
        {
            key: PROJECT_MENU_ACTION.DELETE,
            label: "Delete",
            icon: DeleteIcon
        }
    ];

    const menuItemPublished = [
        {
            key: PROJECT_MENU_ACTION.EDIT,
            label: "Edit",
            icon: EditIcon,
            hidden: isStaff && requirePermissionOfStaff(PERMISSIONS.SALE_PERSON)
        },
        {
            key: PROJECT_MENU_ACTION.UNPUBLISH,
            label: "Unpublish",
            icon: DraftIcon,
            hidden: isStaff && requirePermissionOfStaff(PERMISSIONS.SALE_PERSON)
        },
        {
            key: PROJECT_MENU_ACTION.QR,
            label: "Share",
            icon: ShareIcon,
        }
    ];

    const currentMenu = useMemo(() => {
        if(activeKey === PROJECT_TAB_NO.ARCHIEVES){
            return menuItemArchive
        } else if(activeKey === PROJECT_TAB_NO.PUBLISHED){
            return menuItemPublished
        } else if(activeKey === PROJECT_TAB_NO.DRAFT){
            return menuItemDraft
        } else {
            return []
        }
    }, [activeKey])

    const handleImageClick = () => {
        if(el.isCompressing) {
            return
        }
        if(activeKey === PROJECT_TAB_NO.ARCHIEVES || activeKey === PROJECT_TAB_NO.DRAFT  || activeKey === PROJECT_TAB_NO.PUBLISHED){
            if(currentMenu.length > 0){
                onClickMenu({
                    key: currentMenu[0].key
                })
            }
            return
        }

        handleTemplateClick(el)
    }

    const onClickMenu = (info) => {
        setIsShowMenu(false)
        if(info.key === PROJECT_MENU_ACTION.QR){
            setCurrentProjectId(el.id)
            setIsModalQROpen(true)
        } else if(info.key === PROJECT_MENU_ACTION.EDIT){
            handleProjectClick(el)
        } else {
            handleMenuClick(info, el)
        }
    }

    return <>
    <div className={`project-item`}>
        <div
            className={`relative h-[160px] 2xl:h-[220px] ${!el.isCompressing ? 'hover-to-show-gradient' : ''} relative`}
        >
            {
                el.isCompressing && <div className="absolute z-[3] inset-0 bg-[rgba(255,255,255,0.4)] backdrop-blur-sm rounded-[5px]">
                    <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                        <img src={AutosavingIcon} alt="" className="animation-rotate-faster w-[50px] h-[50px]"/>
                    </div>
                </div>
            }
            <img 
                src={el.isLock ? `${process.env.REACT_APP_HOMEPAGE}/images/templates/lock.png` : getAssetsUrl(el.image)} 
                alt="" 
                className="project-image cursor-pointer bg-[#000]"
                onClick={() => {handleImageClick()}}
            />
            <div className="group-project-action">
                <div className="project-name">
                    {el.name}
                </div>
                {
                (activeKey === PROJECT_TAB_NO.ARCHIEVES || activeKey === PROJECT_TAB_NO.DRAFT  || activeKey === PROJECT_TAB_NO.PUBLISHED) &&
                    <Dropdown
                        menu={{
                            items: [],
                        }}
                        dropdownRender={() => {
                            return <div className="dropdown-project-item-popup">
                                {
                                    currentMenu.filter(el => !!!el.hidden).map(el => (
                                        <div key={el.key} onClick={() => {onClickMenu({key: el.key})}} className="flex gap-[7px] px-[6px] py-[6px] dropdown-item">
                                            <div className="image-container w-[15px]">
                                                <img src={el.icon} alt="" />
                                            </div>
                                            <div className="text-[#FFF] text-[12px] font-inter flex-auto">
                                                {el.label}
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        }}
                        placement="topRight"
                        arrow={false}
                        trigger="click"
                        open={isShowMenu}
                        onOpenChange={(open) => {setIsShowMenu(open)}}
                    >
                        <button className="btn-menu">
                            <img src={ThreeDotIcon} alt="" />
                        </button>
                    </Dropdown>
                }
            </div>
            {/* <div className="wrapper-background">
            </div> */}
        </div>
        <ModalPublishProject
            isModalOpen={isModalQROpen}
            setIsModalOpen={setIsModalQROpen}
            projectId={currentProjectId}
            title="Publish success !"
        />
    </div>
    </>
}

export default ProjectItem;