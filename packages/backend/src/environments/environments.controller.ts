import {
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
import { Environment } from '@prisma/client';
import { JwtAuthGuard } from '../auth/strategies/jwt.guard';
import { HasProjectAccessGuard } from '../projects/guards/hasProjectAccess';
import { EnvironmentCreationSchema, EnvironmentDTO } from './environments.dto';
import { EnvironmentsService } from './environments.service';
import { ValidationPipe } from '../shared/pipes/ValidationPipe';
import { Roles } from '../shared/decorators/Roles';
import { UserRoles } from '../users/roles';
import { HasEnvironmentAccessGuard } from './guards/hasEnvAccess';
@ApiBearerAuth()
@Controller()
export class EnvironmentsController {
  constructor(private readonly envService: EnvironmentsService) {}

  /**
   * Create an environment on a given project (by id)
   */
  @Post('projects/:id/environments')
  @UseGuards(HasProjectAccessGuard)
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe(EnvironmentCreationSchema))
  createEnvironment(
    @Param('id') id: string,
    @Body() envDto: EnvironmentDTO,
  ): Promise<Environment> {
    return this.envService.createEnvironment(id, envDto.name);
  }

  /**
   * Delete an environment on a given project (by project id AND env id)
   */
  @Delete('projects/:id/environments/:envId')
  @Roles(UserRoles.Admin)
  @UseGuards(HasEnvironmentAccessGuard)
  @UseGuards(JwtAuthGuard)
  deleteEnv(@Param('envId') envId: string) {
    return this.envService.deleteEnv(envId);
  }
}
