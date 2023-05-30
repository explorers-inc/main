/* eslint-disable @typescript-eslint/ban-types */
import { Database } from '@explorers-club/database';
import { IndexByType, MakeRequired } from '@explorers-club/utils';
import { SupabaseClient } from '@supabase/supabase-js';
import { Operation } from 'fast-json-patch';
import {
  ActorRefFrom,
  AnyEventObject,
  InterpreterFrom,
  StateMachine,
  StateSchema,
  StateValue,
} from 'xstate';
import { z } from 'zod';

const SlugSchema = z
  .string()
  .min(1)
  .max(30)
  .regex(/^[a-z0-9-]+$/);

// export const ClubRoomIdSchema = z.custom<`club-${string}`>((val) => {
//   return /^club-\w+$/.test(val as string);
// });
// export const TriviaJamRoomIdSchema = z.custom<`trivia_jam-${string}`>((val) => {
//   return /^trivia_jam-\w+$/.test(val as string);
// });
// export const CodebreakersRoomIdSchema = z.custom<`codebreakers-${string}`>(
//   (val) => {
//     return /^codebreakers-\w+$/.test(val as string);
//   }
// );
// export const DiffusionaryRoomIdSchema = z.custom<`diffusionary-${string}`>(
//   (val) => {
//     return /^diffusionary-\w+$/.test(val as string);
//   }
// );
// export const LittleVigilanteRoomIdSchema =
//   z.custom<`little_vigilante-${string}`>((val) => {
//     return /^little_vigilante-\w+$/.test(val as string);
//   });

// export type TriviaJamRoomId = z.infer<typeof TriviaJamRoomIdSchema>;
// export type DiffusionaryRoomId = z.infer<typeof DiffusionaryRoomIdSchema>;
// export type LittleVigilanteRoomId = z.infer<typeof LittleVigilanteRoomIdSchema>;
// export type CodebreakersRoomId = z.infer<typeof CodebreakersRoomIdSchema>;

// export type GameState =
//   | TriviaJamState
//   | DiffusionaryState
//   | LittleVigilanteState
//   | CodebreakersState;

// export type GameRoomId =
//   | TriviaJamRoomId
//   | DiffusionaryRoomId
//   | LittleVigilanteRoomId
//   | CodebreakersRoomId;

export type NewRoomServiceId = 'new-room-service';

export type ServiceId = NewRoomServiceId;

// export type ClubMetadata = {
//   clubName: string;
// };

// export const TriviaJamConfigSchema = z
//   .object({
//     gameId: z.literal('trivia_jam').default('trivia_jam'),
//     minPlayers: z.literal(3).default(3),
//     maxPlayers: z.number().max(250).default(250),
//     questionSetEntryId: z.string().default('dSX6kC0PNliXTl7qHYJLH'),
//   })
//   .required();

// export type TriviaJamConfig = z.infer<typeof TriviaJamConfigSchema>;

// export const DiffusionaryConfigSchema = z
//   .object({
//     gameId: z.literal('diffusionary').default('diffusionary'),
//     minPlayers: z.literal(4).default(4),
//     maxPlayers: z.number().int().min(4).max(10).default(10),
//   })
//   .required();

// export type DiffusionaryConfig = z.infer<typeof DiffusionaryConfigSchema>;

// export const LittleVigilanteConfigSchema = z
//   .object({
//     gameId: z.literal('little_vigilante').default('little_vigilante'),
//     minPlayers: z.literal(4).default(4),
//     maxPlayers: z.number().int().min(4).max(10).default(10),
//     discussionTimeSeconds: z.number().int().min(10).max(600).default(180),
//     roundsToPlay: z.number().int().min(1).max(999).default(5),
//     votingTimeSeconds: z.number().int().default(20),
//     rolesToExclude: z.array(z.string()).default([]),
//   })
//   .required();

// export type LittleVigilanteConfig = z.infer<typeof LittleVigilanteConfigSchema>;

// export const CodebreakersConfigSchema = z
//   .object({
//     gameId: z.literal('codebreakers').default('codebreakers'),
//     minPlayers: z.literal(4).default(4),
//     maxPlayers: z.number().int().min(4).max(10).default(10),
//   })
//   .required();

// export type CodebreakersConfig = z.infer<typeof CodebreakersConfigSchema>;

export const SnowflakeIdSchema = z.string();
export type SnowflakeId = z.infer<typeof SnowflakeIdSchema>;

export const UserIdSchema = SnowflakeIdSchema;
export type UserId = z.infer<typeof UserIdSchema>;
export const ECEpochTimestampSchema = z.number();
export type ECEpochTimestamp = z.infer<typeof ECEpochTimestampSchema>;

export const ClubNameSchema = z.string();

export const PlayerNameSchema = z.string();

const LittleVigilanteGameId = z.literal('little_vigilante');
const CodebreakersGameId = z.literal('codebreakers');
const BananaTradersGameId = z.literal('banana_traders');

const CodebreakersGameConfigDataSchema = z.object({
  numPlayers: z.number().min(4).max(4),
});

const LittleVigilanteGameConfigDataSchema = z.object({
  numPlayers: z.number().min(4).max(4),
});

