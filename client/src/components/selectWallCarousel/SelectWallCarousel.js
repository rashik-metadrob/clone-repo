import "./styles.scss"

import { Carousel } from '@trendyol-js/react-carousel';

import ArrowLeftIcon from "../../assets/images/project/arrow-left.svg"
import ArrowRightIcon from "../../assets/images/project/arrow-right.svg"
import { Vector3 } from "three";
import { useDispatch, useSelector } from "react-redux";
import { getIsViewerMode, getListCameras, updateListCameraInfo } from "../../redux/modelSlice";
import { useParams } from "react-router-dom";
import EditIcon from "../../assets/icons/EditIcon";
import { getProductById } from "../../api/product.api";
import { useEffect, useState } from "react";
import _ from "lodash";
import ModalEditWallInfo from "../modalEditWallInfo/ModalEditWallInfo";
import { updateProjectById } from "../../api/project.api";
import { notification } from "antd";
import useMeasure from "react-use-measure";

// This component render a select wall carousel
const SelectWallCarousel = ({
    onSelectWall = () => {},
    canEdit = true
}) => {
    const dispatch = useDispatch()
    // Get list camera from store
    const listCameras = useSelector(getListCameras)
    const [isShowModalEditWallInfo, setIsShowModalEditWallInfo] = useState(false)
    const [selectedWallIndex, setSelectedWallIndex] = useState(-1)
    const {id: projectId} = useParams()
    const isViewerMode = useSelector(getIsViewerMode)
    const [ref, bounds] = useMeasure()
    const [numOfShowSlices, setNumOfShowSlices] = useState(1)

    useEffect(() => {
        // Padding 40
        setNumOfShowSlices(Math.max(1, parseInt((bounds.width - 40) / 135)))
    }, [bounds])

    const onEditWallInfo = (index) => {
        setSelectedWallIndex(index)
        setIsShowModalEditWallInfo(true)
    }

    const onUpdateWallInfo = (info) => {
        setIsShowModalEditWallInfo(false)
        const savedWallInfo = listCameras.map(el => {
            return {
                name: el.name,
                assetId: el.assetId ? el.assetId : null
            }
        })

        if(selectedWallIndex > -1){
            savedWallInfo[selectedWallIndex] = info

            let data = {
                cameras: savedWallInfo
            }
            if(projectId !== 'unsaved'){
                updateProjectById(projectId, data).then(data => {
                    const newSavedCamerasData = _.get(data, "cameras", [])
                    dispatch(updateListCameraInfo(newSavedCamerasData))
                    notification.success({
                        message: "Update successfully!"
                    })
                })
            }
        }
    }

    const getCarouselMap = () => {
        return _.flatMap(listCameras, (item) => {
            return [item.name, item.thumnail]
        }).join('') + `${numOfShowSlices}`
    }

    return <>
        {listCameras && listCameras.length > 0 && <div className="select-wall-carousel" ref={ref}>
            <Carousel
                show={numOfShowSlices}
                slide={numOfShowSlices >= 2 ? 2 : 1}
                swiping={true}
                leftArrow={
                    <div className="arrow-container">
                        <button className="button-arrow">
                            <img src={ArrowLeftIcon} alt="" />
                        </button>
                    </div>
                }
                rightArrow={
                    <div className="arrow-container">
                        <button className="button-arrow">
                            <img src={ArrowRightIcon} alt="" />
                        </button>
                    </div>
                }
                infinite={true}
                responsive={true}
                key={getCarouselMap()}
            >
                {
                    listCameras.map((el, index) => (
                        <div key={`key-${index}`} className={`wall-container ${index === listCameras.length - 1 ? '' : 'has-border-right'}`}>
                            {/* Call onSelectWall to zoom to wall */}
                            <div className={`text-wall`} onClick={() => {onSelectWall(el)}}>
                                <span>{el.name}</span>
                            </div>
                            {!isViewerMode && canEdit && <div onClick={() => {onEditWallInfo(index)}}>
                                <EditIcon className={`edit-icon`} />
                            </div>}
                        </div>
                    ))
                }
        </Carousel>
    </div>}
    <ModalEditWallInfo
        open={isShowModalEditWallInfo}
        wallInfo={{
            name: _.get(listCameras, [selectedWallIndex, 'name'], `Wall ${selectedWallIndex + 1}`),
            thumnail: _.get(listCameras, [selectedWallIndex, 'thumnail'], "")
        }}
        onClose={() => {setIsShowModalEditWallInfo(false)}}
        onSuccess={(info) => {onUpdateWallInfo(info)} }
    />
    </>
}
export default SelectWallCarousel;