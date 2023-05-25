import { Box } from '@atoms/Box';
import { Flex } from '@atoms/Flex';
import { Heading } from '@atoms/Heading';
import { InitializedConnectionEntityContext } from '@context/Entity';
import { useStore } from '@nanostores/react';
import { NewRoomFlow } from '@organisms/new-room-flow';
import { Room } from '@organisms/room';
import { myInitializedConnectionEntityStore } from '@state/world';
import { currentRouteStore } from '../state/navigation';
import { Button, ButtonLink } from '@atoms/Button';
import { MouseEventHandler, useCallback } from 'react';

export const MainPanel = () => {
  const currentRoute = useStore(currentRouteStore);

  return (
    <Box>
      {currentRoute === 'Home' && <HomePanel />}
      {currentRoute === 'NewRoom' && <NewRoomPanel />}
      {currentRoute === 'Login' && <LoginPanel />}
      {currentRoute === 'Room' && <RoomPanel />}
    </Box>
  );
};

const HomePanel = () => {
  const handleCreateRoom: MouseEventHandler<HTMLAnchorElement> = useCallback(
    (event) => {
      const entity = myInitializedConnectionEntityStore.get();
      if (entity) {
        event.preventDefault();
        entity.send({
          type: 'NAVIGATE',
          route: { name: 'NewRoom' },
        });
      }
    },
    []
  );

  return (
    <Flex direction="column" gap="2">
      <Heading>Home</Heading>
      <ButtonLink href="/new" onClick={handleCreateRoom}>
        Create Room
      </ButtonLink>
    </Flex>
  );
};

const LoginPanel = () => {
  return <div>Login</div>;
};

const NewRoomPanel = () => {
  const entity = useStore(myInitializedConnectionEntityStore);
  return entity ? (
    <InitializedConnectionEntityContext.Provider value={entity}>
      <NewRoomFlow />
    </InitializedConnectionEntityContext.Provider>
  ) : null;
};

const RoomPanel = () => {
  const entity = useStore(myInitializedConnectionEntityStore);
  return entity ? (
    <InitializedConnectionEntityContext.Provider value={entity}>
      <Room />
    </InitializedConnectionEntityContext.Provider>
  ) : null;
};