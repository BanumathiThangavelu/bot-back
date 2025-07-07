import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoute.js';
import postRoutes from './routes/postRoute.js';
import cors from 'cors';
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE',
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
const port = process.env.PORT || 3000;
app.use('/api/auth', authRoutes);
app.use('/api/chat', postRoutes);
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log('MongoDB Connected:', conn.connection.host);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
connectDB();

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
