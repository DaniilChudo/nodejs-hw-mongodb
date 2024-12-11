import express from 'express';
import { register, login } from '../controllers/auth.js';
import { validateBody } from '../middlewares/validate.js';
import { registerSchema, loginSchema } from '../middlewares/validate.js';

const router = express.Router();

router.post('/register', validateBody(registerSchema), register);

router.post('/login', validateBody(loginSchema), login);

export default router;
