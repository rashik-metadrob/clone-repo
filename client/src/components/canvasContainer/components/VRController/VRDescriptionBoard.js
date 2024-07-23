import { Text } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import { Box3, ExtrudeGeometry, Shape, ShapeGeometry, Vector2, Vector3 } from "three";

import fonts from "../descriptionBoard/fonts";
import { Interactive } from "@react-three/xr";
import { useThree } from "@react-three/fiber";
import { useSelector } from "react-redux";
import { getExchangeRate } from "../../../../redux/appSlice";
import { CURRENCY_LIST, CURRENCY_TEXT, PRODUCT_TYPES, PUBLISH_ROLE, USER_ROLE } from "../../../../utils/constants";
import { useLocation, useParams } from "react-router-dom";
import { isPublishModeLocation, roundedRect } from "../../../../utils/util";
import _ from "lodash";
import usePublishStoreRole from "../../../../hook/usePublishStoreRole";

const VRDescriptionBoard = ({
    productPosition = [0, 0, 0],
    item,
    onCloseDescriptionBoard = () => {},
    onAddToCart,
    visible,
    objectBox
}) => {
    const location = useLocation()
    const { publishRole } = usePublishStoreRole()
    const [exchangeRateInfo, setExchangeRateInfo] = useState({
        value: 1,
        text: "$"
    })
    const exchangeRate = useSelector(getExchangeRate)
    const boardRef = useRef()

    const textNameRef = useRef()
    const textPriceRef = useRef()
    const textDiscountRef = useRef()
    const textDescription = useRef()
    const groupPriceRef = useRef()

    const [shapeGeo, setShapeGeo] = useState()
    const [shapeButtonGeo, setShapeButtonGeo] = useState()

    const { camera } = useThree()

    const [position, setPosition] = useState([0.5, 1, 0])

    const isShowPrice = useMemo(() => {
        if(item?.type === PRODUCT_TYPES.PRODUCTS){
            return true;
        } else {
            return false;
        }
    }, [item?.type])
    const isShowButtonAddToCart = useMemo(() => {
        if(item?.type === PRODUCT_TYPES.PRODUCTS && isPublishModeLocation(location) && publishRole === USER_ROLE.CUSTOMER){
            return true;
        } else {
            return false;
        }
    }, [item?.type, location, publishRole])

    const handleBoardLayout = () => {
        if( textDescription.current && textNameRef.current){
            textDescription.current.geometry.computeBoundingBox()
            const desBox = textDescription.current.geometry.boundingBox
            const desHeight = desBox.max.y - desBox.min.y;

            textNameRef.current.geometry.computeBoundingBox()
            const nameBox = textNameRef.current.geometry.boundingBox;
            const nameHeight = nameBox.max.y - nameBox.min.y;

            let priceHeight = 0;
            if(groupPriceRef.current && textPriceRef.current && textDiscountRef.current){
                textPriceRef.current.geometry.computeBoundingBox()
                const priceBox = textPriceRef.current.geometry.boundingBox;
                priceHeight = priceBox.max.y - priceBox.min.y;

                groupPriceRef.current.position.y = desHeight + 0.05;
                textNameRef.current.position.y = desHeight + priceHeight + 0.1;
            } else {
                textNameRef.current.position.y = desHeight + 0.05;
            }


            let width = 1.7;
            let groupButtonHeight = 0.3
            let height = desHeight + priceHeight + nameHeight + 0.2 + groupButtonHeight + 0.1;

            const roundedRectShape = new Shape();
            roundedRect( roundedRectShape, 0, 0, width, height, 0.1 );
            let shapeGeo = new ShapeGeometry(roundedRectShape);
            setShapeGeo(shapeGeo)

            const roundedRectButtonShape = new Shape();
            roundedRect( roundedRectButtonShape, 0, 0, 0.5, 0.2, 0.05 );
            let shapeButtonGeo = new ShapeGeometry(roundedRectButtonShape);
            setShapeButtonGeo(shapeButtonGeo)
        }
    }

    useEffect(() => {
        if(item.displayCurrency && exchangeRate && exchangeRate[item.displayCurrency]){
            const info = exchangeRate[item.displayCurrency];
            
            setExchangeRateInfo({
                value: info.value,
                text: CURRENCY_TEXT[info.code]
            })
        }
    }, [item.displayCurrency, exchangeRate])

    useEffect(() => {
        if(visible && objectBox){
            let topDirection = Math.abs(objectBox.max.y) >  Math.abs(objectBox.min.y) > 0 ? 1 : -1;
            let sideTranslate = Math.sqrt(Math.pow((objectBox.max.x - objectBox.min.x) / 2, 2) + Math.pow((objectBox.max.z - objectBox.min.z) / 2, 2))

            let cameraPosition = new Vector3();
            camera.getWorldPosition(cameraPosition)
            let cameraDirection = new Vector3(productPosition[0] - cameraPosition.x, productPosition[1] -  cameraPosition.y, productPosition[2] -  cameraPosition.z)
            cameraDirection.y = 1;
            cameraDirection.normalize();

            let cameraDirectionSide = cameraDirection.clone().cross(camera.up);
            cameraDirectionSide.normalize()
            cameraDirectionSide.y = 0;
            cameraDirectionSide.multiplyScalar(sideTranslate)

            let newPos = cameraDirectionSide.applyQuaternion(boardRef.current.parent.quaternion.clone().invert());
            setPosition([newPos.x, topDirection * (Math.abs(objectBox.max.y - objectBox.min.y) + 0.1), newPos.z])

            boardRef.current.quaternion.copy(boardRef.current.parent.quaternion.clone().invert()).multiply(camera.quaternion);
        }
    }, [visible, productPosition, objectBox])
    
    return <>
        <group position={position} visible={visible} ref={boardRef}>
            {
                shapeGeo
                && <mesh position={[- 0.1, - 0.1, - 0.02]} renderOrder={999}>
                    <primitive object={shapeGeo} attach="geometry" />
                    <meshBasicMaterial color="#FFFFFF" transparent opacity={1} depthTest={false} depthWrite={false}/>
                </mesh>
            }
            <group position={[0, 0.25, 0]}>
                <Text
                    ref={textNameRef}
                    text={item.name}
                    fontSize={0.11}
                    maxWidth={1.5}
                    lineHeight={1}
                    letterSpacing={0}
                    textAlign="justify"
                    anchorX="left"
                    anchorY="bottom"
                    font={fonts.InterBold}
                    onSync={() => {handleBoardLayout()}}
                    renderOrder={1000}
                >
                    <meshPhongMaterial attach="material" color="#000000" depthTest={false} depthWrite={false}/>
                </Text>
                {isShowPrice && <group ref={groupPriceRef}>
                    <Text
                        ref={textPriceRef}
                        text={`${exchangeRateInfo.text}${(item.price * exchangeRateInfo.value).toFixed(2)}`}
                        fontSize={0.08}
                        maxWidth={0.75}
                        lineHeight={1}
                        letterSpacing={0}
                        textAlign="left"
                        anchorX="left"
                        anchorY="bottom"
                        font={fonts.InterBold}
                        onSync={() => {handleBoardLayout()}}
                        renderOrder={1000}
                    >
                        <meshPhongMaterial attach="material" color="#000000" depthTest={false} depthWrite={false}/>
                    </Text>
                    <Text
                        ref={textDiscountRef}
                        position={[0.5, 0, 0]}
                        // text={`${(item.lastPrice * exchangeRateInfo.value).toFixed(2)}${exchangeRateInfo.text}`}
                        text={`${(item.lastPrice * exchangeRateInfo.value).toFixed(2)}${_.get(CURRENCY_LIST.find(el => el.code === item?.displayCurrency), ['symbol'], CURRENCY_LIST[0].symbol)}`}
                        fontSize={0.08}
                        maxWidth={0.75}
                        lineHeight={1}
                        letterSpacing={0}
                        textAlign="left"
                        anchorX="left"
                        anchorY="bottom"
                        font={fonts.InterBold}
                        onSync={() => {handleBoardLayout()}}
                        visible={item.lastPrice !== item.price}
                        renderOrder={1000}
                    >
                        <meshPhongMaterial attach="material" color="#000000" depthTest={false} depthWrite={false}/>
                    </Text>
                </group>}
                <Text
                    ref={textDescription}
                    text={item.description}
                    fontSize={0.08}
                    maxWidth={1.5}
                    lineHeight={1}
                    letterSpacing={0}
                    textAlign="justify"
                    anchorX="left"
                    anchorY="bottom"
                    font={fonts.InterRegular}
                    onSync={() => {handleBoardLayout()}}
                    renderOrder={1000}
                >
                    <meshPhongMaterial attach="material" color="#383838" depthTest={false} depthWrite={false}/>
                </Text>
            </group>
            <group>
                <Interactive
                    onSelect={() => {
                        if(visible){
                            onCloseDescriptionBoard()
                        }
                    }}
                >
                    <mesh 
                        position={[!(isShowButtonAddToCart) ? 0 : 0.55, 0, - 0.01]} 
                        onPointerOver={() => {
                            if(visible){
                                document.body.style.cursor = "pointer"
                            }
                        }}
                        onPointerLeave={() => {
                            document.body.style.cursor = "default"
                        }}
                        onClick={() => {
                            if(visible){
                                onCloseDescriptionBoard()
                            }
                        }}
                        renderOrder={1001}
                    >
                        {shapeButtonGeo && <primitive object={shapeButtonGeo} attach="geometry" />}
                        <meshBasicMaterial color="#28C4B7" depthTest={false} depthWrite={false}/>
                    </mesh>
                </Interactive>
                
                {isShowButtonAddToCart && 
                    <Interactive
                        onSelect={() => {
                            if(visible){
                                onAddToCart(item)
                            }
                        }}
                    >
                        <mesh 
                            position={[0, 0, - 0.01]}
                            onPointerOver={() => {
                                if(visible){
                                    document.body.style.cursor = "pointer"
                                }
                            }}
                            onPointerLeave={() => {
                                document.body.style.cursor = "default"
                            }}
                            onClick={() => {
                                if(visible){
                                    onAddToCart(item)
                                }
                            }}
                            renderOrder={1001}
                        >
                            {shapeButtonGeo && <primitive object={shapeButtonGeo} attach="geometry" />}
                            <meshBasicMaterial color="#717CE4" depthTest={false} depthWrite={false}/>
                        </mesh>
                </Interactive>
                }

                {isShowButtonAddToCart && <Text
                    text={"Add To Cart"}
                    fontSize={0.07}
                    maxWidth={0.5}
                    lineHeight={1}
                    letterSpacing={0}
                    textAlign="justify"
                    anchorX="center"
                    anchorY="middle"
                    position={[0.25, 0.1, 0]}
                    font={fonts.InterBold}
                    renderOrder={1002}
                >
                    <meshPhongMaterial attach="material" color="#FFFFFF" depthTest={false} depthWrite={false}/>
                </Text>}

                <Text
                    text={"Close"}
                    fontSize={0.07}
                    maxWidth={0.5}
                    lineHeight={1}
                    letterSpacing={0}
                    textAlign="justify"
                    anchorX="center"
                    anchorY="middle"
                    position={[!(isShowButtonAddToCart) ? 0.25 : 0.8, 0.1, 0]}
                    font={fonts.InterBold}
                    renderOrder={1002}
                >
                    <meshPhongMaterial attach="material" color="#FFFFFF" depthTest={false} depthWrite={false}/>
                </Text>
            </group>
            
        </group>
    </>
}
export default VRDescriptionBoard;