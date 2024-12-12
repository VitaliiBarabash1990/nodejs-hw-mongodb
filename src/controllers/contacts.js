import createHttpError from 'http-errors';
import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
  updateContact,
} from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

export const getContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);

  const { sortBy, sortOrder } = parseSortParams(req.query);

  const filter = parseFilterParams(req.query);

  const contacts = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
    userId: req.user.id,
  });

  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId, req.user.id);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  // //Якщо використовуємо цю умову то в services використовуємо 56 рядок, а якщо використовуємо getContactById 61 рядок то цю умову не використовуємо
  // if (contact.userId.toString() !== req.user.id.toString()) {
  //   // throw new createHttpError.Forbidden('Contacts forbidden!')//Академічно потрібно цей рядок але використовують
  //   throw new createHttpError.NotFound('Contact not found'); //Щоб заплутати небажаного користувача
  // }

  res.json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const contact = {
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    contactType: req.body.contactType,
    userId: req.user.id,
  };

  const result = await createContact(contact);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: result,
  });
};

export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;

  const contact = await deleteContact(contactId, req.user.id);

  if (!contact) {
    next(createHttpError(404, `Contact not found`));
    return;
  }

  res.status(204).send();
};

export const upsertContactController = async (req, res, next) => {
  const { contactId } = req.params;

  const result = await updateContact(contactId, req.user.id, req.body, {
    upsert: true,
  });

  if (!result) {
    next(createHttpError(404, `Contact not found`));
    return;
  }

  const status = result.isNew ? 201 : 200;

  res.status(status).json({
    status,
    message: `Succsessfully upserted a contact!`,
    data: result.student,
  });
};

export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;

  const result = await updateContact(contactId, req.user.id, req.body);

  if (!result) {
    next(createHttpError(404, `Contact not found`));
    return;
  }

  res.json({
    status: 200,
    message: `Succsessfully patched a contact!`,
    data: result.contact,
  });
};