const BananTradersGameConfigDataSchema = z.object({
  numPlayers: z.number().min(4).max(4),
});

const GameConfigurationSchema = z.discriminatedUnion('gameId', [
  z.object({
    gameId: LittleVigilanteGameId,
    data: LittleVigilanteGameConfigDataSchema,
  }),
  z.object({
    gameId: CodebreakersGameId,
    data: CodebreakersGameConfigDataSchema,
  }),
  z.object({
    gameId: BananaTradersGameId,
    data: BananTradersGameConfigDataSchema,
  }),
]);

const GameIdSchema = z.enum([
  'little_vigilante',
  'codebreakers',
  'banana_traders',
]);
export type GameId = z.infer<typeof GameIdSchema>;

const StateValueSchema: z.ZodType<StateValue> = z.union([
  z.string(),
  z.record(z.lazy(() => StateValueSchema)),
]);
export type AnyStateValue = z.infer<typeof StateValueSchema>;

const UserSchemaTypeLiteral = z.literal('user');
const SessionSchemaTypeLiteral = z.literal('session');
const ConnectionSchemaTypeLiteral = z.literal('connection');
const RoomSchemaTypeLiteral = z.literal('room');
const BananaTradersGameSchemaTypeLiteral = z.literal('banana_traders_game');
const BananaTradersPlayerSchemaTypeLiteral = z.literal('banana_traders_player');
const LittleVigilanteGameSchemaTypeLiteral = z.literal('little_vigilante_game');
const LittleVigilantePlayerSchemaTypeLiteral = z.literal(
  'little_vigilante_player'
);
const CodebreakersGameSchemaTypeLiteral = z.literal('codebreakers_game');
const CodebreakersPlayerSchemaTypeLiteral = z.literal('codebreakers_player');

export const LoginInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(5),
});

// export const SchemaLiteralsSchema = z.union([
//   // UserSchemaTypeLiteral,
//   // RoomSchemaTypeLiteral,
//   // SessionSchemaTypeLiteral,
//   ConnectionSchemaTypeLiteral,
//   // StagingRoomSchemaTypeLiteral,
//   // LittleVigilanteRoomSchemaTypeLiteral,
//   // UserSchemaTypeLiteral,
//   // SessionSchemaTypeLiteral,
//   // DeviceSchemaTypeLiteral,
// ]);
export const SchemaLiteralsSchema = z.union([
  ConnectionSchemaTypeLiteral,
  SessionSchemaTypeLiteral,
  RoomSchemaTypeLiteral,
]);
export type SchemaType = z.infer<typeof SchemaLiteralsSchema>;

// Define a generic schema for the store
const StoreSchema = <State, Event extends { type: string }>(
  stateSchema: z.ZodSchema<State>,
  eventSchema: z.ZodSchema<Event>
) => {
  return z.object({
    id: z.string(),
    subscribe: z
      .function()
      .args(z.function().args().returns(z.void()))
      .returns(z.function().returns(z.void())),
    send: z.function().args(eventSchema).returns(z.void()),
    getSnapshot: z.function().returns(stateSchema),
  });
};

// Define separate Zod schemas for each event type
const DisconnectEventSchema = z.object({ type: z.literal('DISCONNECT') });
const ReconnectEventSchema = z.object({ type: z.literal('RECONNECT') });

// Create a union schema that combines the event schemas
export const ConnectionEventSchema = z.union([
  DisconnectEventSchema,
  ReconnectEventSchema,
]);

// Define the base Event type with a "type" string parameter
// export const EventBaseSchema = z.object({
//   type: z.string(),
// });
// export type EventBase = z.infer<typeof EventBaseSchema>;

// Define a custom Zod schema for the send function
// const SendFunctionSchema = z.lazy(() =>
//   z.function().args(EventBaseSchema).returns(z.void())
// );

// const SubscribeFunctionSchema = z
//   .function()
//   .args(z.function().args().returns(z.void()))
//   .returns(z.function().args().returns(z.void()));

// const ConnectionStoreSchema = StoreSchema(
//   ConnectionStateSchema,
//   ConnectionEventSchema
// );

// const EntityBaseSchema = z.object({
//   id: SnowflakeIdSchema,
// });
// export type EntityBase = z.infer<typeof EntityBaseSchema>;

// const UserEntitySchema = EntityBaseSchema.extend({
//   schema: UserSchemaTypeLiteral,
// });

// type UserEntity = z.infer<typeof UserEntitySchema>;

// // Define a custom Zod schema for the send function
const SendFunctionSchema = <TEvent extends AnyEventObject>(
  eventSchema: z.ZodSchema<TEvent>
) => z.function().args(eventSchema).returns(z.void());

const CallbackFunctionSchema = <TCommand extends AnyEventObject>(
  commandSchema: z.ZodSchema<TCommand>
) => z.function().args(EntityEventSchema(commandSchema)).returns(z.void());

export type InitialEntityProps<TEntity extends Entity> = Omit<
  TEntity,
  'id' | 'subscribe' | 'send' | 'states' | 'command' | 'context' | 'children'
>;

