import express from 'express';
import {
  getContacts,
  getContact,
  createNewContact,
  updateExistingContact,
  deleteExistingContact,
} from '../controllers/contacts.js';
import { validateBody } from '../middlewares/validate.js';
import { isValidId } from '../middlewares/validate.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../middlewares/validate.js';

const router = express.Router();

router.get('/contacts', getContacts);
router.get('/contacts/:contactId', isValidId, getContact);
router.post('/contacts', validateBody(createContactSchema), createNewContact);
router.patch(
  '/contacts/:contactId',
  isValidId,
  validateBody(updateContactSchema),
  updateExistingContact,
);
router.delete('/contacts/:contactId', isValidId, deleteExistingContact);

export default router;
