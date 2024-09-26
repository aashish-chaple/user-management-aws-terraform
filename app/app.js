import express from 'express';
import cors from 'cors';
import initializeRoutes from './routes/index.js';

const initializeApp = (app) => {
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    initializeRoutes(app)
}

export default initializeApp;