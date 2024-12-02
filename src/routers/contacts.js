import express from 'express';
import {
  getContacts,
  getContact,
  createNewContact,
  updateExistingContact,
  deleteExistingContact,
} from '../controllers/contacts.js';

const router = express.Router();

// Роут для отримання всіх контактів
router.get('/contacts', getContacts);

// Роут для отримання контакту за ID
router.get('/contacts/:contactId', getContact);

// Роут для створення нового контакту
router.post('/contacts', createNewContact);

// Роут для оновлення контакту
router.patch('/contacts/:contactId', updateExistingContact);

// Роут для видалення контакту
router.delete('/contacts/:contactId', deleteExistingContact);

export default router;
