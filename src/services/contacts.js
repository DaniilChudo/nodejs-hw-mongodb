import Contact from '../models/contact.js';

export async function getAllContacts() {
  try {
    return await Contact.find({});
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching contacts');
  }
}

export async function getContactById(contactId) {
  try {
    return await Contact.findById(contactId);
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching contact by ID');
  }
}
