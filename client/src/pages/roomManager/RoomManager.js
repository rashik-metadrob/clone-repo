import { Checkbox, Col, Row, notification } from "antd";
import "./styles.scss"
import { useEffect, useState } from "react";
import ViewIcon from "../../assets/images/room/view.png"
import SaveIcon from "../../assets/images/room/save.png"
import CopyIcon from "../../assets/images/room/copy.png"
import ModalRoomDetail from "../../components/modalRoomDetail/ModalRoomDetail";
import { getListProject } from "../../api/project.api";
import { PROJECT_MODE, PROJECT_TYPE } from "../../utils/constants";
import { getStorageUserDetail } from "../../utils/storage";

import { socket } from "../../socket/socket"

const RoomManager = () => {
    const [listRoom, setListRoom] = useState([])
    const [listUsersInRoom, setListUsersInRoom] = useState([])
    const currentUser = getStorageUserDetail();
    const [selectedRoom, setSelectedRoom] = useState()
    const [isOpenModalRoomDetail, setIsOpenModalRoomDetail] = useState(false)
    const [isShowPublishLink, setIsShowPublishLink] = useState(false)
    const [isLinkCopied, setIsLinkCopied] = useState(false)

    useEffect(() => {
        const filterData = {
            type: PROJECT_TYPE.PROJECT,
            limit: 100,
            createdBy: currentUser.id,
            mode: PROJECT_MODE.PUBLISH
        }
        getListProject(filterData).then(data => {
            setListRoom(data.results)
        })
    },[])

    useEffect(() => {
        setIsShowPublishLink(false)
        setIsLinkCopied(false)
    }, [selectedRoom])

    useEffect(() => {
        if(listRoom.length > 0){
            if(!socket.connected){
                socket.connect()
            }
            socket.on("update-rooms", onUpdateRooms)
            socket.emit("manager-room", {
                ids: listRoom.map(el => el.id)
            })
        }

        return () => {
            socket.off("update-rooms", onUpdateRooms)
            if(socket.connected){
                socket.disconnect()
            }
        }
        
    },[listRoom])

    const onUpdateRooms = (data) => {
        let rooms = {}
        Object.keys(data).forEach(el => {
            rooms[el] = [
                ...Object.keys(data[el]).map(key => {return data[el][key]})
            ]
        })

        setListUsersInRoom(rooms)
    }

    const onChooseRoom = (id) => {
        setSelectedRoom(id)
        setIsOpenModalRoomDetail(true)
    }

    const onCopyLink = () => {
        navigator.clipboard.writeText(
            `${window.location.protocol}//${window.location.hostname}${window.location.port ? ':' + window.location.port : ''}${process.env.REACT_APP_HOMEPAGE}/publish/sale/${selectedRoom}`
            )
        notification.success({
            message: "Copied!"
        })
        setIsLinkCopied(true)
    }

    return <>
        <Row gutter={[26, 26]} className="!ml-0 !mr-0 mt-[12px] rooms-manager-container mb-[120px]">
            <Col lg={17} md={17} sm={24} xs={24}>
                <div className="flex justify-between items-center mt-[12px]">
                    <div className="text-invite-sales">
                        Invite Sales Representative
                    </div>
                </div>
                <div className="mt-[22px] rooms-container">
                    <div className="text-choose-room">
                        Choose A Room 
                    </div>
                    <div className="list-rooms mt-[18px]">
                        {
                            listRoom.map((el, index) => {
                                return <div className="room-item">
                                    <div className="room-name" onClick={() => {onChooseRoom(el.id)}}>
                                        {el.name}
                                    </div>
                                    <div className="room-online-info">
                                        {listUsersInRoom[el.id] ? listUsersInRoom[el.id].length ?? 0 : 0}/18
                                    </div>
                                    <Checkbox className="shared-checkbox" checked={selectedRoom === el.id} onClick={() => {setSelectedRoom(el.id)}}/>
                                    <div className="flex items-center gap-[7px] cursor-pointer">
                                        <img src={ViewIcon} alt=""/>
                                        <div className="text-view">View</div>
                                    </div>
                                </div>
                            })
                        }
                    </div>
                </div>
                <div className="mt-[40px] flex items-center gap-[12px] cursor-pointer" onClick={() => {setIsShowPublishLink(true)}}>
                    <img src={SaveIcon} alt="" />
                    <div className="text-generate-link">
                        Generate Link
                    </div>
                </div>
                <div className="text-generate-link-info mt-[6px]">
                    Salesperson’s invite link will be deleted after 48 Hours.
                </div>
                {
                    isShowPublishLink && <>
                        <div className="mt-[26px] flex flex-wrap items-center gap-[40px]" >
                            <div className="text-link-created">
                                Link Created
                            </div>
                            <div className="sale-link">
                            {`${window.location.protocol}//${window.location.hostname}${window.location.port ? ':' + window.location.port : ''}${process.env.REACT_APP_HOMEPAGE}/publish/sale/${selectedRoom}`}
                            </div>
                            <img src={CopyIcon} alt="" className="cursor-pointer" onClick={() => {onCopyLink()}}/>
                            {isLinkCopied && <div className="link-copied" >
                                Link Copied !!
                            </div>}
                        </div>
                        <div className="text-instruction mt-[26px]">
                            Instruction
                        </div>
                        <div className="text-instruction-des mt-[15px]">
                            Share this link with the person whom you like to assign the role "Sales Representative".
                        </div>
                    </>
                }
            </Col>
        </Row>
        <ModalRoomDetail 
            room={listRoom.find(el => el.id === selectedRoom)}
            users={listUsersInRoom[selectedRoom]}
            isModalOpen={isOpenModalRoomDetail}
            setIsModalOpen={setIsOpenModalRoomDetail}
        />
    </>
}
export default RoomManager;