import Joi from 'joi';

export const SongListPayloadSchema = Joi.object({
  songId: Joi.string().required()
})