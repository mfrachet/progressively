import { Module } from '@nestjs/common';
import { WebsocketGateway } from '../websocket/websocket.gateway';
import { EnvironmentsService } from '../environments/environments.service';
import { FlagsService } from '../flags/flags.service';
import { PrismaService } from '../prisma.service';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { StrategyService } from '../strategy/strategy.service';

@Module({
  controllers: [ProjectsController],
  providers: [
    ProjectsService,
    FlagsService,
    PrismaService,
    EnvironmentsService,
    WebsocketGateway,
    StrategyService,
  ],
  exports: [ProjectsService],
})
export class ProjectsModule {}