// export type EntityDataKey = Omit<keyof InitialEntityProps<Entity>, 'schema'>;

// const StatesFrom = // TODO implement

// const ContextFrom = <TTypeState extends Typestate<any>>(typeStateSchema: z.ZodSchema<TTypeState>) => {
//   return typeStateSchema.
// }

const EntityBaseSchema = <
  TEntityProps extends z.ZodRawShape,
  TCommand extends AnyEventObject,
  TStates extends z.ZodRawShape
>(
  entityPropsSchema: z.ZodObject<TEntityProps>,
  commandSchema: z.ZodSchema<TCommand>,
  stateSchema: z.ZodObject<TStates>
  // contextSchema: z.ZodSchema<any>
) =>
  entityPropsSchema.merge(
    z.object({
      id: SnowflakeIdSchema,
      send: SendFunctionSchema(commandSchema),
      states: stateSchema,
      command: commandSchema,
      subscribe: z
        .function()
        .args(CallbackFunctionSchema(commandSchema))
        .returns(z.function().returns(z.void())), // The subscribe function returns an unsubscribe function
    })
  );

export type SyncedEntityProps<TEntity extends Entity> = Omit<
  TEntity,
  'subscribe' | 'send'
>;

export type EntityListEvent =
  | { type: 'ADDED'; entities: SyncedEntityProps<Entity>[] }
  | { type: 'REMOVED'; entities: SyncedEntityProps<Entity>[] }
  | {
      type: 'CHANGED';
      changedEntities: { id: SnowflakeId; patches: Operation[] }[];
    };

const AuthTokensSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});
export type AuthTokens = z.infer<typeof AuthTokensSchema>;

export type ChatMachine = StateMachine<
  ChatContext,
  ChatStateSchema,
  ChatCommand
>;

export type ConnectionContext = {
  supabaseClient?: SupabaseClient<Database>;
  chatServiceRef?: ActorRefFrom<ChatMachine>;
};

export type InitializedConnectionContext = MakeRequired<
  ConnectionContext,
  'supabaseClient'
>;

export type InitializedConnectionEntity = MakeRequired<
  ConnectionEntity,
  'sessionId' | 'authTokens' | 'deviceId'
>;

export type ConnectionTypeState =
  | {
      value: 'Initialized';
      context: InitializedConnectionContext;
    }
  | {
      value: 'Unitialized';
      context: ConnectionContext;
    };

export const ConnectionInitializeInputSchema = z.object({
  deviceId: SnowflakeIdSchema.optional(),
  initialLocation: z.string(),
  authTokens: AuthTokensSchema.optional(),
});

export const RouteNameSchema = z.enum([
  'Home',
  'NewRoom',
  'Room',
  'Login',
  'NotFound',
]);

export type RouteName = z.infer<typeof RouteNameSchema>;

const ConnectionStateValueSchema = z.object({
  Initialized: z.enum(['True', 'False', 'Initializing', 'Error']),
  Route: RouteNameSchema,
});

type ConnectionStateValue = z.infer<typeof ConnectionStateValueSchema>;

type EnumKeys<T> = T extends z.ZodEnum<infer R> ? Extract<R, string> : never;

type NestedState<T> = T extends z.ZodObject<infer R>
  ? {
      [K in keyof R]: {
        states: NestedStates<R[K]>;
      };
    }
  : {
      [P in EnumKeys<T>]: {};
    };

type NestedStates<T> = {
  [K in keyof T]: NestedState<T[K]>;
};

type StateSchemaFromStateValue<T> = StateSchema & {
  states: NestedStates<T>;
};

export type ConnectionStateSchema =
  StateSchemaFromStateValue<ConnectionStateValue>;

export type RoomStateSchema = StateSchemaFromStateValue<RoomStateValue>;

export type RoomMachine = StateMachine<
  RoomContext,
  RoomStateSchema,
  RoomCommand
>;

const ConnectionInitializeCommandSchema =
  ConnectionInitializeInputSchema.extend({
    type: z.literal('INITIALIZE'),
  });

export type ConnectionMachine = StateMachine<
  ConnectionContext,
  ConnectionStateSchema,
  ConnectionCommand
>;

export type SessionTypeState = {
  value: 'Active';
  context: MakeRequired<SessionContext, 'foo'>;
};
export type SessionStateSchema = StateSchemaFromStateValue<SessionStateValue>;

export type SessionMachine = StateMachine<
  SessionContext,
  SessionStateSchema,
  SessionCommand
>;

const EntitySendTriggerEventSchema = <TEvent extends AnyEventObject>(
  commandSchema: z.ZodSchema<TEvent>
) =>
  z.object({
    type: z.literal('SEND_TRIGGER'),
    command: commandSchema,
  });

const EntitySendErrorEventSchema = <TEvent extends AnyEventObject>(
  commandSchema: z.ZodSchema<TEvent>
) =>
  z.object({
    type: z.literal('SEND_ERROR'),
    command: commandSchema,
  });

const EntitySendCompleteEventSchema = <TEvent extends AnyEventObject>(
  commandSchema: z.ZodSchema<TEvent>
) =>
  z.object({
    type: z.literal('SEND_COMPLETE'),
    command: commandSchema,
  });

