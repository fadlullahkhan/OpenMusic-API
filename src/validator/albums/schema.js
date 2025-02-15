import Joi from 'joi';

const AlbumPayloadsSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().required(),
});

export default AlbumPayloadsSchema;
