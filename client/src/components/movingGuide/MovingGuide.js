import "./styles.scss"
import WASDIcon from "../../assets/images/moving/WASD.svg"
import QEIcon from "../../assets/images/moving/Q & E.svg"
import ScrollIcon from "../../assets/images/moving/Scroll.svg"
import LeftClickIcon from "../../assets/images/moving/Left Click.svg"

const MovingGuide = ({
    isShow
}) => {

    return <>
        <div className={`moving-guide-wrapper ${isShow ? 'show' : ''}`}>
            <div className="moving-guide-container">
                <div className="guide-item">
                    <div className="flex items-center justify-center w-[60px]">
                        <img src={WASDIcon} alt="" className=""/>
                    </div>
                    <span>
                        To turn product around respectively UP | LEFT | DOWN | RIGHT
                    </span>
                </div>
                <div className="guide-item">
                    <div className="flex items-center justify-center w-[60px]">
                        <img src={QEIcon} alt="" className=""/>
                    </div>
                    <span>
                        Press Q & E To turn the character Left & Right respectively
                    </span>
                </div>
                <div className="guide-item">
                    <div className="flex items-center justify-center w-[60px]">
                        <img src={ScrollIcon} alt="" className=""/>
                    </div>
                    <span>
                        Scroll Up & Down to Zoom in the product
                    </span>
                </div>
                <div className="guide-item">
                    <div className="flex items-center justify-center w-[60px]">
                        <img src={LeftClickIcon} alt="" className=""/>
                    </div>
                    <span>
                        Click left mouse button to close the window
                    </span>
                </div>
            </div>
        </div>
    </>
}
export default MovingGuide;