const EntityTransitionStateEventSchema = z.object({
  type: z.literal('TRANSITION'),
});

const EntityChangeEventSchema = z.object({
  type: z.literal('CHANGE'),
  patches: z.array(z.custom<Operation>()),
});

const EntityEventSchema = <TEvent extends AnyEventObject>(
  commandSchema: z.ZodSchema<TEvent>
) =>
  z.union([
    EntitySendCompleteEventSchema(commandSchema),
    EntitySendErrorEventSchema(commandSchema),
    EntitySendTriggerEventSchema(commandSchema),
    EntityChangeEventSchema,
    EntityTransitionStateEventSchema,
  ]);

// ------------ User Entity Definition ------------
const UserContextSchema = z.object({
  foo: z.string(),
});

export const UserInitializePropsSchema = z.object({
  connectionId: SnowflakeIdSchema,
  userId: SnowflakeIdSchema,
});

const UserEntityPropsSchema = z.object({
  schema: UserSchemaTypeLiteral,
  userId: SnowflakeIdSchema.optional(),
  name: PlayerNameSchema.optional(),
  discriminator: z.number().default(0),
  sessionId: SnowflakeIdSchema,
  connections: z.array(
    z.object({
      id: SnowflakeIdSchema,
      createdAt: z.date(),
      connected: z.boolean(),
    })
  ),
});

export type UserContext = {
  foo: string;
};

export interface UserStateSchema extends StateSchema<UserContext> {
  states: {
    Online: {
      states: {
        [K in UserStateValue['Online']]: {};
      };
    };
  };
}

const UserCommandSchema = z.object({
  type: z.literal('ADD_CONNECTION'),
  connectionId: SnowflakeIdSchema,
});
export type UserCommand = z.infer<typeof UserCommandSchema>;

export type UserMachine = StateMachine<
  UserContext,
  UserStateSchema,
  UserCommand
>;
export type UserInterpreter = InterpreterFrom<UserMachine>;

const UserStateValueSchema = z.object({
  Online: z.enum(['True', 'False']),
});

type UserStateValue = z.infer<typeof UserStateValueSchema>;

const UserTypeStateSchema = z.union([
  z.object({ value: z.literal('Connected.True'), context: UserContextSchema }),
  z.object({ value: z.literal('Connected.False'), context: UserContextSchema }),
  z.object({ value: z.literal('Ready.True'), context: UserContextSchema }),
  z.object({ value: z.literal('Ready.False'), context: UserContextSchema }),
]);
export type UserTypeState = z.infer<typeof UserTypeStateSchema>;

// export const UserEntitySchema = EntityBaseSchema(
//   UserEntityPropsSchema,
//   UserCommandSchema,
//   UserTypeStateSchema
// );
// export type UserEntity = z.infer<typeof UserEntitySchema>;

// ------------ Room Entity ------------
const RoomContextSchema = z.object({
  foo: z.string(),
});
export type RoomContext = z.infer<typeof RoomContextSchema>;

const StartCommandSchema = z.object({
  type: z.literal('START'),
});

const ConnectCommandSchema = z.object({
  type: z.literal('CONNECT'),
  connectionEntityId: SnowflakeIdSchema,
});

const JoinCommandSchema = z.object({
  type: z.literal('JOIN'),
  connectionEntityId: SnowflakeIdSchema,
});

const LeaveCommandSchema = z.object({
  type: z.literal('LEAVE'),
});

const RoomCommandSchema = z.union([
  ConnectCommandSchema,
  JoinCommandSchema,
  StartCommandSchema,
  LeaveCommandSchema,
]);

export type RoomCommand = z.infer<typeof RoomCommandSchema>;

const RoomEntityPropsSchema = z.object({
  schema: RoomSchemaTypeLiteral,
  ownerHostId: SnowflakeIdSchema,
  connectionEntityIds: z.array(SnowflakeIdSchema),
  // playerIds: z.array(SnowflakeIdSchema),
  slug: SlugSchema,
  gameId: GameIdSchema.optional(),
  configuration: GameConfigurationSchema.optional(),
});

// // ------------ Session Entity ------------
const SessionContextSchema = z.object({
  foo: z.string(),
});
export type SessionContext = z.infer<typeof SessionContextSchema>;

const SessionEntityPropsSchema = z.object({
  schema: SessionSchemaTypeLiteral,
  userId: UserIdSchema,
});

const SessionCommandSchema = z.union([
  z.object({
    type: z.literal('RECONNECT'),
  }),
  z.object({
    type: z.literal('DISCONNECT'),
  }),
]);
export type SessionCommand = z.infer<typeof SessionCommandSchema>;

const SessionStateValueSchema = z.object({
  Active: z.enum(['True', 'False']),
});
export type SessionStateValue = z.infer<typeof SessionStateValueSchema>;

export const SessionEntitySchema = EntityBaseSchema(
  SessionEntityPropsSchema,
  SessionCommandSchema,
  SessionStateValueSchema
  // SessionContextSchema
);

