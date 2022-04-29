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
import { JwtAuthGuard } from '../auth/strategies/jwt.guard';
import { StrategySchema, StrategyCreateDTO } from './strategy.dto';
import { ValidationPipe } from '../shared/pipes/ValidationPipe';
import { StrategyService } from './strategy.service';
import { HasFlagAccessGuard } from '../flags/guards/hasFlagAccess';

@ApiBearerAuth()
@Controller()
export class StrategyController {
  constructor(private readonly strategyService: StrategyService) {}

  @Get('projects/:id/environments/:envId/flags/:flagId/strategies/:stratId')
  @UseGuards(HasFlagAccessGuard)
  @UseGuards(JwtAuthGuard)
  async getStrategy(@Param('stratId') stratId: string): Promise<any> {
    return this.strategyService.getStrategy(stratId);
  }

  @Delete('projects/:id/environments/:envId/flags/:flagId/strategies/:stratId')
  @UseGuards(HasFlagAccessGuard)
  @UseGuards(JwtAuthGuard)
  async deleteStrategy(@Param('stratId') stratId: string): Promise<any> {
    return this.strategyService.deleteStrategy(stratId);
  }
}
