import express from 'express';
const router = express.Router();
import imageHandler from '../middleware/image_handler.js';
import {
	addUser,
	modifyUser,
	getAllUsers,
	getUserById,
	login,
} from '../controllers/user_controller.js';

// get all users
router.get('/', getAllUsers);

//get user by id
router.get('/:id', getUserById);

// add user
router.post('/create', imageHandler, addUser);

// login user
router.post('/login', login);

// modify user
router.put('/update/:id', modifyUser);

export default router;
