import { useEffect, useRef, useState } from "react"
import "./styles.scss"
import BackGround1 from "../../assets/images/login/carousel-bg-1.png"
import BackGround2 from "../../assets/images/login/carousel-bg-2.png"
import BackGround3 from "../../assets/images/login/carousel-bg-3.png"

const CarouselLoginAndRegister = ({
    onIndexChange = () => {}
}) => {
    const [index, setIndex] = useState(0)
    const [items, setItems] = useState([
        {
            id: 1,
            title: "Step into innovation with 3D retail showrooms",
            subtitle: "Where shopping meets the future seamlessly.",
            background: BackGround1
        },
        {
            id: 2,
            title: "Step into innovation with 3D retail showrooms",
            subtitle: "Where shopping meets the future seamlessly.",
            background: BackGround2
        },
        {
            id: 3,
            title: "Step into innovation with 3D retail showrooms",
            subtitle: "Where shopping meets the future seamlessly.",
            background: BackGround3
        }
    ])
    useEffect(() => {
        onIndexChange(index)
    }, [index])
    const intervalRef = useRef()

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setIndex(idx => idx + 1)
        }, 5000)

        return () => {
            if(intervalRef.current){
                clearInterval(intervalRef.current)
            }
        }
    },[])

    const changeToIndex = (idx) => {
        if(intervalRef.current){
            clearInterval(intervalRef.current)
        }
        setIndex(idx)

        intervalRef.current = setInterval(() => {
            setIndex(idx => idx + 1)
        }, 5000)
    }

    return <>
        <div className="carousel-login-and-register-wrapper">
            {
                items.map((el, idx) => (
                    <div 
                        className={`h-full carousel-item ${index % items.length === idx ? 'active' : ''}`} 
                        key={el.id} 
                        style={{
                            backgroundImage: `url(${el.background})`
                        }}
                    >
                        <div className='carousel-item-card'>
                            <div>
                                <div className='carousel-item-card-title text-left'>
                                    {el.title}
                                </div>
                                <div className='carousel-item-card-sub-title mt-[20px] text-left'>
                                    {el.subtitle}
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            }
            <div className="carousel-control-dots">
                {items.map((el, idx) => (
                    <div className={`control ${index % items.length === idx ? 'active' : ''}`} key={el.id} onClick={() => {changeToIndex(idx)}}>
                    </div>
                ))}
            </div>
        </div>
    </>
}
export default CarouselLoginAndRegister