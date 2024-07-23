import { useLoader, useThree } from "@react-three/fiber";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { AudioLoader, AudioListener } from "three";

import { useLocation, useParams } from "react-router-dom";
import { getProjectById } from "../../../../api/project.api";
import _ from "lodash"
import VRProduct from "./VRProduct";
import { CART_TYPES, MODEL_BLOCK, PRODUCT_TYPES } from "../../../../utils/constants";
import VRPicture from "./VRPicture";
import VRGroupTextView from "./VRGroupTextView";
import { isShopifyEmbedded } from "@shopify/app-bridge/utilities";
import { isPublishModeLocation } from "../../../../utils/util";

const VRModelContainer = forwardRef(({
    onSelectObject = () => {},
    onAddToCart = () => {},
    updateObjectsLoadedStatus = () => {},
}, ref) => {
    const {id: projectId} = useParams()
    const [listProducts, setListProducts] = useState([])
    const [listTexts, setListTexts] = useState([])
    const { camera, gl, scene } = useThree();
    const location = useLocation()
    window.camera = camera
    window.scene = scene
    window.gl = gl;

    const needUpdateRef = useRef(true)

    const [listener] = useState(new AudioListener());
    const clickSoundTheme = useLoader(AudioLoader, `${process.env.REACT_APP_HOMEPAGE}/musics/click.wav`);
    const theClickSound = useRef()
    const walkSoundTheme = useLoader(AudioLoader, `${process.env.REACT_APP_HOMEPAGE}/musics/footsteps.mp3`);
    const theWalkSound = useRef()

    const objectsLoaderStatus = useRef([])

    useEffect(() => {
        return () => {
            updateObjectsLoadedStatus(false)
        }
    }, [])

    const onObjectLoaded = useCallback((index) => {
        objectsLoaderStatus.current[index] = true;
        
        if(listProducts.length > 0 && objectsLoaderStatus.current.length === listProducts.length && !objectsLoaderStatus.current.find(el => !el)){
            updateObjectsLoadedStatus(true)
        } else {
            updateObjectsLoadedStatus(false)
        }
    },[listProducts.length])

    useEffect(() => {
        theClickSound.current.setBuffer(clickSoundTheme);
        theClickSound.current.setLoop(false);
        theClickSound.current.autoplay = false;
        theClickSound.current.setVolume(1);
    }, [clickSoundTheme])

    useEffect(() => {
        theWalkSound.current.setBuffer(walkSoundTheme);
        theWalkSound.current.setLoop(true);
        theWalkSound.current.autoplay = false;
        theWalkSound.current.setVolume(1);
    }, [walkSoundTheme])

    useEffect(() => {
        getProjectById(projectId, isPublishModeLocation(location)).then(data => {
            // if(isShopifyEmbedded()){
            //     let prods = _.cloneDeep(data.listProducts || [])
            //     prods = prods.filter(el => {
            //         return el.type != PRODUCT_TYPES.PRODUCTS || 
            //             (el.type == PRODUCT_TYPES.PRODUCTS && (el.useThirdPartyCheckout || _.get(el, ['cartType'], CART_TYPES.METADROB_CART) == CART_TYPES.SHOPIFY_CART) && el.shopifyVariantMerchandiseId)
            //     })
            //     setListProducts(prods)
            // } else {
            setListProducts(_.cloneDeep(data.listProducts || []))
            // }
            setListTexts(_.cloneDeep(data.listTexts || []))
            needUpdateRef.current = false
        }).catch(err => {

        })
    }, [projectId])

    const handleSelectObject = (id) => {
        onSelectObject(id)

        if(id && theClickSound.current){
            theClickSound.current.play();
        }
    }

    useImperativeHandle(ref, () => ({
        playWalkingSound: () => {
            if(theWalkSound.current && !theWalkSound.current.isPlaying){
                theWalkSound.current.play();
            }
        },
        stopWalkingSound: () => {
            if(theWalkSound.current && theWalkSound.current.isPlaying){
                theWalkSound.current.pause();
            }
        },
        getListProducts: () => {
            return listProducts
        }
    }));

    return <>
        <group userData={{isSound: true}}>
            <audio ref={theClickSound} args={[listener]} />
            <audio ref={theWalkSound} args={[listener]}/>
        </group>
        {
            listProducts && listProducts.map((el, index) => {
                return <>
                    {
                        (!el.block || el.block === MODEL_BLOCK["3D"] ) && <VRProduct 
                            key={el.id} 
                            item={el} 
                            onSelectObject={(id) => {handleSelectObject(id)}}
                            onAddToCart={onAddToCart}
                            index={index}
                            onLoaded={onObjectLoaded}
                        />
                    }
                    {
                        (el.block && el.block === MODEL_BLOCK["2D"] ) && <VRPicture 
                            key={el.id} 
                            item={el} 
                            onSelectObject={(id) => {handleSelectObject(id)}}
                            onAddToCart={onAddToCart}
                            index={index}
                            onLoaded={onObjectLoaded}
                        />
                    }
                </>
            })
        }
        {
                listTexts && listTexts.map(el => (
                    <VRGroupTextView 
                        item={el} 
                        key={`Text-${el.id}`} 
                    />
                ))
            }
    </>
})
export default VRModelContainer;