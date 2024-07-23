import { Modal } from 'antd'
import './styles.scss'
import RetailerStorageAnalysisCard from '../retailerStorageAnalysisCard/RetailerStorageAnalysisCard'
import ModalExitIcon from "../../../assets/images/project/modal-exit.svg"
import { isMobile } from 'react-device-detect'

const ModalRetailerStorageAnalysis = ({
    open,
    onClose = () => {}
}) => {

    return <>
        <Modal
            open={open}
            centered
            closable={isMobile}
            closeIcon={isMobile ? <img src={ModalExitIcon} alt="" /> : null}
            title={null}
            footer={null}
            width={768}
            className="modal-retailer-storage-analysis"
            onCancel={() => {onClose()}}
        >
            <RetailerStorageAnalysisCard isShowButtonManage={false}/>
        </Modal>
    </>
}

export default ModalRetailerStorageAnalysis