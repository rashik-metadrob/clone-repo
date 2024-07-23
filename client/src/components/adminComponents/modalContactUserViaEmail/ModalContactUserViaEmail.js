import { Col, Input, Modal, Row, Spin, notification } from 'antd'
import ModalExitIcon from "../../../assets/images/project/modal-exit.svg"
import { useEffect, useState } from 'react'
import TextArea from 'antd/es/input/TextArea'
import { userApi } from '../../../api/user.api'
import _ from 'lodash'

const ModalContactUserViaEmail = ({
    open,
    user,
    onClose = () => {}
}) => {
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({})

    useEffect(() => {
        if(open) {
            setFormData({
                subject: "",
                content: ""
            })
        }
    }, [open])

    const handleFormDataChange = (type, value) => {
        setFormData({
            ...formData,
            [type]: value
        })
    }

    const handleSubmit = () => {
        if( formData.subject === undefined ){
            notification.warning({message: "Subject can't not be null!"})
            return
        } else if( formData.content === undefined ){
            notification.warning({message: "Subject can't not be null!"})
            return
        }

        const data = {
            email: user.email,
            ...formData
        }

        setIsLoading(true)
        userApi.sendEmail(data).then(rs => {
            notification.success({
                message: "Email is sent successfully!"
            })
            setIsLoading(false)
            onClose()
        }).catch(err => {
            notification.error({
                message: _.get(err, ['response', 'data', 'message'], `Can't send email!`)
            })
            setIsLoading(false)
        })
    }

    return <>
        <Modal
            open={open}
            width={550}
            footer={null}
            closeIcon={<img src={ModalExitIcon} alt="" />}
            destroyOnClose={true}
            closable={true}
            centered
            className="modal-admin-edit modal-edit-decorative"
            onCancel={() => {onClose()}}
        >
            <div className="modal-edit-decorative-content">
                <div className="title">
                    Contact user via Email
                </div>
                <Row gutter={[22, 8]} className="mt-[16px]">
                    <Col span={24}>
                        <Input placeholder={'To'} className="admin-form-input" value={user?.email} disabled/>
                    </Col>
                    <Col span={24}>
                        <Input placeholder={'Subject'} className="admin-form-input" value={formData?.subject} onChange={(e) => {handleFormDataChange('subject', e.target.value)}}/>
                    </Col>
                    <Col span={24}>
                        <TextArea 
                            placeholder={'Content'} 
                            className="admin-form-input" 
                            rows={4} 
                            maxLength={600}
                            value={formData?.content}
                            onChange={(e) => {handleFormDataChange('content', e.target.value)}}
                        />
                    </Col>
                </Row>
                <div className="flex items-center justify-center mt-[18px]">
                    <Spin spinning={isLoading}>
                        <div className="btn-save" onClick={handleSubmit}>
                            Save
                        </div>
                    </Spin>
                </div>
            </div>
        </Modal>
    </>
}
export default ModalContactUserViaEmail