import { Flex } from '@atoms/Flex';
// import { isMainSceneFocusedStore } from '../global/layout';
import { computed } from 'nanostores';
import { useStore } from '@nanostores/react';
import { Box } from '@atoms/Box';
import { GoogleMaps } from "./GoogleMaps";
import { Canvas } from '@react-three/fiber';
import { CafeModel } from './Cafe';
import { Environment, OrbitControls } from '@react-three/drei';

export const MainScene = () => {
  // const isMainSceneFocused = useStore(isMainSceneFocusedStore);

  return (
    <Box
      css={{
        // backgroundImage: "url('/loading.jpg')",
        backgroundSize: 'contain',
        // backgroundPositionX: "center",
        // backgroundPositionY: "center",
        // background: 'yellow',
        // background: "url('/assets/loading.jpg')",
        // flexGrow: isMainSceneFocused ? 0 : 1,
        flexGrow: 1,
        position: 'relative',
        transition: 'flex-grow 150ms',

        '@bp2': {
          flexGrow: 1,
          flexBasis: '70%',
        },
      }}
    >
      <div id="map" />
      <Canvas>
        <GoogleMaps />
        <OrbitControls />
        {/* <CafeModel /> */}
        {/* <OrbitControls />
        <CafeModel /> */}
        {/* <Environment preset="sunset" /> */}
      </Canvas>
    </Box>
  );
};
