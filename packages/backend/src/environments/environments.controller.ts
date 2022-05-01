import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/strategies/jwt.guard';
import { EnvironmentsService } from './environments.service';
import { Roles } from '../shared/decorators/Roles';
import { UserRoles } from '../users/roles';
import { HasEnvironmentAccessGuard } from './guards/hasEnvAccess';
import { ValidationPipe } from '../shared/pipes/ValidationPipe';
import { FlagsService } from '../flags/flags.service';
import { FlagAlreadyExists } from '../flags/errors';
import { FlagCreationSchema } from '../flags/flags.dto';
@ApiBearerAuth()
@Controller('environments')
export class EnvironmentsController {
  constructor(
    private readonly envService: EnvironmentsService,
    private readonly flagService: FlagsService,
  ) {}

  /**
   * Get all the flag of a given project/env (by projectId and envId)
   */
  @Get(':envId/flags')
  @UseGuards(HasEnvironmentAccessGuard)
  @UseGuards(JwtAuthGuard)
  getFlagsByProjectAndEnv(@Param('envId') envId: string) {
    return this.flagService.flagsByEnv(envId);
  }

  /**
   * Create a flag on a given project/env (by projectId and envId)
   */
  @Post(':envId/flags')
  @UseGuards(HasEnvironmentAccessGuard)
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

  /**
   * Delete an environment on a given project (by project id AND env id)
   */
  @Delete(':envId')
  @Roles(UserRoles.Admin)
  @UseGuards(HasEnvironmentAccessGuard)
  @UseGuards(JwtAuthGuard)
  deleteEnv(@Param('envId') envId: string) {
    return this.envService.deleteEnv(envId);
  }

  /**
   * Get the flag hits grouped by date
   */
  @Get('projects/:id/environments/:envId/flags/:flagId/hits')
  @UseGuards(HasEnvironmentAccessGuard)
  @UseGuards(JwtAuthGuard)
  async getFlagHits(
    @Param('envId') envId: string,
    @Param('flagId') flagId: string,
  ): Promise<any> {
    const rawHits = await this.flagService.listFlagHits(envId, flagId);

    return rawHits.map(({ _count, date }) => ({ count: _count.id, date }));
  }
}
