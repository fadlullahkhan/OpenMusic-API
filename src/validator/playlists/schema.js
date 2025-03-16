import Joi from 'joi';

export const PlaylistPayloadSchema = Joi.object({
  name: Joi.string().required(),
});
