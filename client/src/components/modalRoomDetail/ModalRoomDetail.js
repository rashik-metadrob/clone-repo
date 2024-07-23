import { Checkbox, Modal, notification } from "antd";
import "./styles.scss"
import deleteIcon from "../../assets/images/room/delete.png"
import { useEffect, useState } from "react";
import _ from "lodash"
import { socket } from "../../socket/socket";

const ModalRoomDetail = ({
    room,
    users,
    isModalOpen,
    setIsModalOpen
}) => {
    const [listUser, setListUser] = useState([])

    useEffect(() => {
        if(users){
            let newUsers = _.cloneDeep(listUser)
            newUsers = newUsers.filter(el => users.find(o => o.socketId === el.socketId))
            users.forEach(el => {
                if(!newUsers.find(o => o.socketId === el.socketId)){
                    newUsers.push(el)
                }
            })
            if(compareListUser(listUser, newUsers)){
                setListUser(newUsers)
            }
        }
    }, [users, listUser])

    const compareListUser = (list1, list2) => {
        let key1 = ''
        list1.forEach(el => {
            key1 += el.socketId
        })

        let key2 = ''
        list2.forEach(el => {
            key2 += el.socketId
        })

        return key1 !== key2
    }

    const onSelected = (id) => {
        setListUser(
            listUser.map(el => {
                if(el.socketId === id){
                    el.isSelected = !!!el.isSelected
                }

                return el
            })
        )
    }

    const formatIndex = (index) => {
        if(index.toString().length === 1){
            return `0${index}`
        }

        return index
    }

    const onRemoveUsers = () => {
        const listKickIds = listUser.filter(el => el.isSelected).map(el => el.socketId)

        if(listKickIds.length === 0){
            notification.warning({
                message: "No user selected!"
            })

            return
        }

        if(socket.connected){
            socket.emit("kick-users", listKickIds)
        }

        notification.success({
            message: `Successfully kicked ${listKickIds.length} users`
        })

        setIsModalOpen(false)
    }

    return <>
    <Modal 
        title={null}
        footer={null}
        open={isModalOpen} 
        closable={false}
        onCancel={() => {setIsModalOpen(false)}}
        className="modal-room-detail"
        width={600}
        centered
    >
        <div className="px-[5px] room-title-container">
            <div className="room-title">
                {room?.name} Status
            </div>
            <div className="flex items-center gap-[2px] cursor-pointer" onClick={() => {onRemoveUsers()}}>
                <img src={deleteIcon} alt="" />
                <div className="delete-text">
                    Remove User
                </div>
            </div>
        </div>
        <div className="users-container">
            <div className="list-users">
                {
                    listUser.map((el, index) => {
                        return <div className="user-item">
                            <div className="user-index">
                                {formatIndex(index + 1)}
                            </div>
                            <div className="user-name">
                                {el.clientName}
                            </div>
                            <Checkbox 
                                className="shared-checkbox" 
                                checked={el.isSelected} 
                                onClick={() => {onSelected(el.socketId)}}
                            />
                        </div>
                    })
                }
                {
                    listUser.length < 18 && new Array(18 - listUser.length).fill(null).map((el, index) => {
                        return <div className="user-item">
                            <div className="user-index">
                                { formatIndex(listUser.length + index + 1)}
                            </div>
                            <div className="user-name">
                                ###
                            </div>
                            <Checkbox 
                                className="shared-checkbox" 
                                checked={false}
                                disabled
                            />
                        </div>
                    })
                }
            </div>
        </div>
        <div className="text-room-des mt-[18px]">
            Room 3 member’s status,  “ ### ” refers to empty seats in the room. 
            You can remove a member from the room by selecting them{" "}
            <Checkbox checked className="shared-checkbox !items-baseline" />
            {" "}and clicking
            {" "}
            <img src={deleteIcon} alt="" className="inline-block"/>
            <label className="delete-text">
                Remove User
            </label>
        </div>
    </Modal>
    </>
}
export default ModalRoomDetail;