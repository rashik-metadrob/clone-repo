import { Col, Input, Modal, Row, Spin, Tabs, notification } from "antd"
import "./styles.scss"
import ModalExitIcon from "../../assets/images/project/modal-exit.svg"
import UploadImage from "../uploadImage/UploadImage"
import { useEffect, useRef, useState } from "react"
import loadingAnimation from "../../assets/json/Add Products.json"
import Lottie from "lottie-react";
import { uploadFile } from "../../api/upload.api"
import { UPLOADS_FOLDER } from "../../utils/constants"
import UploadImageFromUploadedMedia from "../uploadImageFromUploadedMedia/UploadImageFromUploadedMedia"
import _ from "lodash"

const ModalEditWallInfo = ({
    open,
    wallInfo = {name: "", thumnail: ""},
    onClose = () => {},
    onSuccess = () => {},
}) => {
    // const uploadImageRef = useRef()
    const [wallName, setWallName] = useState()
    const [thumnail, setThumnail] = useState()
    const [selectedMediaInfo, setSelectedMediaInfo] = useState()
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if(open) {
            setSelectedMediaInfo(null)
        }
    }, [open])

    useEffect(() => {
        setWallName(wallInfo.name)
    },[wallInfo.name])

    useEffect(() => {
        setThumnail(wallInfo.thumnail)
    },[wallInfo.thumnail])

    const onSave = async () => {
        if(!wallName){
            notification.warning({
                message: "Wall name can't be null!"
            })
            return
        }

        const data = {
            name: wallName,
        }

        if(_.has(selectedMediaInfo, ['filePath'])){
            data.thumnail = _.get(selectedMediaInfo, ['filePath'])
            data.assetId = _.get(selectedMediaInfo, ['id'])
        }

        onSuccess(data)
    }

    return <>
        <Modal
            open={open}
            width={794}
            footer={null}
            closeIcon={<img src={ModalExitIcon} alt="" />}
            destroyOnClose={true}
            closable={true}
            className="modal-edit-wall-info"
            onCancel={() => {onClose()}}
        >
            <Spin spinning={isLoading} wrapperClassName="loading-indicator-wrapper" indicator={<Lottie animationData={loadingAnimation} />}>
                <div className="modal-edit-wall-info-content">
                    <Row gutter={[30, 30]} className={`!ml-0 !mr-0 !border-0 !p-0`}>
                        <Row gutter={[30, 30]} className="!ml-0 !mr-0 w-full">
                            <div className="text-title">
                                Edit wall info
                            </div>
                        </Row>
                        <Row gutter={[30, 30]} className="!ml-0 !mr-0 w-full">
                            <Col lg={24} md={24} sm={24} xs={24}>
                                <Input placeholder="Name" className="form-input" value={wallName} onChange={(e) => {setWallName(e.target.value)}} />
                            </Col>
                        </Row>
                        <Row gutter={[30, 30]} className="!ml-0 !mr-0 w-full">
                            <Col lg={24} md={24} sm={24} xs={24}>
                                <UploadImageFromUploadedMedia
                                    title={"Thumnail"}
                                    extraText=""
                                    placeholderFileName={_.has(selectedMediaInfo, ['filePath']) ? _.get(selectedMediaInfo, ['filePath']) : thumnail}
                                    onSelectMedia={(media) => {setSelectedMediaInfo(media)}}
                                />
                            </Col>
                        </Row>
                    </Row>
                    <Row gutter={[30, 30]} className="!ml-0 !mr-0 mt-[27px] justify-center pr-[30px]">
                        <button className="btn-save" onClick={onSave}>
                            Save
                        </button>
                    </Row>
                </div>
            </Spin>
        </Modal>
    </>
}
export default ModalEditWallInfo;