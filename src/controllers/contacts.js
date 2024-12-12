import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';
import createError from 'http-errors';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import Contact from '../models/contact.js';

export const getContacts = ctrlWrapper(async (req, res) => {
  let {
    page = 1,
    perPage = 10,
    sortBy = 'name',
    sortOrder = 'asc',
    type,
    isFavourite,
  } = req.query;

  page = Number(page);
  perPage = Number(perPage);

  const skip = (page - 1) * perPage;
  const filter = { userId: req.user._id };

  if (type) filter.contactType = type;
  if (isFavourite !== undefined) filter.isFavourite = isFavourite === 'true';

  const sort = {};
  sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

  const contacts = await getAllContacts({ skip, perPage, filter, sort });

  const totalItems = await Contact.countDocuments(filter);
  const totalPages = Math.ceil(totalItems / perPage);

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: {
      data: contacts,
      page,
      perPage,
      totalItems,
      totalPages,
      hasPreviousPage: page > 1,
      hasNextPage: page < totalPages,
    },
  });
});

export const getContact = ctrlWrapper(async (req, res) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId, req.user._id); // Додаємо перевірку за userId

  if (!contact) {
    throw createError(404, 'Contact not found or unauthorized');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
});

export const createNewContact = ctrlWrapper(async (req, res) => {
  const contactData = { ...req.body, userId: req.user._id }; // Додаємо userId
  const contact = await createContact(contactData);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
});

export const updateExistingContact = ctrlWrapper(async (req, res) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId, req.user._id); // Додаємо перевірку за userId

  if (!contact) {
    throw createError(404, 'Contact not found or unauthorized');
  }

  const updatedContact = await updateContact(contactId, req.user._id, req.body); // Додаємо userId
  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updatedContact,
  });
});

export const deleteExistingContact = ctrlWrapper(async (req, res) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId, req.user._id); // Додаємо перевірку за userId

  if (!contact) {
    throw createError(404, 'Contact not found or unauthorized');
  }

  await deleteContact(contactId, req.user._id); // Додаємо userId
  res.status(204).send();
});
