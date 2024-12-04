import Joi from 'joi';
import createError from 'http-errors';
import mongoose from 'mongoose';

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  phoneNumber: Joi.string().min(3).max(20).required(),
  email: Joi.string().email(),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'home', 'personal').required(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  phoneNumber: Joi.string().min(3).max(20),
  email: Joi.string().email(),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'home', 'personal'),
}).min(1);

export function validateBody(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false }); // Повертаємо всі помилки
    if (error) {
      throw createError(
        400,
        error.details.map((err) => err.message).join(', '),
      );
    }
    next();
  };
}

export function isValidId(req, res, next) {
  const { contactId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    // Використовуємо mongoose для валідації
    return next(createError(400, 'Invalid contact ID format'));
  }
  next();
}
