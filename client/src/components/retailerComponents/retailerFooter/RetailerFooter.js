import { Input, Layout, Modal, Spin, notification } from 'antd';
import "./styles.scss"
import { useSelector } from 'react-redux';
import { getUser } from '../../../redux/appSlice';
import { useState } from 'react';
import { sendFeedback } from '../../../api/feedback.api';
import { Link } from 'react-router-dom'
import useDetectDevice from '../../../hook/useDetectDevice';
import ModalExitIcon from "../../../assets/images/project/modal-exit.svg"
import { isMobile } from 'react-device-detect';

const { Footer } = Layout;

const RetailerFooter = () => {
    const user = useSelector(getUser)
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [feedbackContent, setFeedbackContent] = useState("")
    const [email, setEmail] = useState("")
    const { deviceDetectCssClass } = useDetectDevice()

    const onSubmitFeedBack = () => {
        if(!user?.email && !email){
            user.error({
                message: "Email is required"
            })
        }
        if(!feedbackContent){
            user.error({
                message: "Feedback content is required"
            })
        }
        const data = {
            from: user?.email || email, 
            email: user?.email || user?.shopifyShopEmail,
            userName: user?.name || 'Undefined user',
            content: feedbackContent
        }
        setIsLoading(true)
        sendFeedback(data).then(rs => {
            notification.success({
                message: "Send success!"
            })
            setIsLoading(false)
            setIsOpenModal(false)
        }).catch(err => {
            notification.error({
                message: "Send fail!"
            })
            setIsLoading(false)
            setIsOpenModal(false)
        })
    }

    return <>
        <Footer className={`retailer-footer ${deviceDetectCssClass}`}>
            <div className='retailer-footer-container'>
                <Link className='text-copyright' to="https://www.metadrob.com" target='_blank'>
                    © 2024  Metadrob
                </Link>
                <div className='group-links'>
                    <Link className='link-item' to="https://www.metadrob.com/aboutus" target='_blank'>
                        About
                    </Link>
                    <Link className='link-item' to="https://www.metadrob.com/FAQ" target='_blank'>
                        Support
                    </Link>
                    <Link className='link-item' to="https://www.metadrob.com/ContactUs" target='_blank'>
                        Contact Us
                    </Link>
                    <div className='link-item' onClick={() => {setIsOpenModal(!isOpenModal)}}>
                        Give Us Feedback
                    </div>
                </div>
            </div>
        </Footer>
        <Modal
            open={isOpenModal}
            centered
            closable={isMobile}
            closeIcon={isMobile ? <img src={ModalExitIcon} alt="" /> : null}
            title={null}
            footer={null}
            className="modal-feedback-footer"
            onCancel={() => {setIsOpenModal(false)}}
        >
            <div className="text-project-name">
                Give Us Feedback
           </div>
           {!user?.email && <Input
                placeholder="Enter your email" 
                className="input-project-name mt-[12px] mt-[12px]"
                rows={4}
                value={email}
                onChange={(e) => {setEmail(e.target.value)}}
           />}
           <Input.TextArea
                placeholder="Enter your feedback" 
                className="input-project-name mt-[12px] mt-[12px]"
                rows={4}
                value={feedbackContent}
                onChange={(e) => {setFeedbackContent(e.target.value)}}
           />
           <div className="flex justify-center mt-[12px]" onClick={() => {onSubmitFeedBack()}}>
                <Spin spinning={isLoading}>
                    <button className="btn-save">
                        Send
                    </button>
                </Spin>
           </div>
        </Modal>
    </>
}
export default RetailerFooter