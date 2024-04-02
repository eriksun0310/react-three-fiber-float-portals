import { useLoader } from '@react-three/fiber';
import { useEffect } from 'react';
import { Color, DoubleSide } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export function Grass(){
    const gltf = useLoader(GLTFLoader,process.env.PUBLIC_URL+ "/models/grass.glb")

    useEffect(()=>{
        if(!gltf) return;
        //alphaToCoverage: 适用于具有半透明效果的纹理
        gltf.scene.children[0].material.alphaToCoverage = true
        // transparent: 材質是否為透明
        gltf.scene.children[0].material.transparent = true;
        // map:设置模型表面的基础贴图
        // emissiveMap :设置模型表面的自发光贴图
        gltf.scene.children[0].material.map = gltf.scene.children[0].material.emissiveMap;
        gltf.scene.children[0].material.emissive = new Color(0.5,0.5,0.5) // 發光
        gltf.scene.children[0].material.side = DoubleSide
    }, [gltf])

    return(
        <primitive object={gltf.scene}></primitive>
    )
}