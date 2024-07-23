import { useThree } from "@react-three/fiber"
import { useXR } from "@react-three/xr"
import { forwardRef, useImperativeHandle } from "react"

const VRController = forwardRef((
  {},
  ref
) => {
  const {
    player
  } = useXR()

  const {
    camera
  } = useThree()

  useImperativeHandle(ref, () => ({
    onEndSection: () => {
      camera.fov = 45
      camera.updateProjectionMatrix()
    },
    onStartSection: () => {
      camera.fov = 45
      camera.updateProjectionMatrix()
    }
  }), []);
  
  return <>
  </>
})
export default VRController;