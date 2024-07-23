import { Physics } from "@react-three/cannon";
import { Player } from "../player/Player";
import CameraControls from "../cameraControls/CameraControls";
import { useGLTF } from "@react-three/drei";
import { useEffect, useState } from "react";
import { useThree } from "@react-three/fiber";
import { loadMultiGlbModels } from "../../../../utils/util";

const CanvasControl = ({
    loadingPercent,
    isPreviewMode,
    playerRef,
    onExitPointerControl,
    onShowSpinner,
    onPlayWalkingSound,
    onStopWalkingSound,
    cameraControl,
    onSetUserIP = () => {},
    onSelectObject = () => {},
    project,
    onSetCanBeJoinMultiplePlayer = (value) => {}
}) => {
    const { camera, gl } = useThree();
    window.gl = gl
    return <>
        {loadingPercent === 100 && isPreviewMode && 
            <Player
                ref={playerRef}
                onExitPointerControl={onExitPointerControl} 
                onShowSpinner={onShowSpinner}
                onPlayWalkingSound={() => {onPlayWalkingSound()}}
                onStopWalkingSound={() => {onStopWalkingSound()}}
                onSetUserIP={onSetUserIP}
                project={project}
                onSelectObject={onSelectObject}
                onSetCanBeJoinMultiplePlayer={onSetCanBeJoinMultiplePlayer}
            />
        }
        {!isPreviewMode && <CameraControls ref={cameraControl} />}
    </>
}

export default CanvasControl;