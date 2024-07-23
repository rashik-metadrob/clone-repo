import { Dropdown, Input } from "antd";
import "./styles.scss"
import EmoijIcon from "../../assets/images/project/preview/emoij.svg"
import { useState } from "react";

import Avatar1Image from "../../assets/images/project/preview/avatar1.png"
import Avatar2Image from "../../assets/images/project/preview/avatar2.png"
import Avatar3Image from "../../assets/images/project/preview/avatar3.png"

const PreviewChat = () => {
    const [isShowMenu, setIsShowMenu] = useState(false)
    const [listChat, setListChat] = useState([
        {
            avatar: Avatar1Image,
            name: "Trinity",
            message: "Come to the Bags area"
        },
        {
            avatar: Avatar2Image,
            name: "Jacob Rox",
            message: "Anyone here"
        },
        {
            avatar: Avatar3Image,
            name: "Emmy",
            message: "Hi"
        }
    ])

    return <>
    <Dropdown
        menu={{
            items: []
        }}
        dropdownRender={() => (
            <div className="menu-preview-personal-content">
                {
                    listChat && listChat.map((el, index) => (
                        <div className="chat-container" key={`chat-${index}`}>
                            <img src={el.avatar} alt="" className="rounded-[50%] w-[35px] h-[35px]"/>
                            <div className="chat-content">
                                <div className="name">
                                    {el.name}
                                </div>
                                <div className="message">
                                    {el.message}
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        )}
        placement="topRight"
        arrow={false}
        trigger="click"
        overlayClassName='menu-preview-chat-overlay'
        open={isShowMenu}
        onOpenChange={(value) => {setIsShowMenu(value)}}
    >
        <Input 
            className="preview-chat-input" 
            // NO FUNCTIONAL
            // suffix={
            //     <img src={EmoijIcon} alt="" className="cursor-pointer"/>
            // }
            placeholder="Type your message here"
        />  
    </Dropdown>
        
    </>
}
export default PreviewChat;