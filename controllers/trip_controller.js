import Trip from '../models/trip_model.js';
import User from '../models/user_model.js';

export const getAllTrips = (req, res) => {
	const all = req.query.all;
	var query = {};
	if (!all) {
		query = { seats: { $gte: 1 } };
	}
	try {
		Trip.find(query)
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
	try {
		//trip id
		const { id } = req.params;

		Trip.findById(id)
			.populate('passengers')
			.populate('approvedPassengers')
			.then((trip) => {
				if (!trip) {
					return res.json({ message: 'Trip not found' });
				}

				res.json(trip.passengers);
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
export const addPassenger = async (req, res) => {
	// trip id
	const { id } = req.params;

	// passenger id
	const { passengerId } = req.body;
	let trip = await Trip.findById(id);
	// console.log(trip);

	if (!trip) return res.status(404).json({ error: 'not found' });

	if (trip.passengers.includes(passengerId)) {
		return res.status(400).json({ error: 'already requested' });
	}
	if (!trip.passengers.includes(passengerId)) {
		await Trip.updateOne(
			{ _id: id },
			{ $push: { passengers: passengerId } },
			{ new: true },
		)
			.then((response) => {
				console.log(response);
				res.json(response);
			})
			.catch((error) => {
				console.log(error.message);
				res.status(500).json({ error });
			});
	}
};

// Approve a passenger
export const approvePassenger = async (req, res) => {
	const { id } = req.params;

	// passenger id
	const { passengerId } = req.body;

	const trip = await Trip.findById(id).populate('passengers');

	if (!trip) {
		return res.json({ status: 404, message: 'Passenger not found' });
	}
	if (trip.seats < 1) {
		return res.status(405).json({ message: 'seats are not available' });
	}
	if (trip.approvedPassengers.includes(passengerId)) {
		return res.status(405).json({ message: 'Passenger already aproved' });
	}
	if (!trip.passengers.includes(passengerId)) {
		return res.status(405).json({ message: 'No request from this user' });
	}

	console.log(trip);
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
