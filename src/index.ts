import express from "express";
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db'
import authRoutes from './routes/auth.routes'
import timetableRoutes from './routes/timetable.routes'
import cookieParser from 'cookie-parser';

const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: 'http://127.0.0.1:5173' , credentials: true, }));


app.get('/', (req, res) => {
  res.send('Wassup Bro');
});

app.use('/api/auth', authRoutes);

app.use('/api/timetable', timetableRoutes);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to connect to DB", error);
  }
};

startServer();
