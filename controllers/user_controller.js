import User from '../models/user_model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// const token = jwt.sign(
// 	{
// 		user_id: response._id,
// 		username,
// 		phone,
// 		email,
// 		role: doc.role,
// 	},
// 	process.env.TOKEN_KEY,
// 	{ expiresIn: '5h' },
// );
export const addUser = async (req, res) => {
	try {
		let userData = req.body;
		const { phone, password } = req.body;

		const verifyUser = await User.findOne({ phone: phone });
		if (verifyUser) {
			return res.json({ error: 'User exists' });
		} else {
			bcrypt.hash(
				password,
				Number(process.env.SALT_ROUNDS),
				function (err, hash) {
					if (!err) {
						userData.password = hash;

						User.create(userData).then((response) => {
							if (req.file) {
								doc.image = req.file.path;
							}
							return res.json({ message: response });
						});
					} else {
						return res.status(400).json({ message: err.message });
					}
				},
			);
		}
	} catch (error) {
		console.log(error);
		return res.json({ message: error.message });
	}
};

export const modifyUser = async (req, res) => {
	try {
		let id = req.params.id;
		User.findByIdAndUpdate(id, req.body, {
			new: true,
		}).then((user) => {
			if (!user) {
				return res.status(404).json({ message: 'User not found' });
			}
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

export const getUserById = (req, res) => {
	User.findById(req.params.id)
		.then((user) => {
			if (!user) {
				return res.status(404).json({ message: 'user not found' });
			}
			return res.status(200).json({ message: user });
		})
		.catch((error) => {
			res.status(500).json({ message: 'internal error' });
			console.log(error.message);
		});
};

// user login
export async function login(req, res, next) {
	let { password, phone } = req.body;

	if (!phone || !password) {
		return res
			.status(400)
			.json({ success: false, message: 'All inputs are required' });
	}

	User.findOne({ phone })
		.then((response) => {
			if (response && bcrypt.compare(password, response.password)) {
				const token = jwt.sign(
					{
						phone: response.phone,
					},
					process.env.TOKEN_KEY,
					{ expiresIn: '24h' },
				);
				response.password = undefined;
				return res.status(200).json({ sucess: true, response, token });
			} else {
				res.status(400).json({
					sucess: false,
					err: 'Invalid Credentials',
				});
			}
		})
		.catch((err) => {
			console.log(err.message);
		});
}

// get pending  requests for trips hosted by the user
export const getAllPendingsForUser = (req, res) => {
	//trip id
	try {
		const { user_id } = req.body;

		User.findOne({ _id: user_id })
			.populate('hosted_trips')
			.then((user) => {
				if (user) {
					console.log(user);
					res.json({
						hosted_trips: user.hosted_trips.map((trip) => {
							return trip.passengers;
						}),
					});
				}
			})
			.catch((err) => {
				console.log(err.message);
			});
	} catch (error) {
		console.log(error.message);
	}
};
