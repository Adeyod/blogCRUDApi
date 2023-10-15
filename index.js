import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();

import userRoute from './routes/authRoute.js';
import postRoute from './routes/postRoute.js';

import DbConfig from './config/DbConfig.js';
DbConfig;

const app = express();

app.use(cookieParser());
app.use([express.json(), express.urlencoded({ extended: true }), cors()]);

app.use('/auth', userRoute);
app.use('/', postRoute);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