// export interface SessionStateSchema extends StateSchema<SessionContext> {
//   states: {
//     Active: {
//       states: {
//         [K in SessionStateValue['Active']]: {};
//       };
//     };
//   };
// }

// export type SessionStateMachine = StateMachine<
//   SessionContext,
//   SessionStateSchema,
//   SessionCommand
// >;

export type SessionEntity = z.infer<typeof SessionEntitySchema>;
// const RoomListStateValueSchema = z.enum(['Initializing', 'Loaded']);

// export type GameListStateValue = z.infer<typeof RoomListStateValueSchema>;

// export type GameListStateSchema = StateSchemaFromStateValue<GameListStateValue>;

// const RoomListContextSchema = z.object({
//   gameInstanceIds: z.array(SnowflakeIdSchema),
// });
// export type GameListContext = z.infer<typeof RoomListContextSchema>;

// const GameListCommandSchema = z.object({
//   type: z.literal('REFRESH'),
// });
// export type GameListCommand = z.infer<typeof GameListCommandSchema>;

// export type GameListMachine = StateMachine<
//   GameListContext,
//   GameListStateSchema,
//   GameListCommand
// >;

const NewRoomStateValueSchema = z.enum([
  'SelectGame',
  'EnterName',
  'Configure',
  'Complete',
]);

export type NewRoomStateValue = z.infer<typeof NewRoomStateValueSchema>;

export type NewRoomStateSchema = StateSchemaFromStateValue<NewRoomStateValue>;

const ChatStateValueSchema = z.enum(['Initializing', 'Loaded']);

export type ChatStateValue = z.infer<typeof ChatStateValueSchema>;

export type ChatStateSchema = StateSchemaFromStateValue<ChatStateValue>;

const ChatContextSchema = z.object({
  roomSlug: z.string(),
});
export type ChatContext = z.infer<typeof ChatContextSchema>;

const ChatCommandSchema = z.union([
  z.object({
    type: z.literal('TYPE'),
  }),
  z.object({
    type: z.literal('SEND'),
    message: z.string(),
  }),
]);
export type ChatCommand = z.infer<typeof ChatCommandSchema>;

const NewRoomContextSchema = z.object({
  roomSlug: z.string().optional(),
  gameId: GameIdSchema.optional(),
  gameConfiguration: GameConfigurationSchema.optional(),
});
export type NewRoomContext = z.infer<typeof NewRoomContextSchema>;

const ConfigureCommandSchema = z.object({
  type: z.literal('CONFIGURE_GAME'),
  configuration: GameConfigurationSchema,
});
const SubmitNameCommandSchema = z.object({
  type: z.literal('SUBMIT_NAME'),
  name: z.string(),
});
const SelectGameCommandSchema = z.object({
  type: z.literal('SELECT_GAME'),
  gameId: GameIdSchema,
});

const NewRoomCommandSchema = z.union([
  SelectGameCommandSchema,
  SubmitNameCommandSchema,
  ConfigureCommandSchema,
]);
export type NewRoomCommand = z.infer<typeof NewRoomCommandSchema>;

export type NewRoomMachine = StateMachine<
  NewRoomContext,
  NewRoomStateSchema,
  NewRoomCommand
>;

// export type NewRoomState = State<
//   NewRoomContext,
//   NewRoomCommand,
//   NewRoomStateSchema,
//   | { value: 'EnterName'; context: NewRoomContext }
//   | { value: 'SelectingGame'; context: NewRoomContext }
// >;
export type NewRoomService = InterpreterFrom<NewRoomMachine>;

const LayoutIslandSchema = z.enum(['MainScene', 'MainPanel', 'Chat']);
export type LayoutIsland = z.infer<typeof LayoutIslandSchema>;

export const LayoutPropsSchema = z.object({
  focusArea: LayoutIslandSchema.optional(),
});
export type LayoutProps = z.infer<typeof LayoutPropsSchema>;

const ConnectionEntityPropsSchema = z.object({
  schema: ConnectionSchemaTypeLiteral,
  sessionId: SnowflakeIdSchema.optional(),
  authTokens: AuthTokensSchema.optional(),
  deviceId: SnowflakeIdSchema.optional(),
  currentRoomSlug: SlugSchema.optional(),
  connectedRoomSlugs: z.array(SlugSchema),
  activeRoomSlugs: z.array(SlugSchema),
  chatService: z
    .object({
      context: ChatContextSchema,
      value: ChatStateValueSchema,
    })
    .optional(),
  newRoomService: z
    .object({
      context: NewRoomContextSchema,
      value: NewRoomStateValueSchema,
    })
    .optional(),
  // roomListService: z
  //   .object({
  //     context: RoomListContextSchema,
  //     value: RoomListStateValueSchema,
  //   })
  //   .optional(),
  instanceId: z.string().uuid().optional(),
});
export type ConnectionEntityProps = z.infer<typeof ConnectionEntityPropsSchema>;

type Service = {
  context: unknown;
  value: unknown;
  event: unknown;
};

type IsService<T, K> = T extends Service ? K : never;

export type EntityServices<T extends Entity> = {
  [K in keyof T as IsService<T[K], K>]: T[K];
};

