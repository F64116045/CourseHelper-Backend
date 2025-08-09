import express from "express";
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db'
import authRoutes from './routes/auth.routes'
import timetableRoutes from './routes/timetable.routes'
import attendanceRouter from './routes/attendance.route';
import semesterRouter from './routes/semester.routes';
import cookieParser from 'cookie-parser';

const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');

app.use(express.json());
app.use(cookieParser());
const allowedOrigins =['http://127.0.0.1:5173', 'https://course-project-eight-omega.vercel.app'];
app.use(cors({ origin:  allowedOrigins,
                        credentials: true, }));


app.get('/', (req, res) => {
  res.send('Wassup Bro');
});

app.use('/api/auth', authRoutes);

app.use('/api/timetable', timetableRoutes);

app.use('/api/attendance', attendanceRouter);

app.use('/api/semesters', semesterRouter);

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
