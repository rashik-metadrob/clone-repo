import { useEffect, useRef, useState } from "react";
import "./styles.scss"
import ScrollRightIcon from "../../assets/images/project/preview/scroll-right.svg"
import gsap from "gsap"
import ThumnailImage from "../../assets/images/admin/hdri-default-thumnail.png"
import { useSelector } from "react-redux";
import { getListCameras } from "../../redux/modelSlice";
import { getAssetsUrl } from "../../utils/util";
import { isMobile } from "react-device-detect";
import { Modal } from "antd";
import MobileNavigateIcon from "../../assets/images/mobile/navigate.svg"
import ExitIcon from "../../assets/images/project/exit.svg"

const PreviewNavigate = ({
    isShow,
    setIsShow = () => {},
    onSelectWall = () => {}
}) => {
    const listCameras = useSelector(getListCameras)
    const scrollRef = useRef();
    const currentAnimation = useRef();
    const refContainer = useRef();
    const [isPortraitMode, setIsPortraitMode] = useState(window.innerHeight > window.innerWidth)

    useEffect(() => {
        window.addEventListener("resize", handleResize)

        return () => {
            window.removeEventListener("resize", handleResize)
        }
    }, [])

    const handleResize = () => {
        setIsPortraitMode(window.innerHeight > window.innerWidth)
    }

    useEffect(() => {
        if(isShow && !isMobile){
            document.addEventListener("pointerdown", handleClickOutside);
        }
        
        return () => {
            document.removeEventListener("pointerdown", handleClickOutside);
        };
    },[isShow, isMobile])

    const handleClickOutside = (event) => {
        if (refContainer.current && !refContainer.current.contains(event.target) && !event.target.classList.contains("btn-navigate") && !event.target.classList.contains("btn-navigate-image")) {
            setIsShow(false)
        }
    }

    const handleScroll = (value) => {
        if(currentAnimation.current){
            currentAnimation.current.kill()
        }
        const handle = {start: scrollRef.current.scrollLeft}
        currentAnimation.current = gsap.to(handle,
            {
                start: scrollRef.current.scrollLeft + value,
                duration: 0.3, 
                ease: "none",
                onUpdate: () => {
                    scrollRef.current.scrollLeft = handle.start;
                },
                onComplete: () => {

                }
            }
          )
    }

    return <>
        {
            !isMobile &&
            <div className={`preview-navigate-container ${isShow ? 'show' : 'hide'}`} ref={refContainer}>
                <div className="scroll-container" ref={scrollRef}>
                    <div className="wall-list-container">
                        {
                            listCameras && listCameras.map((el, index) => (
                                <div className="wall-item" key={`wall-${index}`}>
                                    <img src={el.thumnail ? getAssetsUrl(el.thumnail) : ThumnailImage} alt="" className="wall-image"/>
                                    <div className="absolute left-[0px] bottom-[8px] w-full flex items-center justify-between px-[12px] gap-[16px]">
                                        <div className="name">
                                            {el.name}
                                        </div>
                                        <button className="btn-jump" onClick={() => {onSelectWall(el)}}>
                                            Jump
                                        </button>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>

                <img src={ScrollRightIcon} alt="" className="scroll-right-button" onClick={() => {handleScroll(255)}}/>
                <img src={ScrollRightIcon} alt="" className="scroll-left-button" onClick={() => {handleScroll(-255)}}/>
            </div>
        }
        {
            isMobile &&
            <Modal
                open={isShow}
                onCancel={() => {setIsShow(false)}}
                width="100%"
                footer={null}
                centered
                closable={false}
                className="modal-mobile-wall-navigate"
                destroyOnClose
            >
                <div className={`modal-mobile-wall-container ${isPortraitMode ? "portrait" : "landscape"}`}>
                    <div className="modal-mobile-wall-title-container">
                        <div className="title-container">
                            <div className="title">
                                <img src={MobileNavigateIcon} alt="" />
                                Navigate
                            </div>
                            <div className="close-container flex items-center gap-[5px]" onClick={() => {setIsShow(false)}}>
                                <img src={ExitIcon} alt="" />
                                <div className="text-close">Close</div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-mobile-wall-title-content">
                        <div className="wall-list-container">
                            {
                                listCameras && listCameras.map((el, index) => (
                                    <div className="wall-item" key={`wall-${index}`}>
                                        <img src={el.thumnail ? getAssetsUrl(el.thumnail) : ThumnailImage} alt="" className="wall-image"/>
                                        <div className="absolute left-[0px] bottom-[8px] w-full flex items-center justify-between px-[12px] gap-[16px]">
                                            <div className="name">
                                                {el.name}
                                            </div>
                                            <button 
                                                className="btn-jump" 
                                                onClick={() => {
                                                    onSelectWall(el)
                                                    setIsShow(false)
                                                }}
                                            >
                                                Jump
                                            </button>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </Modal>
        }
    </>
}
export default PreviewNavigate;