import { Modal, Spin, notification } from "antd"
import ModalExitIcon from "../../../assets/images/project/modal-exit.svg"
import { useEffect, useMemo, useState } from "react"
import zohoApi from "../../../api/zoho.api"
import _ from "lodash"
import Lottie from "lottie-react"
import loadingAnimation from "../../../assets/json/Add Products.json"
import DownloadIcon from "../../../assets/images/admin/download-icon.png"
import './styles.scss'
import { Link } from "react-router-dom"

const ModalTicketDetail = ({
    open,
    onClose = () => {},
    item,
}) => {
    const [data, setData] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isDownloading, setIsDownloading] = useState(false)

    const attachments = useMemo(() => {
        return _.get(data, ['attachments'], [])
    }, [data])

    useEffect(() => {
        if(item?.id) {
            setData(null)
            setIsLoading(true)
            zohoApi.getTicketById(item.id).then(rs => {
                setData(rs)
                setIsLoading(false)
            }).catch(err => {
                setIsLoading(false)
                notification.error({
                    message: _.get(err, ['response', 'data', 'message'], `Can't get Ticket!`)
                })
            })
        }
    },[item?.id])

    const onDownLoadAttachment = (attachment, ticketId) => {
        setIsDownloading(true)
        zohoApi.downLoadAttachment(attachment.id, ticketId).then(rs => {
            setIsDownloading(false)
            if(rs) {
                const downloadUrl = URL.createObjectURL(rs);
                const a = document.createElement('a');
                a.href = downloadUrl;
                a.download = attachment.name;
                a.click();
                a.remove()
                URL.revokeObjectURL(downloadUrl);
            }
        }).catch(err => {
            setIsDownloading(false)
            notification.error({
                message: _.get(err, ['response', 'data', 'message'], `Can't download this attachment!`)
            })
        })
    }

    return <>
        <Modal
            open={open}
            width={794}
            footer={null}
            closeIcon={<img src={ModalExitIcon} alt="" />}
            destroyOnClose={true}
            closable={true}
            centered
            className="modal-admin-edit modal-ticket-detail"
            onCancel={() => {onClose()}}
        >
            <div className="modal-ticket-detail-container">
                <div className="title">
                    Ticket detail
                </div>
                {
                    isLoading && <>
                        <div className="min-h-[200px] flex justify-center items-center">
                            <Spin spinning={true} className="loading-indicator-wrapper" indicator={<Lottie animationData={loadingAnimation} />}>
                            </Spin>
                        </div>
                    </>
                }
                {
                    !isLoading && data && <>
                        <div className="modal-ticket-detail-label">
                            Subject
                        </div>
                        <div className="modal-ticket-detail-content mt-[8px]">
                            {_.get(data, ['subject'])}
                        </div>
                        <div className="modal-ticket-detail-label mt-[16px]">
                            Description
                        </div>
                        <div className="modal-ticket-detail-content min-h-[200px] mt-[8px]">
                            {_.get(data, ['description'])}
                        </div>
                        <div className="modal-ticket-detail-label mt-[16px]">
                            Attachments
                        </div>
                        <div className="attachments-container mt-[8px]">
                            {
                                attachments.length > 0 && attachments.map((el) => <>
                                    <div key={el.id} className="attachment-item">
                                        <div className="attachment-info">
                                            <div className="attachment-name">
                                                {el.name}
                                            </div>
                                            <div className="attachment-size">
                                                {_.round(+el.size / (1024 * 1024), 2)}MB
                                            </div>
                                        </div>
                                        <div className="attachment-action">
                                            <Spin spinning={isDownloading}>
                                                <button className="btn-action" onClick={() => {onDownLoadAttachment(el, item.id)}}>
                                                    <img src={DownloadIcon} alt="" />
                                                </button>
                                            </Spin>
                                        </div>
                                    </div>
                                </>)
                            }
                            {
                                attachments.length === 0 && <>
                                    <div className="attachment-none">
                                        No attachment
                                    </div>
                                </>
                            }
                        </div>
                        <div className="modal-ticket-detail-label mt-[16px]">
                            Zoho link
                        </div>
                        <div className="mt-[8px] zoho-link">
                            <Link className="zoho-link-content" to={data.webUrl} target="_blank">
                                {data.webUrl}
                            </Link>
                        </div>
                        <div className="zoho-link-description">
                            Enter this link to take more actions to the ticket like reply,...
                        </div>
                    </>
                }
            </div>
        </Modal>
    </>
}

export default ModalTicketDetail