import { useEffect, useMemo, useState } from "react"
import { isMobile } from "react-device-detect"

const useDetectDevice = () => {
    const [isPortraitMode, setIsPortraitMode] = useState(window.innerHeight > window.innerWidth)

    const deviceDetectCssClass = useMemo(() => {
        return `${isMobile ? 'mobile' : 'desktop'} ${isPortraitMode ? "portrait" : "landscape"}`
    }, [isPortraitMode])

    useEffect(() => {
        window.addEventListener("resize", handleResize)
        return () => {
            window.removeEventListener("resize", handleResize)
        }
    }, [])

    const handleResize = () => {
        setIsPortraitMode(window.innerHeight > window.innerWidth)
    }

    return {
        isPortraitMode,
        isMobile,
        deviceDetectCssClass
    }
}


export default useDetectDevice