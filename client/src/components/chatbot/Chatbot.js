import { useEffect, useRef } from "react"
import { useLocation } from "react-router-dom"
import { isPublishModeLocation } from "../../utils/util"

const Chatbot = () => {
    const location = useLocation()
    const handleChatbotToggleRef = useRef()

    useEffect(() => {
        onChatBotToggleVisible()
    }, [location])

    const onChatBotToggleVisible = () => {
        if(handleChatbotToggleRef.current) {
            clearTimeout(handleChatbotToggleRef.current)
        }
        if(window?.Wotnot) {
            if(isPublishModeLocation(location)) {
                window.Wotnot.showWidget()
            } else {
                window.Wotnot.hideWidget()
            }
        } else {
            handleChatbotToggleRef.current = setTimeout(() => {
                onChatBotToggleVisible()
            }, 1000)
        }
    }



    return <>
    </>
}

export default Chatbot