import express from 'express';
import dotenv from 'dotenv';
import initializeApp from './app/app.js';

dotenv.config();

const port = process.env.PORT || 8080;

const app = express();

initializeApp(app);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});