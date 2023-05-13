import express from 'express';
const router = express.Router();
import {
	getAllTrips,
	getTripByID,
	deleteTrip,
	updateTrip,
	createTrip,
} from '../controllers/trip_controller.js';

// get all trips
router.get('/', getAllTrips);

// get trip by id
router.get('/:id', getTripByID);

// add trip
router.post('/', createTrip);

// update trip
router.put('/:id', updateTrip);

// delete trip
router.delete('/:id', deleteTrip);

export default router;
