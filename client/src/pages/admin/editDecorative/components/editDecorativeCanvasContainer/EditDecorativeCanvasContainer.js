import { Canvas } from '@react-three/fiber'
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { LinearToneMapping, Vector3 } from 'three';
import Lottie from "lottie-react";
import LoadingData from "../../../../../assets/json/LOGO_Loader_Anim.json"
import { AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';
import { useDispatch, useSelector } from 'react-redux';
import { getProductById } from '../../../../../api/product.api';
import DecorativeModel from '../decorativeModel/DecorativeModel';
import CameraControlAdminDecorative from '../cameraControlAdminDecorative/CameraControlAdminDecorative';
import { getDecorativeTemplateToneMappingExposure, setDecorativeSelectedMaterial } from '../../../../../redux/decorativeEditorSlice';

const EditDecorativeCanvasContainer = forwardRef(({
    onLoadMaterials = () => {},
    decorative
}, ref) => {
    const dispatch = useDispatch()
    const cameraControl = useRef()
    const decorativeRef = useRef()
    
    const [loadingPercent, setLoadingPercent] = useState(0)
    const templateToneMappingExposure = useSelector(getDecorativeTemplateToneMappingExposure)
    const [canPickObject, setCanPickObject] = useState(false)

    useImperativeHandle(ref, () => ({
        highlightMaterial: (name) => {
            if(decorativeRef.current){
                decorativeRef.current.highlightMaterial(name)
            }
        }
    }));

    const onSelectMaterial = (value) => {
        if(canPickObject){
            setCanPickObject(false)
            dispatch(setDecorativeSelectedMaterial(value))
        }
    }

    const onFitToObject = (box) => {
        if(cameraControl.current){
            cameraControl.current.fitToBox(box)
        }
    }

    return  <>
        { loadingPercent !== 100 &&
        <div className='w-full h-full absolute z-10 bg-[#FFFFFF]'>
            <div 
                className='w-[300px] h-[300px] absolute top-[50%] left-[50%] z-10'
                style={{
                    transform: 'translateX(-50%) translateY(-50%)'
                }}
            >
                <Lottie animationData={LoadingData} />
            </div>
        </div>}

        <button 
            className='absolute z-[5] right-[20px] top-[20px] rounded-[5px] px-[24px] py-[8px]'
            style={{
                background: !canPickObject ? '#FFFFFF' : '#A8A8A8'
            }}
            onClick={() => {setCanPickObject(!canPickObject)}}
        >
            Pick material
        </button>

        <Canvas
            camera={{ 
                fov: 45,
                position: new Vector3(0, 1.5, 5),
                near: 0.05,
                far: 8000
            }}
            gl={{
                antialias: false,
                alpha: true,
                preserveDrawingBuffer: true,
                toneMappingExposure: templateToneMappingExposure,
                toneMapping: LinearToneMapping,
            }}
            frameloop='always'
            performance={{
                current: 1,
                min: 0.1,
                max: 1,
                debounce: 200,
            }}
        >
            <AdaptiveDpr pixelated />
            <AdaptiveEvents />

            <CameraControlAdminDecorative ref={cameraControl} />

            {/* <ambientLight intensity={1} /> */}

            {
                decorative &&
                <DecorativeModel
                    decorative={decorative}
                    onLoading={(percent) => {
                        setLoadingPercent(percent)
                    }}
                    ref={decorativeRef}
                    onLoadMaterials={onLoadMaterials}
                    onSelectMaterial={onSelectMaterial}
                    onFitToObject={onFitToObject}
                />
            }
        </Canvas>
  </>
})
export default EditDecorativeCanvasContainer;