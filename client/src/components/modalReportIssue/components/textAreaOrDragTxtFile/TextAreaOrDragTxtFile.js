import { notification } from "antd"
import TextArea from "antd/es/input/TextArea"

const TextAreaOrDragTxtFile = ({
    value,
    onChange = () => {}
}) => {
    const onDropFile = (e) => {
        e.preventDefault()

        if(e.dataTransfer.files.length > 0){
            const file = e.dataTransfer.files[0]
            if(file.type === "text/plain"){
                let fr = new FileReader()
  
                fr.readAsText(file)
                fr.onload = () => {
                    onChange(fr.result)
                }
                fr.onerror = () => {
                    notification.warning({
                        message: "Can't read this file!"
                    })
                }
            } else {
                notification.warning({
                    message: 'Drop .txt file in here!'
                })
            }
        }
    }

    return <>
        <TextArea
            value={value}
            onChange={(e) => {onChange(e.target.value)}}
            rows={10}
            role=""
            placeholder="Describe your issue here or drop .txt file in here"
            className="issue-content-input"
            onDrop={(e) => {
                onDropFile(e)
            }}
        />
    </>
}
export default TextAreaOrDragTxtFile