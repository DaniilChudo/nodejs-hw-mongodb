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

export async function createContact(contactData) {
  try {
    const contact = new Contact(contactData);
    return await contact.save();
  } catch (error) {
    console.error(error);
    throw new Error('Error creating contact');
  }
}

export async function updateContact(contactId, contactData) {
  try {
    return await Contact.findByIdAndUpdate(contactId, contactData, {
      new: true,
    });
  } catch (error) {
    console.error(error);
    throw new Error('Error updating contact');
  }
}

export async function deleteContact(contactId) {
  try {
    return await Contact.findByIdAndDelete(contactId);
  } catch (error) {
    console.error(error);
    throw new Error('Error deleting contact');
  }
}
