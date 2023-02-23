import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoute from './routes/userRoutes.js';
import cors from 'cors';
import uploadRoute from './routes/uploadRoutes.js';
import postRoute from './routes/postRoutes.js';
dotenv.config();
const app = express();

//Database connection
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log('succesfully connected to database'))
  .catch((err) => console.log(err));

//middlewares

app.use(express.json());
app.use(cors());
app.use('/users', userRoute);
app.use('/upload', uploadRoute);
app.use('/posts', postRoute);

//routes
app.get('/', (req, res) => {
  res.send('hello world');
});

const port = process.env.PORT || 4001;
app.listen(port, () => {
  console.log('server started');
});
