import { Col, Drawer, Row, Spin } from "antd"
import { forwardRef, useEffect, useState } from "react"
import "./styles.scss"
import ExitIcon from "../../assets/images/project/exit.svg"
import TextIcon from "../../assets/images/project/text-icon.svg"
import Lottie from "lottie-react"
import loadingAnimation from "../../assets/json/Add Products.json"
import textApi from "../../api/text.api"
import { getAssetsUrl } from "../../utils/util"
import { useParams } from "react-router-dom"
import { MODAL_STORE_EDITOR_WIDTH } from "../../utils/constants"
import { useSelector } from "react-redux"
import { getIsViewerMode } from "../../redux/modelSlice"

const DrawerText = forwardRef(({
    open,
    onClose = () => {},
    container,
    handleDragEnd = () => {},
}, ref) => {
    const [loading, setLoading] = useState(false)
    const [listText, setListText] = useState([])
    const isViewerMode = useSelector(getIsViewerMode)

    useEffect(() => {
        if(isViewerMode){
            return
        }
        setLoading(true)
        textApi.getPublicTexts({limit: 1000}).then(rs => {
            setListText(rs.results)
            setLoading(false)
        }).catch(err => {
            setLoading(false)
        })
    }, [])

    return <>
        <Drawer
            title={null}
            placement="left"
            closable={false}
            onClose={() => {onClose()}}
            open={open}
            getContainer={() => container}
            destroyOnClose={true}
            className="drawer-shared"
            width={MODAL_STORE_EDITOR_WIDTH}
            mask={false}
        >
            <div className="drawer-text-container">
                <div className="drawer-title-container">
                    <div className="title-container">
                        <div className="title">
                            <img src={TextIcon} alt="" />
                            Text
                        </div>
                        <div className="close-container flex items-center gap-[5px]" onClick={() => {onClose()}}>
                            <img src={ExitIcon} alt="" />
                            <div className="text-close">Close</div>
                        </div>
                    </div>
                </div>
                <Row className="text-list !ml-0 !mr-0 my-[24px]" gutter={[24, 24]} style={{flexGrow: "initial"}}>
                    <Col span={24}>
                        <div className="add-container">
                            {/* <div className="btn-add">
                                Add Brand Fonts
                            </div> */}
                             {/* mt-[25px] */}
                            <div className="text-font-combination">
                                Font Combinations
                            </div>
                        </div>
                    </Col>
                    {
                        loading && <Col span={24}>
                            <Spin spinning={true} className="loading-indicator-wrapper-no-translate" indicator={<Lottie animationData={loadingAnimation} />}> 
                            </Spin>
                        </Col>
                    }
                    {
                        !loading && listText && listText.map((el, index) => (
                            <Col span={12} key={el.id} className="h-[150px]">
                                <div className="text-item">
                                    <img src={getAssetsUrl(el.image)} alt="" draggable="true" onDragEnd={(e) => {handleDragEnd(e, el)}}/>
                                </div>
                            </Col>
                        ))
                    }
                </Row>
            </div>
        </Drawer>

        {/* <ModalTextEditor open={isShowModalAddText} onClose={() => {setIsShowModalAddText(false)}} onSave={onSave}/> */}
    </>
})

export default DrawerText;