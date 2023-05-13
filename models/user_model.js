import mongoose, { Schema, model } from 'mongoose';

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
		number: {
			type: Number,
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
	{
		collection: 'Users',
	},
);

export default model('User', User);
