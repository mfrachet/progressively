import { Controller, Delete, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/strategies/jwt.guard';
import { EnvironmentsService } from './environments.service';
import { Roles } from '../shared/decorators/Roles';
import { UserRoles } from '../users/roles';
import { HasEnvironmentAccessGuard } from './guards/hasEnvAccess';
@ApiBearerAuth()
@Controller()
export class EnvironmentsController {
  constructor(private readonly envService: EnvironmentsService) {}

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
