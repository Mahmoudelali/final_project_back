import Trip from '../models/trip_model.js';
import User from '../models/user_model.js';

export const getAllTrips = (req, res) => {
	try {
		Trip.find({})
			.populate('host_name')
			.populate('passengers')
			.populate('approvedPassengers')
			.then((trips) => {
				if (!trips) {
					return res.json({ message: 'No trips found' });
				}
				return res.status(200).json({ trips });
			})
			.catch((error) => {
				console.log(error.message);
				return res.status(500).json({ message: error.message });
			});
	} catch (error) {
		console.log(error.message);
		return res.status(500).json({ error: error.message });
	}
};

// get pending request
export const getAllPendings = (req, res) => {
	//trip id
	try {
		const { id } = req.params;

		Trip.findById(id)
			.populate('passengers')
			.populate('approvedPassengers')
			.then((trip) => {
				if (!trip) {
					return res.json({ message: 'Trip not found' });
				}
				const pendingRequests = trip.passengers.filter(
					(passenger) =>
						!trip.approvedPassengers.includes(passenger._id),
				);
				res.json(pendingRequests);
			})
			.catch((err) => {
				res.status(500).json({
					error: err.messsage,
				});
			});
	} catch (error) {
		console.log(error.message);
	}
};
//get  by id
export const getTripByID = (req, res) => {
	try {
		const trip = req.params.id;

		Trip.findById(trip)
			.populate(['host_name', 'passengers'])
			.then((trip) => {
				return res.status(200).json({ trip });
			})
			.catch((error) => {
				return res.status(500).json({ error: error.message });
			});
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};
//new Trip
export const createTrip = async (req, res) => {
	try {
		const { host_name } = req.body;

		Trip.create(req.body)
			.then(async (response) => {
				const host = await User.updateOne(
					{ _id: host_name },
					{ $push: { hosted_trips: response } },
				).then((res) => {
					{
						console.log(res);
					}
				});

				return res
					.status(200)
					.json({ message: 'Success', trip: response });
			})
			.catch((err) => {
				console.log(err);
				return res.status(500).json({ message: err.message });
			});
	} catch (error) {
		return res.status(500).json({ message: 'Error creating trip' });
	}
};
// update a Trip
export const updateTrip = async (req, res) => {
	try {
		//trip id
		const id = req.params.id;

		const trip = await Trip.findOneAndUpdate({ _id: id }, req.body, {
			new: true,
		});
		if (!trip) {
			return res.status(404).json({ message: 'not found' });
		} else {
			return res
				.status(200)
				.json({ message: 'updated successfuly !', trip });
		}
	} catch (error) {
		return res.status(500).json({ message: 'Error updating trip' });
	}
};
//delete Trip
export const deleteTrip = (req, res) => {
	try {
		const id = req.params.id;
		Trip.findOneAndDelete({ _id: id }).then((response) => {
			if (!response) {
				res.status(404).json({ message: 'not found' });
			} else {
				return res
					.status(200)
					.json({ message: 'deleted successfuly !', response });
			}
		});
	} catch (error) {
		return res.status(500).json({ message: 'Error deleting trip' });
	}
};

// Add a passenger to a trip
export const addPassenger = (req, res) => {
	// trip id
	const { id } = req.params;

	// passenger id
	const { passengerId } = req.body;

	Trip.findByIdAndUpdate(
		id,
		{ $push: { passengers: passengerId } },
		{ new: true },
	)
		.then((trip) => res.json(trip))
		.catch((err) => {
			console.error('Failed to add passenger to trip', err);
			res.status(500);
		});
};

// Approve a passenger
export const approvePassenger = async (req, res) => {
	const { id } = req.params;

	// passenger id
	const { passengerId } = req.body;
	const passengerAvailable = await Trip.findOne({ _id: req.params.id })
		.passengers;

	if (!passengerAvailable) {
		return res.json({ status: 404, message: 'Passenger not found' });
	} else {
		console.log(passengerAvailable);
		await Trip.updateOne(
			{ _id: id },
			{
				$pull: { passengers: passengerId },
				$push: { approvedPassengers: passengerId },
				$inc: { seats: -1 },
			},
			{ new: true },
		)
			.then((trip) => {
				if (!trip) {
					return res.status(404).json({
						success: false,
						message: 'could not find trip',
					});
				} else {
					console.log(trip.approvedPassengers);
					return res.json({
						success: true,
						trip,
					});
				}
			})
			.catch((err) => {
				return res.status(500).json({ error: err.message });
			});
	}
};

export const search = (req, res) => {
	const searchTerm = req.query.term; // Get the search term from the query string

	MyCollection.find({
		$or: [
			{ title: { $regex: searchTerm, $options: 'i' } },
			{ description: { $regex: searchTerm, $options: 'i' } },
		],
	})
		.then((results) => {
			res.json(results);
		})
		.catch((err) => {
			console.error('Error searching in MongoDB:', err);
			res.status(500).send('Internal Server Error');
		});
};
