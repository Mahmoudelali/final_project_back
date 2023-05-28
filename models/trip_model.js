import { Schema, model } from 'mongoose';
// import { approvePassenger } from '../controllers/trip_controller';

const Trip = new Schema(
	{
		host_name: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			index: {
				unique: false,
			},
		},
		passengers: {
			type: [Schema.Types.ObjectId],
			ref: 'User',
		},
		approvedPassengers: [
			{
				type: Schema.Types.ObjectId,
				ref: 'User',
			},
		],
		start_location: {
			type: String,
			required: true,
		},
		end_location: {
			type: String,
			required: true,
		},
		start_date: {
			type: String,
			required: true,
		},
		start_time: {
			type: String,
			required: true,
		},
		seats: {
			type: Number,
			required: true,
		},
		available_seats: {
			type: Number,
		},
		vehicle_type: {
			type: String,
			required: true,
		},
		cost: {
			type: Number,
			required: true,
		},
		trip_type: {
			type: String,
		},
		description: {
			type: String,
		},
	},
	{
		collection: 'Trips',
	},
);
Trip.index({ host_name: 1 }, { unique: false });

// Trip.pre(
// 	[
// 		'find',
// 		'findOne',
// 		'create',
// 		'save',
// 		'findOneAndUpdate',
// 		'findOneAndDelete',
// 	],
// 	function () {
// 		this.populate(['host_name', 'passengers']);
// 	},
// );

export default model('Trip', Trip);
