import { Col, Drawer, Row } from "antd"
import { forwardRef, useState } from "react"
import "./styles.scss"
import ExitIcon from "../../assets/images/project/exit.svg"
import SoundIcon from "../../assets/images/project/sound-icon.png"

import JukeboxImage from "../../assets/images/project/jukebox.png"
import SpotifyImage from "../../assets/images/project/spotify.png"
import SoundcloudImage from "../../assets/images/project/soundcloud.png"

const DrawerSound = forwardRef(({
    open,
    onClose = () => {},
    container,
}, ref) => {
    const [listSound, setListSound] = useState([
        {
            id: "1",
            name: "Jukebox",
            image: JukeboxImage
        },
        {
            id: "2",
            name: "Spotify",
            image: SpotifyImage
        },
        {
            id: "3",
            name: "Soundcloud",
            image: SoundcloudImage
        }
    ])

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
            <div className="drawer-sound-container">
                <div className="drawer-title-container">
                    <div className="title-container">
                        <div className="title">
                            <img src={SoundIcon} alt="" />
                            Sound
                        </div>
                        <div className="close-container flex items-center gap-[5px]" onClick={() => {onClose()}}>
                            <img src={ExitIcon} alt="" />
                            <div className="text-close">Close</div>
                        </div>
                    </div>
                </div>
                <Row className="sound-list !ml-0 !mr-0 my-[24px]" gutter={[24, 24]} style={{flexGrow: "initial"}}>
                    {
                        listSound && listSound.map((el, index) => {
                            return <>
                                <Col span={12} key={el.id} className="h-[150px]">
                                    <div className="sound-item">
                                        <img src={el.image} alt=""/>
                                        <div className="sound-name">
                                            {el.name}
                                        </div>
                                    </div>
                                </Col>
                            </>
                        })
                    }
                </Row>
            </div>
        </Drawer>
    </>
})

export default DrawerSound;