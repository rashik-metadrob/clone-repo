import { Col, Row, Spin, notification } from "antd"
import './styles.scss'
import { useEffect, useState } from "react"
import loadingAnimation from "../../assets/json/Add Products.json"
import Lottie from "lottie-react"
import invitationApi from "../../api/invitation.api"
import _ from "lodash"
import { useNavigate } from "react-router-dom"
import routesConstant from "../../routes/routesConstant"

const Invitation = () => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true)
    const [errText, setErrText] = useState('')
    const [invitation, setInvitation] = useState()

    useEffect(() => {
        const code = new URLSearchParams(window.location.search).get(
            "code"
        );
        if(!code){
            notification.warning({
                message: "Can't find your invitation code."
            })
            return
        }

        invitationApi.getInvitation(code).then(rs => {
            setInvitation(rs)
            setIsLoading(false)
        }).catch(err => {
            setErrText(_.get(err, ['response', 'data', 'message'], `Can't get invitation data!`))
            setIsLoading(false)
        })
    }, [])

    const onAcceptInvitation = () => {
        const code = new URLSearchParams(window.location.search).get(
            "code"
        );

        invitationApi.acceptInvitation(code).then(rs => {
            notification.success({
                message: 'Accepted successfully!'
            })
            if(_.get(rs, ['role', 'isSuperAdminRole'])) {
                navigate(routesConstant.adminLogin.path)
            } else {
                navigate(routesConstant.login.path)
            }
        }).catch(err => {
            notification.error({
                message: _.get(err, ['response', 'data', 'message'], `Can't accept this invitation!`)
            })
        })
    }

    const onRejectInvitation = () => {
        const code = new URLSearchParams(window.location.search).get(
            "code"
        );

        invitationApi.rejectInvitation(code).then(rs => {
            notification.success({
                message: 'Rejected successfully!'
            })
            navigate(routesConstant.login.path)
        }).catch(err => {
            notification.error({
                message: _.get(err, ['response', 'data', 'message'], `Can't reject this invitation!`)
            })
        })
    }

    return <>
        <Row className="invitation-page">
            <Col span={24} className="invitation-container">
                {
                    isLoading && <Spin spinning={true} className="loading-indicator-wrapper-center" indicator={<Lottie animationData={loadingAnimation} />}>
                    </Spin>
                }
                {
                    !isLoading && <>
                        {
                            invitation && <>
                                <div className="text-title">
                                    You have been invited to be come {invitation.roleName} on Metadrob. Earlier access to features will be revoked. Please confirm your invitation!
                                </div>
                                <div className="flex flex-row gap-[12px] items-center mt-[28px]">
                                    <button className="btn-accept" onClick={() => {onAcceptInvitation()}}>
                                        <span>Accept</span>
                                    </button>
                                    <button className="btn-reject" onClick={() => {onRejectInvitation()}}>
                                        <span>Reject</span>
                                    </button>
                                </div>
                            </>
                        }
                        {
                            !invitation && <>
                                <div className="text-title">
                                    {errText || 'Sorry, we were unable to find that invitation.'}
                                </div>
                                <div className="please-text mt-[8px]">
                                    Please use main menu or choose from category below.
                                </div>
                            </>
                        }
                    </>
                }
            </Col>
        </Row>
    </>
}
export default Invitation