import Lottie from "lottie-react"
import LoadingData from "../../../../assets/json/LOGO_Loader_Anim.json"
import { Html } from "@react-three/drei"

const RoomAdminCanvasLoading = () => {
    const calculatePosition = (group, cam, size) => {

        return [0 , 0];
    }
    return <>
        <Html
            center={true}
            transform={false}
            fullscreen 
            calculatePosition={calculatePosition}
            className="!transform-none !top-[0] !left-[0]"
            zIndexRange={[9, 0]}
        >
            <div className={`absolute inset-0 z-[9] bg-[#FFFFFF]`}>
                <div 
                    className='w-[300px] h-[300px] absolute top-[50%] left-[50%] z-[9]'
                    style={{
                        transform: 'translateX(-50%) translateY(-50%)'
                    }}
                >
                    <Lottie animationData={LoadingData} />
                </div>
            </div>
        </Html>
    </>
}
export default RoomAdminCanvasLoading