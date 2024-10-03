import dotenv from 'dotenv';
import { checkDatabaseConnection, syncDatabase } from './db.js';  // Import the database functions
import configureApp from './app/app.js'; // Import the app configuration

dotenv.config();

const port = process.env.PORT || 8080;

const startServer = async () => {
    try {
        const dbConnected = await checkDatabaseConnection();
        if (!dbConnected) {
            throw new Error('Database connection failed.');
        }
        
        const dbSynced = await syncDatabase();
        if (!dbSynced) {
            throw new Error('Database sync failed.');
        }

        const app = configureApp(); // Get the configured app instance
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error('Error while starting the server:', error);
        process.exit(1);  // Exit process on failure
    }
};

startServer();

// import express from 'express';
// import dotenv from 'dotenv';
// import initializeApp from './app/app.js';
// import { checkDatabaseConnection, syncDatabase } from './db.js';  // Import the database functions

// dotenv.config();

// const port = process.env.PORT || 8080;
// const app = express();

// const startServer = async () => {
//     try {
//         const dbConnected = await checkDatabaseConnection();
//         if (!dbConnected) {
//             throw new Error('Database connection failed.');
//         }
        
//         const dbSynced = await syncDatabase();
//         if (!dbSynced) {
//             throw new Error('Database sync failed.');
//         }

//         initializeApp(app);
//         // Start the server only after successful DB connection and sync
//         app.listen(port, () => {
//             console.log(`Server is running on port ${port}`);
//         });
//     } catch (error) {
//         console.error('Error while starting the server:', error);
//         process.exit(1);  // Exit process on failure
//     }
// };

// startServer();
