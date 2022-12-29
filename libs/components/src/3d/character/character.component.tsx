/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import { useGLTF } from '@react-three/drei';
import { RefObject } from 'react';
import * as THREE from 'three';
import { GLTFResult } from './character.types';

interface Props {
  gltf: GLTFResult;
  group: RefObject<THREE.Group>;
}

export function Character({ gltf, group }: Props) {
  const { nodes, materials } = gltf;
  // // const { nodes, materials, animations } = useGLTF(
  // //   './assets/character.glb'
  // // ) as unknown as GLTFResult;
  // const { actions } = useAnimations(animations, group) as unknown as {
  //   actions: GLTFActions;
  // };

  return (
    <group ref={group} dispose={null}>
      <group name="Scene">
        <group name="Armature" rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
          <primitive object={nodes.mixamorigHips} />
          <skinnedMesh
            name="Erika_Archer_Body_Mesh"
            geometry={nodes.Erika_Archer_Body_Mesh.geometry}
            material={materials.Akai_MAT}
            skeleton={nodes.Erika_Archer_Body_Mesh.skeleton}
          />
          <skinnedMesh
            name="Erika_Archer_Clothes_Mesh"
            geometry={nodes.Erika_Archer_Clothes_Mesh.geometry}
            material={materials.eyelash_MAT}
            skeleton={nodes.Erika_Archer_Clothes_Mesh.skeleton}
          />
          <skinnedMesh
            name="Erika_Archer_Eyelashes_Mesh"
            geometry={nodes.Erika_Archer_Eyelashes_Mesh.geometry}
            material={materials.Body_MAT}
            skeleton={nodes.Erika_Archer_Eyelashes_Mesh.skeleton}
          />
          <skinnedMesh
            name="Erika_Archer_Eyes_Mesh"
            geometry={nodes.Erika_Archer_Eyes_Mesh.geometry}
            material={materials.EyeSpec_MAT}
            skeleton={nodes.Erika_Archer_Eyes_Mesh.skeleton}
          />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload('./assets/character.glb');