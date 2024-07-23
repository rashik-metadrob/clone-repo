import { Drawer, Input } from "antd";
import "./styles.scss"
import ExitIcon from "../../assets/images/project/preview/exit.svg"
import LinkIcon from "../../assets/images/project/preview/link.svg"

import FacebookIcon from "../../assets/images/project/preview/facebook.svg"
import InstagramIcon from "../../assets/images/project/preview/instagram.svg"
import ViberIcon from "../../assets/images/project/preview/viber.svg"

const DrawerInvite = ({
    open,
    onClose = () => {},
    container
}) => {

    return <>
        <Drawer
            title={null}
            placement="right"
            closable={false}
            onClose={() => {onClose()}}
            open={open}
            getContainer={() => container}
            destroyOnClose={true}
            className="drawer-invite"
            width={540}
            mask={false}
        >
            <div className="drawer-invite-content">
                <div className="flex justify-end">
                    <img src={ExitIcon} alt="" className="cursor-pointer" onClick={() => {onClose()}}/>
                </div>
                <div className="content">
                    <div className="title">
                        Invite your Shopping buddy
                    </div>
                    <div className="input-container mt-[24px]">
                        <Input className="input-email w-full" placeholder="Enter mail ID"/>
                    </div>
                    <div className="text-seperate mt-[18px]">
                        <div className="line"></div>
                        <span>Or</span>
                        <div className="line"></div>
                    </div>
                    <div className="input-container mt-[18px]">
                        <Input className="input-email w-full" placeholder="Phone Number"/>
                    </div>
                    <div className="mt-[24px] flex justify-center">
                        <button className="btn-send-link">
                            <img src={LinkIcon} alt="" />
                            <span>Send Link</span>
                        </button>
                    </div>
                    <div className="divider mt-[24px]">
                    </div>
                    <div className="group-icon-container mt-[24px]">
                        <img src={FacebookIcon} alt="" className="cursor-pointer"/>
                        <img src={InstagramIcon} alt="" className="cursor-pointer"/>
                        <img src={ViberIcon} alt="" className="cursor-pointer"/>
                    </div>
                </div>
            </div>
        </Drawer>
    </>
}
export default DrawerInvite;