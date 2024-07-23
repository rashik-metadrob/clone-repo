import { useCallback, useEffect, useRef, useState } from "react"
import { ACTION_KEYS } from "../utils/constants"
import { useDispatch, useSelector } from "react-redux";
import { getModelAction, setModelAction } from "../redux/modelSlice";

export const useTriggerAction = () => {

  const action = useSelector(getModelAction)

  const [actionKey, setActionKey] = useState(null);

  const dispatch = useDispatch()


  const keycodeRef = useRef(null)

  const onKeyDown = useCallback((e) => {
    if(!(e.target.tagName === "BODY")){
      return
    }

    if(keycodeRef.current !== action) {
      dispatch(setModelAction(null))
    }

    const keys = Object.keys(ACTION_KEYS);
    for(const key of keys) {
      if(+ACTION_KEYS[key] === +e.keyCode) {
        keycodeRef.current = +ACTION_KEYS[key]
        dispatch(setModelAction(+ACTION_KEYS[key]))

        return;
      }
    }
  }, [action, dispatch])

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown)

    return (() => {
      window.removeEventListener('keydown', onKeyDown)
    })

  }, [onKeyDown])

  useEffect(() => {
    setActionKey(action)
  }, [action])

  function onResetAction() {
    keycodeRef.current = null;
    dispatch(setModelAction(null))
  }

  function onSetAction(action) {
    if(keycodeRef.current !== action) {
      dispatch(setModelAction(null))
    }

    const keys = Object.keys(ACTION_KEYS);
    for(const key of keys) {
      if(+ACTION_KEYS[key] === +action) {
        keycodeRef.current = +ACTION_KEYS[key]
        dispatch(setModelAction(+ACTION_KEYS[key]))
        return;
      }
    }
  }


  return {
    actionKey,
    onResetAction,
    onSetAction
  }
}