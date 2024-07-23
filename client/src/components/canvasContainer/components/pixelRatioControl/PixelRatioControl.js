import { useSelector } from "react-redux"
import { getPixelRatioDesktop, getPixelRatioMobile } from "../../../../redux/configSlice"
import { useEffect, useMemo } from "react"
import { isMobile } from "react-device-detect"
import { useThree } from "@react-three/fiber"

const PixelRatioControl = () => {
    const pixelRatioDesktop = useSelector(getPixelRatioDesktop)
    const pixelRatioMobile = useSelector(getPixelRatioMobile)

    const { setDpr, gl } = useThree()

    const pixelRatioValue = useMemo(() => {
        if(isMobile) {
            return pixelRatioMobile
        } else {
            return pixelRatioDesktop
        }
    }, [pixelRatioDesktop, pixelRatioMobile])

    useEffect(() => {
        setDpr(pixelRatioValue / 100 * window.devicePixelRatio)
        gl.setPixelRatio(pixelRatioValue / 100 * window.devicePixelRatio)
    }, [gl, pixelRatioValue, setDpr])

    return <>
    </>
}
export default PixelRatioControl