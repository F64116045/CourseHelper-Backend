import express from 'express';
import { registerUser } from '../controllers/controller.register';
import { loginUser } from '../controllers/controller.login';
import { refreshToken } from './token';

const router = express.Router();
router.post('/register',registerUser);
router.post('/login', loginUser);
router.post('/refresh-token', refreshToken)

export default router;
