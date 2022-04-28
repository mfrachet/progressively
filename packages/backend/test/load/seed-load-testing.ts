import { PrismaClient } from '@prisma/client';
import { seedProjects } from '../helpers/seeds/projects';

const prismaClient = new PrismaClient();

export const seedLoadTestingData = async () => {
  await prismaClient.$connect();

  const [project] = await seedProjects(prismaClient);

  const production = await prismaClient.environment.create({
    data: {
      uuid: '1',
      name: 'Production',
      projectId: project.uuid,
    },
  });

  const homePageFlag = await prismaClient.flag.create({
    data: {
      uuid: '1',
      name: 'New homepage',
      description: 'Switch the new homepage design',
      key: 'newHomepage',
    },
  });

  const flagEnv = await prismaClient.flagEnvironment.create({
    data: {
      environmentId: production.uuid,
      flagId: homePageFlag.uuid,
      status: 'ACTIVATED',
    },
  });

  await prismaClient.$disconnect();
};
