import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    // dialectOptions: {
    //     ssl: {
    //         require: true,
    //         rejectUnauthorized: false
    //     }
    // },
    dialect: 'postgres',
});

export const checkDatabaseConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection successful');
        return true;
    } catch (error) {
        console.log('Unable to connect to the database:', error);
        return false;
    }
};

export const syncDatabase = async () => {
    try {
        console.log("Syncing DB");
        await sequelize.sync({ alter: true });  // Creates tables or replaces them
        console.log('Database sync successful');  // Move this before the return statement
        return true;
    } catch (error) {
        console.error('Unable to sync the database:', error);
        return false;
    }
};

export {sequelize};