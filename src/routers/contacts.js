import express from 'express';
import {
  getContacts,
  getContact,
  createNewContact,
  updateExistingContact,
  deleteExistingContact,
} from '../controllers/contacts.js';
import { authenticate } from '../middlewares/authenticate.js';
import { validateBody } from '../middlewares/validate.js';
import { isValidId } from '../middlewares/validate.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../middlewares/validate.js';

const router = express.Router();

router.get('/contacts', authenticate, getContacts);
router.get('/contacts/:contactId', authenticate, isValidId, getContact);

router.post(
  '/contacts',
  authenticate,
  validateBody(createContactSchema),
  createNewContact,
);

router.patch(
  '/contacts/:contactId',
  authenticate,
  isValidId,
  validateBody(updateContactSchema),
  updateExistingContact,
);

router.delete(
  '/contacts/:contactId',
  authenticate,
  isValidId,
  deleteExistingContact,
);

export default router;
