import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { EnvironmentsService } from '../environments/environments.service';
import { FlagStatus } from './flags.status';
import { StrategyService } from '../strategy/strategy.service';
import { UserRetrieveDTO } from '../users/users.dto';
import { FlagsService } from './flags.service';
import { JwtAuthGuard } from '../auth/strategies/jwt.guard';
import { HasProjectAccessGuard } from '../projects/guards/hasProjectAccess';
import { FlagAlreadyExists } from './errors';
import { FlagCreationSchema } from './flags.dto';
import { ValidationPipe } from '../shared/pipes/ValidationPipe';
import { strToFlagStatus } from './utils';
import { WebsocketGateway } from '../websocket/websocket.gateway';

@Controller()
export class FlagsController {
  constructor(
    private readonly envService: EnvironmentsService,
    private readonly strategyService: StrategyService,
    private readonly flagService: FlagsService,
    private readonly wsGateway: WebsocketGateway,
  ) {}

  @Get('projects/:id/environments/:envId/flags')
  @UseGuards(HasProjectAccessGuard)
  @UseGuards(JwtAuthGuard)
  getFlagsByProjectAndEnv(@Param('envId') envId: string) {
    return this.flagService.flagsByEnv(envId);
  }

  @Post('projects/:id/environments/:envId/flags')
  @UseGuards(HasProjectAccessGuard)
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe(FlagCreationSchema))
  async createFlag(
    @Param('envId') envId,
    @Body() body: { name: string; description: string },
  ) {
    try {
      const flag = await this.flagService.createFlag(
        envId,
        body.name,
        body.description,
      );

      return flag;
    } catch (e) {
      if (e instanceof FlagAlreadyExists) {
        throw new BadRequestException('Flag already exists');
      }

      throw e;
    }
  }

  @Put('projects/:id/environments/:envId/flags/:flagId')
  @UseGuards(HasProjectAccessGuard)
  @UseGuards(JwtAuthGuard)
  async changeFlagForEnvStatus(
    @Param('envId') envId: string,
    @Param('flagId') flagId: string,
    @Body() body: { status: string },
  ) {
    const status: FlagStatus | undefined = strToFlagStatus(body.status);

    if (!status) {
      throw new BadRequestException('Invalid status code');
    }

    const updatedFlagEnv = await this.envService.changeFlagForEnvStatus(
      envId,
      flagId,
      status,
    );

    const environment = updatedFlagEnv.environment;
    const flag = updatedFlagEnv.flag;
    const updatedFlag = { [flag.key]: status === FlagStatus.ACTIVATED };

    this.wsGateway.notify(environment.clientKey, updatedFlag);

    // Removing the populated environment since it owns a clientKey that we don't want to leak out
    delete updatedFlagEnv.environment;
    delete updatedFlagEnv.flag;

    return updatedFlagEnv;
  }

  @Get('flags/sdk/:clientKey')
  async getByClientKey(@Request() req, @Param('clientKey') clientKey: string) {
    const user: UserRetrieveDTO = req.user;
    const flagEnvs = await this.envService.getEnvironmentByClientKey(clientKey);

    const dictOfFlags = {};

    // TODO: make sure to run these with Promise.all when confident enough
    for (const flagEnv of flagEnvs) {
      dictOfFlags[flagEnv.flag.key] =
        flagEnv.status === FlagStatus.ACTIVATED
          ? await this.strategyService.resolveStrategies(
              flagEnv,
              user?.uuid || '',
            )
          : false;

      await this.flagService.hitFlag(
        flagEnv.environmentId,
        flagEnv.flagId,
        flagEnv.status as FlagStatus,
      );
    }

    return dictOfFlags;
  }
}
