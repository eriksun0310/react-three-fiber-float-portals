import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
  Float,
} from "@react-three/drei";
import {
  EffectComposer,
  HueSaturation,
  ChromaticAberration,
  GodRays,
  DepthOfField,
  BrightnessContrast,
} from "@react-three/postprocessing";
import { BlendFunction, Resizer, KernelSize } from "postprocessing";
import { Suspense } from "react";
import { Color, CylinderGeometry, Mesh, MeshBasicMaterial } from "three";
import { FloatingIsland } from "./FloatingIsland";
import { FloatingRocks } from "./FloatingRocks";
import { Grass } from "./Grass";
import { Portal } from "./Portal";
import { Rocks } from "./Rocks";
import { Trees } from "./Trees";
import { Words } from "./Words";
import { SceneParticles } from "./SceneParticles";

let lightColor = new Color(1, 0.2, 0.1);
let mesh = new Mesh(
  new CylinderGeometry(0.3, 0.3, 0.2, 20),
  new MeshBasicMaterial({
    color: lightColor,
    transparent: true,
    opacity: 1,
  })
);
mesh.rotation.x = Math.PI * 0.5;
mesh.position.set(1.17, 10.7, -4.1);
mesh.scale.set(1.5, 1, 1);

export function SceneContainer() {
  return (
    <Suspense>
      <Environment
        background={"only"} // 环境贴图只会作为场景的背景呈现，不会反射到物体表面上(迷糊)
        files={process.env.PUBLIC_URL + "/textures/bg.hdr"}
      />
      <Environment
        background={false} // 环境贴图用于增强场景中的光照效果,适用需要模拟真实光照的场景
        files={process.env.PUBLIC_URL + "/textures/envmap.hdr"}
      />

      <PerspectiveCamera
        makeDefault
        fov={50}
        position={[-1.75, 10.85, 20.35]}
      />
      <OrbitControls target={[1, 5, 0]} maxPolarAngle={Math.PI * 0.5} />

      {/*  Float: 使組件浮動效果*/}
      <Float speed={0.5} rotationIntensity={0.6} floatIntensity={0.6}>
        {/* 門上的發光器 */}
        <primitive object={mesh} />

        <spotLight
          penumbra={1}
          distance={500}
          angle={60.65}
          attenuation={1}
          anglePower={3}
          intensity={0.3}
          color={lightColor}
          position={[18, 10.85, -4.45]}
          target-position={[0, 0, -1]}
        />

        <Portal />

        <Rocks />
        <FloatingIsland />
        <Trees />
        <Words />
        <Grass />
        <SceneParticles />
      </Float>

      <FloatingRocks />

      {/* 主要讓島, 周圍有模糊的感覺 */}
      <EffectComposer stencilBuffer={true}>
        {/*  */}
        <DepthOfField
          focusDistance={0.012}
          focalLength={0.015}
          bokehScale={7}
        />
        {/* HueSaturation:调整场景中的色相和饱和度 */}
        <HueSaturation hue={0} saturation={-0.15} />
        {/* BrightnessContrast:调整场景中的亮度和对比度 */}
        <BrightnessContrast brightness={0.0} contrast={0.035} />
        {/* ChromaticAberration: 用于实现“色差”效果 */}
        <ChromaticAberration
          radialModulation={true}
          offset={[0.00175, 0.00175]}
        />
        {/* 門上的光 */}
        <GodRays
          sun={mesh}
          blendFunction={BlendFunction.Screen}
          samples={40}
          density={0.97}
          decay={0.97}
          weight={0.6}
          exposure={0.3}
          clampMax={1}
          width={Resizer.AUTO_SIZE}
          height={Resizer.AUTO_SIZE}
          kernelSize={KernelSize.SMALL}
          blur={true}
        />
      </EffectComposer>
    </Suspense>
  );
}
