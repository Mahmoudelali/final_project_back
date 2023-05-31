import express from 'express';
const router = express.Router();
import { verifyUser } from '../middleware/auth.js';
import {
	getAllTrips,
	getTripByID,
	deleteTrip,
	updateTrip,
	createTrip,
	addPassenger,
	approvePassenger,
	getAllPendings,
	search,
} from '../controllers/trip_controller.js';

// get all trips
router.get('/', getAllTrips);

// get trip by id
router.get('/:id', getTripByID);

// add trip
router.post('/create', createTrip);

// Add a passenger to a trip
router.post('/:id/passengers', addPassenger);

// Approve a passenger for a trip
router.post('/:id/approve', approvePassenger);

// Get all pending join requests for a trip
router.get('/:id/requests', getAllPendings);

// update trip
router.put('/:id', updateTrip);

// delete trip
router.delete('/:id', deleteTrip);

//search
router.get('/search', search);

export default router;
