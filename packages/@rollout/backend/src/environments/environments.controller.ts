import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/strategies/jwt.guard';
import { HasProjectAccessGuard } from '../projects/guards/hasProjectAccess';
import { EnvironmentsService } from './environments.service';

@ApiBearerAuth()
@Controller()
export class EnvironmentsController {
  constructor(private readonly envService: EnvironmentsService) {}

  @Get('projects/:id/environments')
  @UseGuards(HasProjectAccessGuard)
  @UseGuards(JwtAuthGuard)
  getProjectEnvironments(@Param('id') id: string) {
    return this.envService.getProjectEnvironments(id);
  }
}
