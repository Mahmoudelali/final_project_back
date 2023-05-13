import express from 'express';
import { addUser, modifyUser } from '../controllers/user_controller.js';
const router = express.Router();

router.post('/create', addUser);
router.put('/modify', modifyUser);

export default router;
