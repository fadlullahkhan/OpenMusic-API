import Joi from 'joi';

export const PayloadsSchemaSong = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().required(),
  performer: Joi.string().required(),
  genre: Joi.string().required(),
  duration: Joi.number(),
  albumId: Joi.string(),
});

export const QuerySchemaSong = Joi.object({
  title: Joi.string().empty(''),
  performer: Joi.string().empty('')
})
