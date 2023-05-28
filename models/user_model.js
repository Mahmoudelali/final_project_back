import { Schema, model } from 'mongoose';

const User = new Schema(
	{
		first_name: {
			trim: true,
			type: String,
			required: true,
		},
		last_name: {
			trim: true,
			type: String,
			required: true,
		},
		phone: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		image: {
			type: String,
		},
		joined_trips: {
			type: Number,
			required: true,
			default: 0,
		},
		hosted_trips: {
			type: Number,
			required: true,
			default: 0,
		},
	},
	{ Collection: 'Users' },
);

export default model('User', User);
