import Joi from 'joi';

const SongPayloadsSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().required(),
  performer: Joi.string().required(),
  genre: Joi.string().required(),
  duration: Joi.number(),
  albumId: Joi.string(),
});

export default SongPayloadsSchema;
