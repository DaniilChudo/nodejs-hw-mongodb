import Joi from 'joi';
import createError from 'http-errors';

const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  phoneNumber: Joi.string().min(3).max(20).required(),
  email: Joi.string().email(),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'home', 'personal').required(),
});

const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  phoneNumber: Joi.string().min(3).max(20),
  email: Joi.string().email(),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'home', 'personal'),
}).min(1);

export function validateBody(schemaType) {
  const schema =
    schemaType === 'createContact' ? createContactSchema : updateContactSchema;
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      throw createError(400, error.details[0].message);
    }
    next();
  };
}

export function isValidId(req, res, next) {
  const { contactId } = req.params;
  if (!/^[0-9a-fA-F]{24}$/.test(contactId)) {
    return next(createError(400, 'Invalid contact ID format'));
  }
  next();
}
