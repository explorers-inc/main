import { useSelector } from '@xstate/react';
import { ConnectedContext } from '../../../state/connected.context';
import { useContext, useMemo } from 'react';
import styled from 'styled-components';
import { useActorManager, usePartyScreenActor } from '../party-screen.hooks';
import { EnterName } from './enter-name.component';
import { JoinError } from './join-error.component';
import { Joined } from './joined';
import { JoinedContext } from './joined/joined.context';
import { Joining } from './joining.component';
import { Rejoining } from './rejoining.component';
import { Spectating } from './spectating.component';
import { TriviaJamMainUI } from '@explorers-club/trivia-jam/ui';

export const Connected = () => {
  const { partyActor } = useContext(ConnectedContext);
  const inLobby = useSelector(partyActor, (state) => state.matches('Lobby'));
  const inGame = useSelector(partyActor, (state) => state.matches('Game'));

  return (
    <Container>
      {inLobby && <Lobby />}
      {inGame && <Game />}
    </Container>
  );
};

const Lobby = () => {
  const actor = usePartyScreenActor();

  const isRejoining = useSelector(actor, (state) =>
    state.matches('Connected.Rejoining')
  );
  const isSpectating = useSelector(actor, (state) =>
    state.matches('Connected.Spectating')
  );
  const isJoining = useSelector(actor, (state) =>
    state.matches('Connected.Joining')
  );
  const isEnteringName = useSelector(actor, (state) =>
    state.matches('Connected.EnteringName')
  );
  const isJoined = useSelector(actor, (state) =>
    state.matches('Connected.Joined')
  );
  const isJoinError = useSelector(actor, (state) =>
    state.matches('Connected.JoinError')
  );
  const myActor = useSelector(actor, (state) => state.context.myActor);
  return (
    <Container>
      {isSpectating && <Spectating />}
      {isJoining && <Joining />}
      {isRejoining && <Rejoining />}
      {isEnteringName && <EnterName />}
      {isJoined && myActor && (
        <JoinedContext.Provider value={{ myActor }}>
          <Joined />
        </JoinedContext.Provider>
      )}
      {isJoinError && <JoinError />}
    </Container>
  );
};

const Game = () => {
  // Game context...
  const actorManager = useActorManager();
  return <TriviaJamMainUI actorManager={actorManager} />;
};

const Container = styled.div``;
