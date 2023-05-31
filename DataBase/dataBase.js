import mongoose from 'mongoose';
import dotenv from 'dotenv';
mongoose.set('strictQuery', true);
dotenv.config();

const connectToDatabase = async () => {
	await mongoose
		.connect(process.env.MONGODB_URL, { useUnifiedTopology: true })
		.then(() => {
			console.log(`connected to database`);
		})
		.catch((error) => {
			console.log(error);
		});
};

export default connectToDatabase;
