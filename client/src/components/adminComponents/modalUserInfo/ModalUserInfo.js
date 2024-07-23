import { Col, Modal, Row } from "antd"
import "./styles.scss"

import ExitIcon from "../../../assets/images/project/exit.svg"
import { useEffect, useMemo, useState } from "react"
import _ from "lodash"
import { getAssetsUrl } from "../../../utils/util"

import LocationIcon from "../../../assets/images/profile/location.svg"
import EmailIcon from "../../../assets/images/profile/email.svg"
import PhoneIcon from "../../../assets/images/profile/phone.svg"
import { DEFAULT_AVATAR, PERSONAL_QUESTIONS } from "../../../utils/constants"

const ModalUserInfo = ({
    open,
    user,
    onClose = () => {}
}) => {
    const [formData, setFormData] = useState({})

    useEffect(() => {
        const newData = _.pick(user, 'avatar', 'socialAvatar', 'name', 'phone', 'email', 'gender', 'address', 'personalInfo')
        setFormData(newData)
    }, [user])

    const planName = useMemo(() => {
        return _.get(user, ['membership'],  'Free Tier')
    }, [user])

    return <>
        <Modal
            open={open}
            closable={false}
            title={null}
            footer={null}
            onCancel={onClose}
            width="80%"
            className="modal-user-info"
        >
            <div className="modal-user-info-content">
                <div className="modal-title-container">
                    <div className="title-container">
                    </div>
                    <div className="close-container flex items-center gap-[5px]" onClick={() => {onClose()}}>
                        <img src={ExitIcon} alt="" />
                        <div className="text-close">Close</div>
                    </div>
                </div>
                <Row gutter={[26, 26]} className="px-[32px] py-[32px]">
                    <Col span={24} lg={6} md={8}>
                        <div className="profile-info-card">
                            <div className="profile-top-content">
                                <div className="flex justify-center avatar-container">
                                    <img 
                                        src={formData?.avatar ? getAssetsUrl(formData.avatar) : formData?.socialAvatar ? formData.socialAvatar : getAssetsUrl(DEFAULT_AVATAR)} 
                                        alt="" 
                                        className="w-[150px] h-[150px] rounded-[50%]"
                                    />
                                </div>
                                <div className="profile-name mt-[24px]">
                                    {formData.name}
                                </div>
                                <div className="flex items-center gap-[12px] mt-[12px]">
                                    <div className="plane-name">
                                        {planName}
                                    </div>
                                </div>
                            </div>
                            <div className="profile-bottom-content">
                                <div className="content-item">
                                    <div className="content-icon">
                                        <img src={LocationIcon} alt="" />
                                    </div>
                                    <div className="content-text">
                                        {formData?.address}
                                    </div>
                                </div>
                                <div className="content-item mt-[18px]">
                                    <div className="content-icon">
                                        <img src={EmailIcon} alt="" />
                                    </div>
                                    <div className="content-text">
                                        {formData?.email}
                                    </div>
                                </div>
                                <div className="content-item mt-[18px]">
                                    <div className="content-icon">
                                        <img src={PhoneIcon} alt="" />
                                    </div>
                                    <div className="content-text">
                                        {formData?.phone}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col span={24} lg={18} md={16}>
                        <Row gutter={[26, 26]} className="">
                            {
                                PERSONAL_QUESTIONS.map(el => (
                                    <>
                                        <Col span={24} md={12} key={el.id} className="h-auto">
                                            <div className="question-card h-full">
                                                <div className="title">
                                                    {el.title}
                                                </div>
                                                <div className="sub-title mt-[12px]">
                                                    {el.subTitle}
                                                </div>
                                                <div className="mt-[16px] preview-answer-text">
                                                    {
                                                        el.answer.filter(a => a.value === _.get(formData, ['personalInfo', el.personalInfoKey])).map(ans => (
                                                            <>
                                                                {ans.text}
                                                            </>
                                                        ))
                                                    }
                                                </div>
                                            </div>
                                        </Col>
                                    </>
                                ))
                            }
                        </Row>
                    </Col>
                </Row>
                
            </div>

        </Modal>
    </>
}

export default ModalUserInfo