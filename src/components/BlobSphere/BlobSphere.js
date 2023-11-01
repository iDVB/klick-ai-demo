import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import MagicalMaterial from "../MagicalMaterial/MagicalMaterial";

const spotLightDefaults = {
  distance: 7,
  penumbra: 1,
  intensity: 0.5,
  decay: 0.5,
  shadowBias: -0.1,
  angle: Math.PI / 4
};

const styles = {
  height: "100vh"
};

const BlobSphere = (props) => {
  return (
    <Canvas
      style={styles}
      camera={{
        position: [0, 0, 3]
      }}
    >
      <BlobScene {...props} />
    </Canvas>
  );
};

const BlobScene = (props) => (
  <group>
    <spotLight
      position={[3, -3, -1]}
      lookAt={[0, 0, 0]}
      {...spotLightDefaults}
    />
    <spotLight
      position={[-3, -3, 0]}
      lookAt={[0, 0, 0]}
      {...spotLightDefaults}
    />
    <spotLight position={[3, 3, 1]} lookAt={[0, 0, 0]} {...spotLightDefaults} />
    <ambientLight intensity={0.4} />
    <Blob position={[0, 0, 0]} {...props} />
    <OrbitControls />
  </group>
);

const Blob = ({
  selectedGradient,
  gradientOrder,
  gradientLabels,
  settings,
  ...props
}) => {
  const gradients = useTexture(gradientOrder.map((key) => gradientLabels[key]));
  const { rotX, rotY, rotZ, gradient, ...restSettings } = settings;
  return (
    <mesh {...props} rotation-x={rotX} rotation-y={rotY} rotation-z={rotZ}>
      <sphereGeometry attach="geometry" args={[1, 512, 512]} />
      <MagicalMaterial map={gradients[selectedGradient]} {...restSettings} />
    </mesh>
  );
};

export default BlobSphere;
