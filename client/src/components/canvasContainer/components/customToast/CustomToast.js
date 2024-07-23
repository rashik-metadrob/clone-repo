import { forwardRef, useCallback, useImperativeHandle, useState } from "react"
import "./styles.scss"
import { uuidv4 } from "../../../../utils/util"
import _ from "lodash"

const CustomToast = forwardRef(({

}, ref) => {

    const [listToast, setListToast] = useState([])

    const deleteToast = useCallback(id => {
        if(listToast){
            setListToast((prevToasts) => prevToasts.filter(el => el.id !== id))
        }
    }, [listToast])
    
    useImperativeHandle(ref, () => ({
        notification: (data) => {
            if(listToast.length < 3){
                setListToast(prevToasts => [...prevToasts, data])
            } else {
                setListToast(prevToasts => [...prevToasts.slice(listToast.length - 2, listToast.length), data])
            }

            setTimeout(
                function(){
                    deleteToast(data.id)
                }, 
            3000)
        }
    }), [deleteToast, listToast])

    const handleButtonAction = (el) => {
        if(el.type === "Close"){
            deleteToast(el.id)
        }
    }

    return <>
        <div className="notification-container">
            {
                listToast.map(el => (
                    <div key={el.id} className="notification-item">
                        {el.image && <div className="image-product-container">
                            <img src={el.image} alt="" />
                        </div>}
                        <div className="notification-content">
                            {el.content}
                        </div>
                        <button className="btn-action" onClick={el.buttonAction ? el.buttonAction : () => {handleButtonAction(el)}}>
                            {el.actionText}
                        </button>
                    </div>
                ))
            }
            
        </div>
    </>
})
export default CustomToast