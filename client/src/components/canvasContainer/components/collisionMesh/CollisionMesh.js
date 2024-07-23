import React, { useRef } from "react";
import BaseBox from "../baseBox/BaseBox";

const CollisionMesh = () => {
    return (
        <group userData={{collisionGroup: true}}>
            <BaseBox text={false} position={[-2.5, 0, 7.35]} args={[9, 8, 1]} />
            <BaseBox text={false} position={[- 4.5, 0, -4.5]} args={[6, 8, 1]} />
            <BaseBox text={false} position={[0, 0, -1.25]} args={[4.5, 8, 1]} />
            <BaseBox text={false} position={[-1.8, 0, -2.95]} args={[1, 8, 4.5]} />
            <BaseBox text={false} position={[2.2, 0, 3]} args={[1, 8, 9]} />
            <BaseBox text={false} position={[-6.9, 0, 1.5]} args={[1, 8, 12]} />
        </group>
      );
}
export default CollisionMesh