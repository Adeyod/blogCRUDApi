import express from 'express';
import {
  loginUser,
  registerUser,
  verifyUser,
  userLogout,
  getUser,
} from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/logout', userLogout);
router.get('/get-user/:id', getUser);
router.post('/login', loginUser);
router.get('/confirm/:token/:id', verifyUser);

export default router;
