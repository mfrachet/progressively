import * as Joi from 'joi';

export class ProjectCreationDTO {
  name: string;
}

export interface ProjectRetrieveDTO {
  uuid: string;
  name: string;
  createdAt: Date;
}

export class MemberProjectDTO {
  email: string;
}

export const ProjectCreationSchema = Joi.object({
  name: Joi.string().required(),
});
