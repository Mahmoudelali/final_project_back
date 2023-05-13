import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectToDatabase from './DataBase/dataBase.js';
import userRouter from './routes/user_routes.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = new express();

app.use(morgan('dev'));

app.use(express.json());

app.use(cors());

app.use(cookieParser());

app.use(express.urlencoded({ extended: false }));

app.use('/uploads', express.static('uploads'));

app.listen(
	PORT,
	console.log(
		`Server is running in ${process.env.NODE_ENV} on port ${PORT}!!!`,
	),
);
connectToDatabase();
app.get('/', (req, res) => {
	res.send('API is running...');
});

app.use('/api/user', userRouter);
