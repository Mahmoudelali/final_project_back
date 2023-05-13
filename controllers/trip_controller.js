import Trip from '../models/trip_model.js';

export const getAllTrips = (req, res) => {
	try {
		Trip.find({})
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

export const getTripByID = (req, res) => {
	try {
		const trip = req.params.id;

		Trip.findById(trip)
			.then((trip) => {
				return res.status(200).json({ trip });
			})
			.catch((error) => {
				return res.status(500).json({ error: error.message });
				console.log(error.message);
			});
	} catch (error) {
		return res.status(500).json({ error: error.message });
	}
};

export const createTrip = (req, res) => {
	try {
		Trip.create(req.body)
			.then((response) => {
				return res
					.status(200)
					.json({ message: 'Success', trip: response });
			})
			.catch((err) => {
				return res.status(500).json({ message: err.message });
			});
	} catch (error) {
		return res.status(500).json({ message: 'Error creating trip' });
	}
};

export const updateTrip = (req, res) => {
	try {
		const id = req.params.id;
		Trip.updateOne({ _id: id }).then((response) => {
			if (!response) {
				return res.status(404).json({ message: 'not found' });
			} else {
				return res.status(200).json({ response });
			}
		});
	} catch (error) {
		return res.status(500).json({ message: 'Error updating trip' });
	}
};

export const deleteTrip = (req, res) => {
	try {
		const id = req.params.id;
		Trip.findOneAndDelete({ _id: id }).then((response) => {
			if (!response) {
				res.status(404).json({ message: 'not found' });
			} else {
				return res.status(200).json({ response });
			}
		});
	} catch (error) {
		return res.status(500).json({ message: 'Error deleting trip' });
	}
};
