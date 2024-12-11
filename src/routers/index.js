import express from 'express';
import contactsRouter from './contacts.js';
import authRouter from './auth.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = express.Router();

router.use('/contacts', authenticate, contactsRouter);
// router.use('/contacts', contactsRouter);
router.use('/auth', authRouter);

export default router;
