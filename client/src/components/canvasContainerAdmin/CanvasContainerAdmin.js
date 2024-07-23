import { Canvas } from '@react-three/fiber'
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProjectById } from '../../api/project.api';
import { LinearToneMapping, Vector3 } from 'three';
import RoomAdmin from './components/room/RoomAdmin';
import CameraControlsAdmin from './components/cameraControls/CameraControlsAdmin';
import Lottie from "lottie-react";
import LoadingData from "../../assets/json/LOGO_Loader_Anim.json"
import { AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';
import { useDispatch, useSelector } from 'react-redux';
import { getTemplateToneMappingExposure, setListCamera, setListSpawnPoints, setSelectedMaterial } from '../../redux/modelSlice';
import SelectWallCarousel from '../selectWallCarousel/SelectWallCarousel';

const CanvasContainerAdmin = forwardRef(({
    onLoadMaterials = () => {},
    canPickObject,
    setCanPickObject = () => {},
    setIsShowDrawerHdri = () => {}
}, ref) => {
    const dispatch = useDispatch()
    const {id: projectId} = useParams()
    const cameraControl = useRef()
    const roomRef = useRef()
    const [project, setProject] = useState()
    const [loadingPercent, setLoadingPercent] = useState(0)
    const templateToneMappingExposure = useSelector(getTemplateToneMappingExposure)

    useImperativeHandle(ref, () => ({
        highlightMaterial: (name) => {
            if(roomRef.current){
                roomRef.current.highlightMaterial(name)
            }
        }
    }));

    useEffect(() => {
        getProjectById(projectId).then(data => {
            setProject(data)
        }).catch(err => {

        })
    }, [projectId])

    const onSelectMaterial = (value) => {
        if(canPickObject){
            setCanPickObject(false)
            setIsShowDrawerHdri(false)
            dispatch(setSelectedMaterial(value))
        }
    }

    const onListSpawnPoints = (value) => {
        dispatch(setListSpawnPoints(value))
    }

    const onListCameras = (value) => {
        dispatch(setListCamera(value))
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

        <SelectWallCarousel onSelectWall={(el) => { cameraControl.current.selectWall(el)}}  canEdit={false}/>

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

            <CameraControlsAdmin ref={cameraControl}/>
            
            {project && <RoomAdmin 
                ref={roomRef}
                onLoading={(percent) => {
                    setLoadingPercent(percent)
                }}
                project={project}
                onListCameras={onListCameras}
                onLoadMaterials={onLoadMaterials}
                onSelectMaterial={onSelectMaterial}
                onListSpawnPoints={onListSpawnPoints}
            />}
        </Canvas>
  </>
})
export default CanvasContainerAdmin;