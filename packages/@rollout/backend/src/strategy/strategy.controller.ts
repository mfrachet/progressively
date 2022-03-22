import {
  Body,
  Controller,
  Param,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/strategies/jwt.guard';
import { HasProjectAccessGuard } from '../projects/guards/hasProjectAccess';
import { StrategySchema, StrategyCreateDTO } from './strategy.dto';
import { ValidationPipe } from '../shared/pipes/ValidationPipe';
import { ApiBearerAuth } from '@nestjs/swagger';
import { StrategyService } from './strategy.service';

@ApiBearerAuth()
@Controller()
export class StrategyController {
  constructor(private readonly strategyService: StrategyService) {}

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
}
