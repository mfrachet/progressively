import {
  Body,
  Controller,
  Post,
  UseGuards,
  UsePipes,
  Request,
  Get,
  Param,
  Delete,
  Put,
  BadRequestException,
  Query,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ValidationPipe } from '../shared/pipes/ValidationPipe';
import { JwtAuthGuard } from '../auth/strategies/jwt.guard';
import {
  ProjectCreationDTO,
  ProjectCreationSchema,
  StrategyCreateDTO,
  StrategySchema,
} from './projects.dto';
import { ProjectsService } from './projects.service';
import { UserRetrieveDTO } from 'src/users/users.dto';
import { FlagsService } from '../flags/flags.service';
import { FlagStatus } from '../flags/flags.status';
import { EnvironmentsService } from '../environments/environments.service';
import { WebsocketGateway } from '../websocket/websocket.gateway';
import { strToFlagStatus } from './utils';
import { Environment, UserProject } from '@prisma/client';

import { Roles } from '../shared/decorators/Roles';
import { UserRoles } from '../users/roles';
import { StrategyService } from '../strategy/strategy.service';
import { FlagCreationSchema } from '../flags/flags.dto';
import { FlagAlreadyExists } from '../flags/errors';
import { HasProjectAccessGuard } from './guards/hasProjectAccess';
@ApiBearerAuth()
@Controller()
export class ProjectsController {
  constructor(
    private readonly projectService: ProjectsService,
    private readonly flagService: FlagsService,
    private readonly envService: EnvironmentsService,
    private readonly strategyService: StrategyService,
    private readonly wsGateway: WebsocketGateway,
  ) {}

  @Get('projects/:id')
  @UseGuards(HasProjectAccessGuard)
  @UseGuards(JwtAuthGuard)
  getById(
    @Param('id') id: string,
    @Query('populate') populateMember?: boolean,
  ) {
    return this.projectService.getById(id, populateMember);
  }

  @Get('projects')
  @UseGuards(JwtAuthGuard)
  getAllProjects(@Request() req) {
    const user: UserRetrieveDTO = req.user;

    return this.projectService.getAll(user.uuid);
  }

  @Post('projects')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe(ProjectCreationSchema))
  async createProject(
    @Request() req,
    @Body() projectDto: ProjectCreationDTO,
  ): Promise<UserProject> {
    const user: UserRetrieveDTO = req.user;

    return this.projectService.createProject(projectDto.name, user.uuid);
  }

  @Delete('projects/:id/members/:memberId')
  @Roles(UserRoles.Admin)
  @UseGuards(HasProjectAccessGuard)
  @UseGuards(JwtAuthGuard)
  async deleteMember(
    @Param('id') id: string,
    @Param('memberId') memberId: string,
  ) {
    const userProject = await this.projectService.userProject(id, memberId);

    if (!userProject) {
      throw new NotFoundException();
    }

    if (userProject.role === UserRoles.Admin) {
      throw new UnauthorizedException();
    }

    return this.projectService.removeMember(id, memberId);
  }

  @Delete('projects/:id')
  @Roles(UserRoles.Admin)
  @UseGuards(HasProjectAccessGuard)
  @UseGuards(JwtAuthGuard)
  delete(@Param('id') id: string) {
    return this.projectService.deleteProject(id);
  }

  /**
   * The id argument is used by the guard
   */
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

  @Delete('projects/:id/environments/:envId/flags/:flagId')
  @UseGuards(HasProjectAccessGuard)
  @UseGuards(JwtAuthGuard)
  async deleteFlag(
    @Param('envId') envId: string,
    @Param('flagId') flagId: string,
  ) {
    return this.flagService.deleteFlag(envId, flagId);
  }

  // Strategies
  @Post('projects/:id/environments/:envId/flags/:flagId/strategies')
  @UseGuards(HasProjectAccessGuard)
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe(StrategySchema))
  async addStrategyToProject(
    @Param('envId') envId: string,
    @Param('flagId') flagId: string,
    @Body() strategyDto: StrategyCreateDTO,
  ): Promise<any> {
    return this.strategyService.addStrategyToFlagEnv(
      envId,
      flagId,
      strategyDto,
    );
  }

  @Get('projects/:id/environments/:envId/flags/:flagId/strategies')
  @UseGuards(HasProjectAccessGuard)
  @UseGuards(JwtAuthGuard)
  async getStrategies(
    @Param('envId') envId: string,
    @Param('flagId') flagId: string,
  ): Promise<any> {
    return this.strategyService.listStrategies(envId, flagId);
  }

  @Get('projects/:id/environments/:envId/flags/:flagId/hits')
  @UseGuards(HasProjectAccessGuard)
  @UseGuards(JwtAuthGuard)
  async getFlagHits(
    @Param('envId') envId: string,
    @Param('flagId') flagId: string,
  ): Promise<any> {
    return this.flagService.listFlagHits(envId, flagId);
  }

  @Get('projects/:id/environments/:envId/flags/:flagId/strategies/:stratId')
  @UseGuards(HasProjectAccessGuard)
  @UseGuards(JwtAuthGuard)
  async getStrategy(@Param('stratId') stratId: string): Promise<any> {
    return this.strategyService.getStrategy(stratId);
  }
}
