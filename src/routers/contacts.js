import express from 'express';
import {
  getContacts,
  getContact,
  createNewContact,
  updateExistingContact,
  deleteExistingContact,
} from '../controllers/contacts.js';
import { validateBody } from '../middlewares/validate.js';
import { isValidId } from '../middlewares/validate.js'; // Новий middleware

const router = express.Router();

router.get('/contacts', getContacts);
router.get('/contacts/:contactId', isValidId, getContact);
router.post('/contacts', validateBody('createContact'), createNewContact);
router.patch(
  '/contacts/:contactId',
  isValidId,
  validateBody('updateContact'),
  updateExistingContact,
);
router.delete('/contacts/:contactId', isValidId, deleteExistingContact);

export default router;
