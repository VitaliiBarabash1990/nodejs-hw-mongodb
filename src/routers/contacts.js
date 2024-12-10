import { Router } from 'express';
import {
  createContactController,
  deleteContactController,
  getContactByIdController,
  getContactsController,
  patchContactController,
  upsertContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contacts.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';
import { checkRoles } from '../middlewares/checkRoles.js';
import { ROLES } from '../constants/index.js';

const router = Router();

router.use(authenticate);

router.get('/', checkRoles(ROLES.TEACHER), ctrlWrapper(getContactsController));

router.get(
  '/:contactId',
  checkRoles(ROLES.TEACHER, ROLES.PARENT),
  isValidId,
  ctrlWrapper(getContactByIdController),
);

// router.post(
//   '/',
//   checkRoles(ROLES.TEACHER),
//   validateBody(createContactSchema),
//   ctrlWrapper(createContactController),
// );

router.post(
  '/register',
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);

router.delete(
  '/:contactId',
  checkRoles(ROLES.TEACHER),
  isValidId,
  ctrlWrapper(deleteContactController),
);

router.put(
  '/:contactId',
  checkRoles(ROLES.TEACHER),
  isValidId,
  validateBody(createContactSchema),
  ctrlWrapper(upsertContactController),
);

router.patch(
  '/:contactId',
  checkRoles(ROLES.TEACHER, ROLES.PARENT),
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(patchContactController),
);

export default router;
