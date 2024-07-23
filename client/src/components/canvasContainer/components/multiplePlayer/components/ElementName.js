import React, { useMemo } from "react"
import { Sprite, SpriteMaterial, Vector2, Texture, NearestFilter, LinearMipMapLinearFilter } from "three"

const ElementName = ({
    name
}) => {
    const spriteText = useMemo(() => {
        // return  new SpriteText2D(name, { align: new Vector2(0, 0), font: '30px Arial', fillStyle: '#000000'})
        let parameters = undefined;
        if ( parameters === undefined ) parameters = {};
        let fontface = parameters.hasOwnProperty("fontface") ? parameters["fontface"] : "Arial";
        let fontsize = parameters.hasOwnProperty("fontsize") ? parameters["fontsize"] : 30;

        let canvas = document.createElement('canvas');
        let context = canvas.getContext('2d');
        context.font = `Bold ${fontsize}px ${fontface}`;

        let metrics = context.measureText(name);
        let textWidth = metrics.width;
        let textHeight = getFontHeight(`Bold ${fontsize}px ${fontface}`)
        canvas.width = textWidth;
        canvas.height = textHeight;

        context.font = `Bold ${fontsize}px ${fontface}`;
        context.clearRect(0, 0, canvas.width, canvas.height)

        context.fillStyle = `transparent`;
        context.fillRect(0, 0, canvas.width, canvas.height)
        context.textAlign = "center";
        context.textBaseline = "top"
        context.fillStyle = `rgba(255, 255, 255, 1)`;
        context.fillText( name, canvas.width / 2, 4);

        let texture = new Texture(canvas) 
        texture.magFilter = LinearMipMapLinearFilter
        texture.minFilter = LinearMipMapLinearFilter
        texture.needsUpdate = true;
        let spriteMaterial = new SpriteMaterial( { map: texture, useScreenCoordinates: false, sizeAttenuation: true } );
        let sprite = new Sprite( spriteMaterial );
        sprite.scale.set(canvas.width, canvas.height, 1);
        return sprite;  
    }, [name])

    function getFontHeight (fontStyle) {
        let body = document.getElementsByTagName('body')[0];
        let dummy = document.createElement('div');
    
        let dummyText = document.createTextNode('MÉq');
        dummy.appendChild(dummyText);
        dummy.setAttribute('style', `font:${ fontStyle };position:absolute;top:0;left:0`);
        body.appendChild(dummy);

        let result = dummy.offsetHeight;

        body.removeChild(dummy);
    
        return result;
    }

    return <>
        <group position={[0, 1.7, 0]} scale={[0.005, 0.005, 0.005]}>
            <mesh>
                <boxGeometry args={[0.1, 0.1, 0.1]} />
                <meshStandardMaterial color={'red'} />
            </mesh>
            <primitive object={spriteText}/>
        </group>
    </>
}
export default React.memo(ElementName);