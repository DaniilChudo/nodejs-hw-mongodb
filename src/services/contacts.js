import Contact from '../models/contact.js';

export const createContact = async (contactData) => {
  const contact = new Contact(contactData);
  await contact.save();
  return contact;
};

export const getAllContacts = async ({ skip, perPage, filter, sort }) => {
  return Contact.find(filter).skip(skip).limit(perPage).sort(sort);
};

export const getContactById = async (contactId) => {
  return Contact.findById(contactId);
};

export const updateContact = async (contactId, contactData) => {
  return Contact.findByIdAndUpdate(contactId, contactData, { new: true });
};

export const deleteContact = async (contactId) => {
  return Contact.findByIdAndDelete(contactId);
};
