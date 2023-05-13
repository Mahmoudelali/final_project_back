
import { Schema, model } from 'mongoose';

const Trip = new Schema(
	{
		host_name: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		passengers: {
			type: [Schema.Types.ObjectId],
		},
		start_location: {
			type: String,
			required: true,
		},
		end_location: {
			type: String,
			required: true,
		},
		start_date: {
			type: Date,
			required: true,
		},
		available_seats: {
			type: Number,
		},
		vehicle_type: {
			type: String,
		},
		cost: {
			type: Number,
		},
		trip_type: {
			enum: [''],
		},
		description: {
			type: String,
		},
	},
	{
		collection: 'Trips',
	},
);

// Trip.pre(['find', 'findOne', 'create', 'save' ,'findOneAndUpdate' , 'findOneAndDelete'], function () {
// 	this.populate(['host_name', 'passengers']);
// });

export default model('Trip', Trip);

