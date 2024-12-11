import Contact from '../models/contact.js';

export const createContact = async (userId, contactData) => {
  const contact = new Contact({ ...contactData, userId });
  await contact.save();
  return contact;
};

export const getAllContacts = async ({
  userId,
  skip,
  perPage,
  filter,
  sort,
}) => {
  return Contact.find({ userId, ...filter })
    .skip(skip)
    .limit(perPage)
    .sort(sort);
};

export const getContactById = async (contactId, userId) => {
  return Contact.findOne({ _id: contactId, userId });
};

export const updateContact = async (contactId, userId, contactData) => {
  return Contact.findOneAndUpdate({ _id: contactId, userId }, contactData, {
    new: true,
  });
};

export const deleteContact = async (contactId, userId) => {
  return Contact.findOneAndDelete({ _id: contactId, userId });
};
