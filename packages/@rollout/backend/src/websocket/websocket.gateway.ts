import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
} from '@nestjs/websockets';
import { StrategyService } from '../strategy/strategy.service';
import { URL } from 'url';
import { Rooms } from './rooms';
import { Environment, Flag, FlagEnvironment } from '@prisma/client';
import { FlagStatus } from '../flags/flags.status';

@WebSocketGateway(4001)
export class WebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private rooms: Rooms;

  constructor(private readonly strategyService: StrategyService) {
    this.rooms = new Rooms();
  }

  handleDisconnect(socket: any) {
    this.rooms.leave(socket);
  }

  handleConnection(socket: any, req: any) {
    const useLessPrefix = `http://localhost`; // just to be able to rely on the URL class
    const searchParams = new URL(`${useLessPrefix}${req.url}`).searchParams;
    const queryParams = Object.fromEntries(searchParams);

    if (queryParams.client_key) {
      const { queryClient, ...fields } = queryParams;
      socket.__ROLLOUT_ROOMS = [];
      socket.__ROLLOUT_FIELDS = fields;
      this.rooms.join(queryParams.client_key, socket);
    }
  }

  notifyFlagChanging(
    flagEnv: FlagEnvironment & { environment: Environment; flag: Flag },
  ) {
    const room = flagEnv.environment.clientKey;

    const updatedFlag = {
      [flagEnv.flag.key]: flagEnv.status === FlagStatus.ACTIVATED,
    };

    this.rooms.emit(room, updatedFlag);
  }
}
