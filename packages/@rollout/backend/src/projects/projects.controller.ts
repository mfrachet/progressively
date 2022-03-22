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
import { UserProject } from '@prisma/client';
import { Roles } from '../shared/decorators/Roles';
import { UserRoles } from '../users/roles';
import { StrategyService } from '../strategy/strategy.service';
import { HasProjectAccessGuard } from './guards/hasProjectAccess';
@ApiBearerAuth()
@Controller()
export class ProjectsController {
  constructor(
    private readonly projectService: ProjectsService,
    private readonly strategyService: StrategyService,
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

  @Get('projects/:id/environments/:envId/flags/:flagId/strategies/:stratId')
  @UseGuards(HasProjectAccessGuard)
  @UseGuards(JwtAuthGuard)
  async getStrategy(@Param('stratId') stratId: string): Promise<any> {
    return this.strategyService.getStrategy(stratId);
  }
}
