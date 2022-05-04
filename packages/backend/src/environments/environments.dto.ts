import * as Joi from 'joi';

export class EnvironmentDTO {
  name: string;
}

export const EnvironmentCreationSchema = Joi.object({
  name: Joi.string().required(),
});