export type EntityServiceKeys<TEntity extends Entity> =
  keyof EntityServices<TEntity>;

const ConnectionHeartbeatCommandSchema = z.object({
  type: z.literal('HEARTBEAT'),
});

export const HomeRoutePropsSchema = z.object({
  name: z.literal('Home'),
});

export const LoginRoutePropsSchema = z.object({
  name: z.literal('Login'),
});

export const NewRoomRoutePropsSchema = z.object({
  name: z.literal('NewRoom'),
});

export const RoomRoutePropsSchema = z.object({
  name: z.literal('Room'),
  roomSlug: z.string(),
});

export const RoutePropsSchema = z.union([
  HomeRoutePropsSchema,
  NewRoomRoutePropsSchema,
  RoomRoutePropsSchema,
  LoginRoutePropsSchema,
]);
export type RouteProps = z.infer<typeof RoutePropsSchema>;

const ConnectionNavigateCommandSchema = z.object({
  type: z.literal('NAVIGATE'),
  route: RoutePropsSchema,
});

const BaseConnectionCommandSchema = z.union([
  ConnectionInitializeCommandSchema,
  ConnectionHeartbeatCommandSchema,
  ConnectionNavigateCommandSchema,
]);

const ConnectionCommandSchema = z.union([
  BaseConnectionCommandSchema,
  NewRoomCommandSchema,
]);
export type ConnectionCommand = z.infer<typeof ConnectionCommandSchema>;

// export type ConnectionStateMachine = StateMachine<
//   ConnectionContext,
//   ConnectionStateSchema,
//   ConnectionCommand
// >;

// EntityBaseSchema.ex

const ConnectionEntitySchema = EntityBaseSchema(
  ConnectionEntityPropsSchema,
  ConnectionCommandSchema,
  ConnectionStateValueSchema
);

export type ConnectionEntity = z.infer<typeof ConnectionEntitySchema>;

const RoomStateValueSchema = z.object({
  Scene: z.enum(['Lobby', 'Loading', 'Game']),
  Active: z.enum(['No', 'Yes']), // Yes if there is at least 1 player currently connected
});

type RoomStateValue = z.infer<typeof RoomStateValueSchema>;

const RoomEntitySchema = EntityBaseSchema(
  RoomEntityPropsSchema,
  RoomCommandSchema,
  RoomStateValueSchema
);

export type RoomEntity = z.infer<typeof RoomEntitySchema>;

const CodebreakersGameMessageSchema = z.object({
  id: SnowflakeIdSchema,
  type: z.literal('PLAIN_MESSAGE'),
  senderEntityId: SnowflakeIdSchema,
  message: z.string(),
});

const CodebreakersGameEntityPropSchema = z.object({
  schema: CodebreakersGameSchemaTypeLiteral,
  gameId: CodebreakersGameId,
  playerEntityIds: z.array(SnowflakeIdSchema),
  roomEntityId: SnowflakeIdSchema,
  recentMessages: z.array(CodebreakersGameMessageSchema),
});

const CodebreakersGameStateValueSchema = z.object({
  Active: z.enum(['True', 'False']),
});

export type CodebreakersGameStateValue = z.infer<
  typeof CodebreakersGameStateValueSchema
>;

const CodebreakersGameCommandSchema = z.union([
  StartCommandSchema,
  LeaveCommandSchema,
]);

export type CodebreakersGameCommand = z.infer<
  typeof CodebreakersGameCommandSchema
>;

const CodebreakersGameEntitySchema = EntityBaseSchema(
  CodebreakersGameEntityPropSchema,
  CodebreakersGameCommandSchema,
  CodebreakersGameStateValueSchema
);

export type CodebreakersGameStateSchema =
  StateSchemaFromStateValue<CodebreakersGameStateValue>;

const CodebreakersGameContextSchema = z.object({
  foo: z.string(),
});
export type CodebreakersGameContext = z.infer<
  typeof CodebreakersGameContextSchema
>;

export type CodebreakersGameMachine = StateMachine<
  CodebreakersGameContext,
  CodebreakersGameStateSchema,
  CodebreakersGameCommand
>;

const CodebreakersPlayerMessageSchema = z.object({
  type: z.literal('PLAIN_MESSAGE'),
  id: SnowflakeIdSchema,
  senderEntityId: SnowflakeIdSchema,
  message: z.string(),
});

const CodebreakersPlayerEntityPropSchema = z.object({
  schema: CodebreakersPlayerSchemaTypeLiteral,
  gameEntityId: SnowflakeIdSchema,
  userId: UserIdSchema,
  recentMessages: z.array(CodebreakersPlayerMessageSchema),
});

const CodebreakersPlayerStateValueSchema = z.object({
  Active: z.enum(['True', 'False']),
});
export type CodebreakersPlayerStateValue = z.infer<
  typeof CodebreakersPlayerStateValueSchema
>;

const CodebreakersPlayerCommandSchema = z.union([
  StartCommandSchema,
  LeaveCommandSchema,
]);

export type CodebreakersPlayerCommand = z.infer<
  typeof CodebreakersPlayerCommandSchema
>;

