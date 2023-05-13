import User from '../models/user_model.js';

export const addUser = async (req, res) => {
	try {
		await User.create(req.body).then((response) => {
			console.log(response);
			return res.json({ message: response });
		});
	} catch (error) {
		console.log(error.message);
		return res.json({ message: error.message });
	}
};

export const modifyUser = async (req, res) => {
	try {
		let id = req.params.id;
		User.updateOne({ _id: id }, req.body, {
			new: true,
		}).then((user) => {
			if (!user) {
				return res.status(404).json({ message: 'User not found' });
			}
			console.log(user);
			return res.status(200).json({ message: 'user updated', user });
		});
	} catch (error) {
		console.log(error);
		return res
			.status(404)
			.json({ message: 'failed', error: error.message });
	}
};

export const getAllUsers = (req, res) => {
	try {
		User.find({}).then((user) => {
			if (!user) {
				return res.json({ message: 'No user found' }).status(404);
			}
			return res.json({ message: user });
		});
	} catch (error) {
		return res.json({ error: error.message });
	}
};
