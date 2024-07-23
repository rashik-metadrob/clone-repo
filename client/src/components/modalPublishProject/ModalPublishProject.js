import { Col, Modal, Radio, Row, notification } from "antd"
import QRCode from "qrcode.react";
import HighLightCopyIcon from "../../assets/images/project/copy-highlight.svg"
import "./styles.scss"
import { useEffect, useState } from "react";
import useMeasure from "react-use-measure";
import { isMobile } from "react-device-detect";
import ModalExitIcon from "../../assets/images/project/modal-exit.svg"

const ModalPublishProject = ({
    isModalOpen,
    setIsModalOpen = () => {},
    projectId,
    title = "Publish success!"
}) => {
    const [currentRole, setCurrentRole] = useState("customer")
    const [url, setUrl] = useState("")
    const [ref, bounds] = useMeasure()

    useEffect(() => {
        onTabChanged({ target: { value: 'customer' } })
    }, [projectId])
    
    const downloadQRCode = () => {
        const qrCodeURL = document.getElementById('qrCodeEl')
          .toDataURL("image/png")
          .replace("image/png", "image/octet-stream");
        console.log(qrCodeURL)
        let aEl = document.createElement("a");
        aEl.href = qrCodeURL;
        aEl.download = "QR_Code.png";
        document.body.appendChild(aEl);
        aEl.click();
        document.body.removeChild(aEl);
    }

    const onCopyToClipboard = (value) => {
        navigator.clipboard.writeText(value)
        notification.success({
            message: "Copied!"
        })
        setIsModalOpen(false)
    }

    const generateEmbedUrl = () => {
        return `<div style="text-align:center"><iframe width="100%" height="512" src="${url}" title="Metadrob Virtual Store" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>`
    }

    const onTabChanged = (e) => {
        setCurrentRole(e.target.value)
        setUrl(`${window.location.protocol}//${window.location.hostname}${window.location.port ? ':' + window.location.port : ''}${process.env.REACT_APP_HOMEPAGE}/publish/${e.target.value}/${projectId}`)
    }

    return <>
        <Modal 
            title={null}
            footer={null}
            open={isModalOpen} 
            closable={isMobile}
            closeIcon={isMobile ? <img src={ModalExitIcon} alt="" /> : null}
            onCancel={() => {setIsModalOpen(false)}}
            className="modal-project-name modal-publish-project"
            centered
            width={979}
        >
            <Row gutter={[48, 48]}>
                <Col span={24} lg={14} xl={14} xxl={14} className="tab-divider">
                    {title && <div className="font-inter font-[700] text-[36px] text-themes">
                        {title}
                    </div>}
                    <div className="font-inter font-[400] text-[24px] text-themes">
                        You can send this link to customer.
                    </div>
                    {/* Link */}
                    <div className="flex justify-center py-[10px] mt-[54px]">
                        <div style={{ width: '100%'}}>
                            <div className="flex justify-between">
                                <div className="font-inter font-[500] text-[16px] text-themes">Sharable link</div>
                                <div className="cursor-pointer flex gap-[4px] flex-nowrap items-center" onClick={() => {onCopyToClipboard(url)}}>
                                    <img src={HighLightCopyIcon} alt="" />
                                    <span className="font-inter text-[#00F6FF] text-[12px] font-[500]">Copy</span>
                                </div>
                            </div>
                            <textarea className="text-[#626262] font-[500] mt-[4px] rounded-[5px] w-full h-[80px] text-[16px] py-[10px] px-[6px] border-[1px] border-[#000]" value={url}></textarea>
                        </div>
                    </div>
                    {/* Embeded code */}
                    <div className="flex justify-center py-[10px] mt-[12px]">
                    <div style={{ width: '100%'}}>
                        <div className="flex justify-between">
                            <div className="font-inter font-[500] text-[16px] text-themes">Embeded code</div>
                            <div className="cursor-pointer flex gap-[4px] flex-nowrap items-center" onClick={() => {onCopyToClipboard(generateEmbedUrl())}}>
                                <img src={HighLightCopyIcon} alt="" />
                                <span className="font-inter text-[#00F6FF] text-[12px] font-[500]">Copy</span>
                            </div>
                        </div>
                        <textarea className="text-[#626262] font-[500] mt-[4px] rounded-[5px] w-full h-[140px] text-[16px] py-[10px] px-[6px] border-[1px] border-[#000]" value={generateEmbedUrl()}></textarea>
                        </div>
                    </div>
                </Col>
                <Col span={24} lg={10} xl={10} xxl={10}>
                    <div className="flex justify-center items-center mt-[12px] publish-type-radio">
                        <Radio.Group 
                            options={[
                                {
                                    label: 'For customer',
                                    value: 'customer'
                                },
                                {
                                    label: 'For sale',
                                    value: 'sale'
                                }
                            ]} 
                            onChange={onTabChanged} 
                            value={currentRole} 
                            optionType="button" 
                            buttonStyle="solid"
                        />
                    </div>
                    <div className="qr-container flex flex-col justify-center py-[24px] gap-[5px]" ref={ref}>
                        <div className="flex justify-between gap-[10px]">
                            <span className="font-[300] font-inter text-[16px] text-themes">
                                Download QR code to share <br />as image
                            </span>
                            <span className="cursor-pointer font-[300] text-[16px] font-inter text-[#00F6FF] underline" onClick={downloadQRCode}>
                                Download
                            </span>
                        </div>
                        <div className="p-[10px] bg-white rounded-[5px] relative">
                            <QRCode
                                id="qrCodeEl"
                                size={bounds.width - 20}
                                value={url}
                            />
                        </div>
                    </div>
                </Col>
            </Row>
        </Modal>
    </>
}
export default ModalPublishProject