const CodebreakersPlayerEntitySchema = EntityBaseSchema(
  CodebreakersPlayerEntityPropSchema,
  CodebreakersPlayerCommandSchema,
  CodebreakersPlayerStateValueSchema
);

export type CodebreakersPlayerStateSchema =
  StateSchemaFromStateValue<CodebreakersPlayerStateValue>;

const CodebreakersPlayerContextSchema = z.object({
  foo: z.string(),
});
export type CodebreakersPlayerContext = z.infer<
  typeof CodebreakersPlayerContextSchema
>;

export type CodebreakersPlayerMachine = StateMachine<
  CodebreakersPlayerContext,
  CodebreakersPlayerStateSchema,
  CodebreakersPlayerCommand
>;

const BananaTradersGameMessageSchema = z.object({
  id: SnowflakeIdSchema,
  type: z.literal('PLAIN_MESSAGE'),
  senderEntityId: SnowflakeIdSchema,
  message: z.string(),
});

const BananaTradersGameEntityPropSchema = z.object({
  schema: BananaTradersGameSchemaTypeLiteral,
  gameId: BananaTradersGameId,
  playerEntityIds: z.array(SnowflakeIdSchema),
  roomEntityId: SnowflakeIdSchema,
  recentMessages: z.array(BananaTradersGameMessageSchema),
});

const BananaTradersGameStateValueSchema = z.object({
  Active: z.enum(['True', 'False']),
});

export type BananaTradersGameStateValue = z.infer<
  typeof BananaTradersGameStateValueSchema
>;

const BananaTradersGameCommandSchema = z.union([
  StartCommandSchema,
  LeaveCommandSchema,
]);

export type BananaTradersGameCommand = z.infer<
  typeof BananaTradersGameCommandSchema
>;

const BananaTradersGameEntitySchema = EntityBaseSchema(
  BananaTradersGameEntityPropSchema,
  BananaTradersGameCommandSchema,
  BananaTradersGameStateValueSchema
);

export type BananaTradersGameStateSchema =
  StateSchemaFromStateValue<BananaTradersGameStateValue>;

const BananaTradersGameContextSchema = z.object({
  foo: z.string(),
});
export type BananaTradersGameContext = z.infer<
  typeof BananaTradersGameContextSchema
>;

export type BananaTradersGameMachine = StateMachine<
  BananaTradersGameContext,
  BananaTradersGameStateSchema,
  BananaTradersGameCommand
>;

const BananaTradersPlayerMessageSchema = z.object({
  type: z.literal('PLAIN_MESSAGE'),
  id: SnowflakeIdSchema,
  senderEntityId: SnowflakeIdSchema,
  message: z.string(),
});

const BananaTradersPlayerEntityPropSchema = z.object({
  schema: BananaTradersPlayerSchemaTypeLiteral,
  gameEntityId: SnowflakeIdSchema,
  userId: UserIdSchema,
  recentMessages: z.array(BananaTradersPlayerMessageSchema),
});

const BananaTradersPlayerStateValueSchema = z.object({
  Active: z.enum(['True', 'False']),
});
export type BananaTradersPlayerStateValue = z.infer<
  typeof BananaTradersPlayerStateValueSchema
>;

const BananaTradersPlayerCommandSchema = z.union([
  StartCommandSchema,
  LeaveCommandSchema,
]);

export type BananaTradersPlayerCommand = z.infer<
  typeof BananaTradersPlayerCommandSchema
>;

const BananaTradersPlayerEntitySchema = EntityBaseSchema(
  BananaTradersPlayerEntityPropSchema,
  BananaTradersPlayerCommandSchema,
  BananaTradersPlayerStateValueSchema
);

export type BananaTradersPlayerStateSchema =
  StateSchemaFromStateValue<BananaTradersPlayerStateValue>;

const BananaTradersPlayerContextSchema = z.object({
  foo: z.string(),
});
export type BananaTradersPlayerContext = z.infer<
  typeof BananaTradersPlayerContextSchema
>;

export type BananaTradersPlayerMachine = StateMachine<
  BananaTradersPlayerContext,
  BananaTradersPlayerStateSchema,
  BananaTradersPlayerCommand
>;

const LittleVigilanteGameMessageSchema = z.object({
  id: SnowflakeIdSchema,
  type: z.literal('PLAIN_MESSAGE'),
  senderEntityId: SnowflakeIdSchema,
  message: z.string(),
});

const LittleVigilanteGameEntityPropSchema = z.object({
  schema: LittleVigilanteGameSchemaTypeLiteral,
  gameId: LittleVigilanteGameId,
  playerEntityIds: z.array(SnowflakeIdSchema),
  roomEntityId: SnowflakeIdSchema,
  recentMessages: z.array(LittleVigilanteGameMessageSchema),
});

const LittleVigilanteGameStateValueSchema = z.object({
  Active: z.enum(['True', 'False']),
});

export type LittleVigilanteGameStateValue = z.infer<
  typeof LittleVigilanteGameStateValueSchema
>;

const LittleVigilanteGameCommandSchema = z.union([
  StartCommandSchema,
  LeaveCommandSchema,
]);

export type LittleVigilanteGameCommand = z.infer<
  typeof LittleVigilanteGameCommandSchema
