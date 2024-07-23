import { Input, Modal } from "antd"
import { useEffect, useRef, useState } from "react"
import "./styles.scss"
import closeIcon from "../../assets/images/project/close.svg"
import TextArea from "antd/es/input/TextArea"

const ModalProjectName = ({
    open,
    onClose = () => {},
    onOk = () => {},
    placeholder = "Enter Here...",
    title = "Project Name"
}) => {
    const projectNameRef = useRef()
    const timeOut = useRef()
    const [projectName, setProjectName] = useState()
    useEffect(() => {
        if(open){
            timeOut.current = setTimeout(() => {
                if(projectNameRef.current){
                    projectNameRef.current.focus()
                }
            }, 200)
        }

        return () => {
            clearTimeout(timeOut.current)
        }
    }, [open])

    return <>
        <Modal 
            title={null}
            footer={null}
            open={open} 
            closable={true}
            onCancel={() => {onClose()}}
            className="retailer-modal-project-name"
            closeIcon={<img src={closeIcon} alt="" />}
            centered
        >
           <div className="text-project-name">
                {title}
           </div>
           <div className="text-description mt-[6px]">
                Enter your project name here !
           </div>
            <TextArea 
                ref={projectNameRef}
                placeholder={placeholder}
                className="input-project-name mt-[22px]" 
                autoSize={{
                    minRows: 3,
                    maxRows: 3,
                }}
                value={projectName}
                onChange={(e) => {setProjectName(e.target.value)}}
                onPressEnter={() => {onOk(projectName)}}
            />
            <div className="flex justify-center mt-[34px]">
                <button className="btn-save" onClick={() => {onOk(projectName)}}>
                    Save
                </button>
           </div>
        </Modal>
    </>
}
export default ModalProjectName