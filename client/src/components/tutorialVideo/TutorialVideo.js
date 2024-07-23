import "./styles.scss"
import PlayIcon from "../../assets/images/tutorial/play-video.png"
import ReactPlayer from "react-player"
import { Modal } from "antd"
import { useState } from "react"

const TutorialVideo = ({url, name, fontSize = 20, controls = false}) => {
    const [isModalPreviewOpen, setIsModalPreviewOpen] = useState(false)
    const onPreviewVideo = () => {
        console.log("onPreviewVideo")
        setIsModalPreviewOpen(true)
    }

    return <>
        <div className="tutorial-video-container">
            <div className="relative" onClick={() => {onPreviewVideo()}}>
                <ReactPlayer
                    url={url}
                    width="100%"
                    height="100%"
                    className="tutorial-video"
                    controls={controls}
                />
                <div className="play-icon">
                    <img src={PlayIcon} alt="" className="w-[48px]"/>
                </div>
            </div>
            <div className="video-name" style={{fontSize: fontSize}}>
                {name}
            </div>
        </div>
        <Modal
            open={isModalPreviewOpen}
            closable={false}
            title={null}
            footer={null}
            onCancel={() => {setIsModalPreviewOpen(false)}}
            centered
            className="modal-preview-video"
            destroyOnClose
            width={768}
        >
            <ReactPlayer
                url={url}
                width="100%"
                height="100%"
                className="tutorial-video"
                style={{ maxHeight: '90vh' }}
                controls
            />
        </Modal>
    </>
}
export default TutorialVideo;