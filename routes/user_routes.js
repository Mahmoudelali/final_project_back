import express from 'express';
const router = express.Router();
import {
	addUser,
	modifyUser,
	getAllUsers,
	getUserById,
} from '../controllers/user_controller.js';

// get all users
router.get('/', getAllUsers);

//get user by id
router.get('/:id', getUserById);

// add user
router.post('/create', addUser);

// modify user
router.put('/update/:id', modifyUser);

export default router;
