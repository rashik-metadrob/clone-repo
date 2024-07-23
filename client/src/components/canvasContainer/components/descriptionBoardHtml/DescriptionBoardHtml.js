import { Html } from "@react-three/drei"
import { useFrame, useThree } from "@react-three/fiber"
import _ from "lodash"
import React, { useEffect, useMemo, useRef, useState } from "react"
import { Vector3 } from "three"
import "./styles.scss"

import DetailIcon from "../../../../assets/images/textures/icon-detail.svg"
import CopyIcon from "../../../../assets/images/textures/icon-copy.svg"
import DuplicateIcon from "../../../../assets/images/textures/icon-duplicate.svg"
import DuplicateActiveIcon from "../../../../assets/images/textures/icon-duplicate-active.svg"
import DeleteIcon from "../../../../assets/images/textures/icon-delete.svg"
import { CART_TYPES, CURRENCY_LIST, CURRENCY_TEXT, PRODUCT_TYPES, USER_ROLE } from "../../../../utils/constants"
import { useLocation, useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { getExchangeRate } from "../../../../redux/appSlice"
import { getAssetsUrl, htmlDecode, isPublishModeLocation } from "../../../../utils/util"
import useMeasure from "react-use-measure"
import global from "../../../../redux/global"
import usePublishStoreRole from "../../../../hook/usePublishStoreRole"

const v1 = new Vector3();
const DescriptionBoardHtml = ({
    productPosition = [0, 0, 0],
    item,
    onCloseDescriptionBoard = () => {},
    onAddToCart,
    visible,
    objectBox,
    onShowMoreInfo = () => {}
}) => {
    const location = useLocation()
    const [position, setPosition] = useState([0.5, 1, 0])
    const { camera } = useThree()
    const [shouldShow, setShouldShow] = useState(false)
    const boardRef = useRef()
    const [exchangeRateInfo, setExchangeRateInfo] = useState({
        value: 1,
        text: "$"
    })
    const exchangeRate = useSelector(getExchangeRate)
    const { publishRole } = usePublishStoreRole()
    const [ref, bounds] = useMeasure()
    const [transform, setTransform] = useState([0, 0])

    const isShowButtonAddToCart = useMemo(() => {
        if(global.IS_DROB_A){
            return false
        }
        if(item?.type === PRODUCT_TYPES.PRODUCTS 
            && isPublishModeLocation(location) 
            && publishRole === USER_ROLE.CUSTOMER 
            && visible
            && _.get(item, ['cartType'], CART_TYPES.METADROB_CART) !== CART_TYPES.WEB_LINK
        ){
            return true;
        } else {
            return false;
        }
    }, [item?.type, location, publishRole, visible])

    useEffect(() => {
        if(visible && objectBox){
            let topDirection = Math.abs(objectBox.max.y) >  Math.abs(objectBox.min.y) > 0 ? 1 : -1;
            let sideTranslate = Math.sqrt(Math.pow((objectBox.max.x - objectBox.min.x) / 2, 2) + Math.pow((objectBox.max.z - objectBox.min.z) / 2, 2))

            let cameraDirection = new Vector3(productPosition[0] - camera.position.x, productPosition[1] -  camera.position.y, productPosition[2] -  camera.position.z)
            cameraDirection.y = 1;
            cameraDirection.normalize();

            let cameraDirectionSide = cameraDirection.clone().cross(camera.up);
            cameraDirectionSide.normalize()
            cameraDirectionSide.y = 0;
            cameraDirectionSide.x = 0;
            cameraDirectionSide.z = 0;
            cameraDirectionSide.multiplyScalar(sideTranslate)

            let newPos = cameraDirectionSide.applyQuaternion(boardRef.current.parent.quaternion.clone().invert());

            boardRef.current.quaternion.copy(boardRef.current.parent.quaternion.clone().invert()).multiply(camera.quaternion);
            boardRef.current.position.set(newPos.x, topDirection * (Math.abs(objectBox.max.y - objectBox.min.y) / 2), newPos.z)

            setPosition([newPos.x, topDirection * (Math.abs(objectBox.max.y - objectBox.min.y) / 2), newPos.z])
            setShouldShow(true)
        }
    }, [visible, productPosition, objectBox, camera])

    useEffect(() => {
        if(item.displayCurrency && exchangeRate && exchangeRate[item.displayCurrency]){
            const info = exchangeRate[item.displayCurrency];
            
            setExchangeRateInfo({
                value: info.value,
                text: CURRENCY_TEXT[info.code]
            })
        }
    }, [item.displayCurrency, exchangeRate])

    const calculatePosition = (group, cam, size) => {
        const objectPos = v1.setFromMatrixPosition(group.matrixWorld);
        objectPos.project(camera);
        const widthHalf = size.width / 2;
        const heightHalf = size.height / 2;
        let x = objectPos.x * widthHalf + widthHalf
        let y =  -(objectPos.y * heightHalf) + heightHalf

        if(y - bounds.height / 2 < 0){
            y = y + Math.abs(y - bounds.height / 2) + 10
        } else if(y + bounds.height / 2 > window.innerHeight){
            y = y - Math.abs(y + bounds.height / 2 - window.innerHeight) + 10
        }

        if(x < -10){
            x = -10
        } else if(x + bounds.width > window.innerWidth){
            x = x - Math.abs(x + bounds.width - window.innerWidth) - 10
        }

        return [x , y];
    }

    if(!visible) {
        return <></>
    }

    return <>
        <group visible={visible && shouldShow} ref={boardRef}> 
        </group>

        <Html
            as="div"
            position={new Vector3(position[0], position[1], position[2])}
            className={`left-[10px] bottom-[10px] max-h-[100vh] overflow-y-auto h-auto min-w-[280px] bg-[#ffffff99] rounded-[10px] backdrop-blur-[9.75px] py-[11px] px-[16px]`}
            style={{
                transform: `translateY(calc(50% + ${transform[1]}px))`
            }}
            zIndexRange={[10, 0]}
            calculatePosition={calculatePosition}
            ref={ref}
        >
            <div className="flex flex-col">
                <div className="w-[250px] h-[210px] flex-[210px] rounded-[9px] bg-[white] md:overflow-hidden xl:overflow-hidden 2xl:overflow-hidden">
                    {
                        getAssetsUrl(item.image) ? <img className="w-full h-full object-contain" src={getAssetsUrl(item.image)} alt="" /> : <></>
                    }
                </div>
                <div className="font-inter text-[#000] leading-normal text-[18px] font-[900] text-left mt-[clamp(5px,1vh,8 px)]">
                    {
                        item.name
                    }
                </div>
                <div className="font-inter text-[14px] leading-normal font-[400] text-left mt-[clamp(5px,1vh,10px)] only-show-text-on-two-line" dangerouslySetInnerHTML={{__html: htmlDecode(item.description)}}>
                </div>
                <div className="font-inter text-[#0F0F0F] leading-[22px] text-[18px] font-[900] text-left mt-[clamp(5px,1vh,10px)]">
                {/* {`${exchangeRateInfo.text}${(_.get(item, ['lastPrice'], _.get(item, ['price'], 0)) * exchangeRateInfo.value).toFixed(2)}`} */}
                {`${_.get(CURRENCY_LIST.find(el => el.code === item?.displayCurrency), ['symbol'], CURRENCY_LIST[0].symbol)}${(_.get(item, ['lastPrice'], _.get(item, ['price'], 0)) * exchangeRateInfo.value).toFixed(2)}`}
                </div>
                <div className="w-full flex justify-between mt-[clamp(10px,2vh,21px)] items-center">
                    {
                        isShowButtonAddToCart ? <div className="px-[12px] py-[11px] bg-[#0248B0] rounded-[6px] text-[14px] leading-[10px] font-inter text-[#fff] cursor-pointer"
                            onClick={() => {
                                if (isShowButtonAddToCart) {
                                    onAddToCart(item)
                                }
                            }}>
                            Add to cart
                        </div> : <div></div>
                    }
                    <div className="text-[#251C1B] font-inter text-[14px] font-bold leading-[10px] pb-[4px] border-b-[2px] hover:border-[#0248B0] cursor-pointer" onClick={() => {
                        if (visible) {
                            onShowMoreInfo()
                        }
                    }}>
                        More Info
                    </div>
                </div>
            </div>
        </Html>
    </>
}
export default React.memo(DescriptionBoardHtml)