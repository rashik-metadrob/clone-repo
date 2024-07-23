import { useState } from "react";
import ModalMusicAndAudio from "../modalMusicAndAudio/ModalMusicAndAudio";
import "./styles.scss"
import {isMobile} from 'react-device-detect';

const MusicAndDeliveryPartner = () => {
    const [isShowModalMusic, setIsShowModalMusic] = useState(false)
    return <>
        <div className="music-and-delivery-partner-container">
            {!isMobile && <div className="btn-music" onClick={() => {setIsShowModalMusic(true)}}>
                Music/Audio
            </div>}
            {/* <div className="btn-delivery">
                Delivery partner
            </div> */}
        </div>

        <ModalMusicAndAudio 
            open={isShowModalMusic}
            onClose={() => {setIsShowModalMusic(false)}}
        />
    </>
}
export default MusicAndDeliveryPartner;