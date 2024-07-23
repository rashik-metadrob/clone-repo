import { useCallback, useEffect, useState } from "react"
import { SHIFT_KEY_CODE } from "../utils/constants"
import { useDispatch, useSelector } from "react-redux"
import { getIsRunning, setIsRunning } from "../redux/modelSlice"

export const useKeepRunningAction = () => {
  const selectorRunning = useSelector(getIsRunning)
  const [isRunning, setIsRunningState] = useState(false)

  const dispatch = useDispatch()

  const onKeyDown = useCallback((e) => {
    
    if(e.keyCode !== SHIFT_KEY_CODE) return;

    if(selectorRunning) {
      return;
    }
    dispatch(setIsRunning(true))
  }, [dispatch, selectorRunning])

  const onKeyUp = useCallback((e) => {
    if(e.keyCode !== SHIFT_KEY_CODE) return;

    if(!selectorRunning) {
      return;
    }

    dispatch(setIsRunning(false))
  }, [dispatch, selectorRunning])

  useEffect(() => {
    setIsRunningState(selectorRunning)
  }, [selectorRunning])

  useEffect(() => {
    
    window.addEventListener('keydown', onKeyDown)

    return (() => {
      window.removeEventListener('keydown', onKeyDown)
    })

  }, [onKeyDown])

  useEffect(() => {
    window.addEventListener('keyup', onKeyUp)

    return (() => {
      window.removeEventListener('keyup', onKeyUp)
    })
  }, [onKeyUp])

  function onChangeKeepRunning(value) {
    dispatch(setIsRunning(value))
  }

  return {
    isRunning,
    onChangeKeepRunning,
  }
}