>;

const LittleVigilanteGameEntitySchema = EntityBaseSchema(
  LittleVigilanteGameEntityPropSchema,
  LittleVigilanteGameCommandSchema,
  LittleVigilanteGameStateValueSchema
);

export type LittleVigilanteGameStateSchema =
  StateSchemaFromStateValue<LittleVigilanteGameStateValue>;

const LittleVigilanteGameContextSchema = z.object({
  foo: z.string(),
});
export type LittleVigilanteGameContext = z.infer<
  typeof LittleVigilanteGameContextSchema
>;

export type LittleVigilanteGameMachine = StateMachine<
  LittleVigilanteGameContext,
  LittleVigilanteGameStateSchema,
  LittleVigilanteGameCommand
>;

const LittleVigilantePlayerMessageSchema = z.object({
  type: z.literal('PLAIN_MESSAGE'),
  id: SnowflakeIdSchema,
  senderEntityId: SnowflakeIdSchema,
  message: z.string(),
});

const LittleVigilantePlayerEntityPropSchema = z.object({
  schema: LittleVigilantePlayerSchemaTypeLiteral,
  gameEntityId: SnowflakeIdSchema,
  userId: UserIdSchema,
  recentMessages: z.array(LittleVigilantePlayerMessageSchema),
});

const LittleVigilantePlayerStateValueSchema = z.object({
  Active: z.enum(['True', 'False']),
});
export type LittleVigilantePlayerStateValue = z.infer<
  typeof LittleVigilantePlayerStateValueSchema
>;

const LittleVigilantePlayerCommandSchema = z.union([
  StartCommandSchema,
  LeaveCommandSchema,
]);

export type LittleVigilantePlayerCommand = z.infer<
  typeof LittleVigilantePlayerCommandSchema
>;

const LittleVigilantePlayerEntitySchema = EntityBaseSchema(
  LittleVigilantePlayerEntityPropSchema,
  LittleVigilantePlayerCommandSchema,
  LittleVigilantePlayerStateValueSchema
);

export type LittleVigilantePlayerStateSchema =
  StateSchemaFromStateValue<LittleVigilantePlayerStateValue>;

const LittleVigilantePlayerContextSchema = z.object({
  foo: z.string(),
});
export type LittleVigilantePlayerContext = z.infer<
  typeof LittleVigilantePlayerContextSchema
>;

export type LittleVigilantePlayerMachine = StateMachine<
  LittleVigilantePlayerContext,
  LittleVigilantePlayerStateSchema,
  LittleVigilantePlayerCommand
>;

export const EntitySchema = z.union([
  ConnectionEntitySchema,
  SessionEntitySchema,
  RoomEntitySchema,
  BananaTradersGameEntitySchema,
  BananaTradersPlayerEntitySchema,
  CodebreakersGameEntitySchema,
  CodebreakersPlayerEntitySchema,
  LittleVigilanteGameEntitySchema,
  LittleVigilantePlayerEntitySchema,
]);

export type Entity = z.infer<typeof EntitySchema>;
export type EntityEvent = Parameters<Parameters<Entity['subscribe']>[0]>[0];

export const EntityCommandSchema = z.union([
  ConnectionCommandSchema,
  SessionCommandSchema,
  RoomCommandSchema,
]);

export const EntitySchemas = {
  // user: UserEntitySchema,
  room: RoomEntitySchema,
  session: SessionEntitySchema,
  connection: ConnectionEntitySchema,
  banana_traders_game: BananaTradersGameEntitySchema,
  banana_traders_player: BananaTradersPlayerEntitySchema,
  codebreakers_game: CodebreakersGameEntitySchema,
  codebreakers_player: CodebreakersPlayerEntitySchema,
  little_vigilante_game: LittleVigilanteGameEntitySchema,
  little_vigilante_player: LittleVigilantePlayerEntitySchema,
};

export const ClientEventSchema = z.object({
  id: SnowflakeIdSchema,
  senderId: SnowflakeIdSchema,
  command: z.union([RoomCommandSchema, UserCommandSchema]),
});

export type ClientEvent = z.infer<typeof ClientEventSchema>;

export type EntityMachine =
  | {
      type: 'connection';
      machine: ConnectionMachine;
    }
  | {
      type: 'user';
      machine: UserMachine;
    }
  | {
      type: 'room';
      machine: RoomMachine;
    }
  | {
      type: 'codebreakers_game';
      machine: CodebreakersGameMachine;
    }
  | {
      type: 'codebreakers_player';
      machine: CodebreakersPlayerMachine;
    }
  | {
      type: 'banana_traders_game';
      machine: BananaTradersGameMachine;
    }
  | {
      type: 'banana_traders_player';
      machine: BananaTradersPlayerMachine;
    }
  | {
      type: 'little_vigilante_game';
      machine: LittleVigilanteGameMachine;
    }
  | {
      type: 'little_vigilante_player';
      machine: LittleVigilantePlayerMachine;
    }
  | {
      type: 'session';
      machine: SessionMachine;
    };

export type EntityMachineMap = IndexByType<EntityMachine>;
