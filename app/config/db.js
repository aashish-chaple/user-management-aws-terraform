import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import { logMetric } from '../utils/metricsLogger.js';

dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
});

const executeQueryWithTiming = async (queryFunc, metricName) => {
    const startTime = Date.now();
    try {
        const result = await queryFunc(); 
        const duration = Date.now() - startTime; 
        await logMetric(metricName, duration, 'Milliseconds');
        return result;
    } catch (error) {
        console.error('Error executing query:', error);
        throw error;
    }
};

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
        await sequelize.sync({ alter: true });
        console.log('Database sync successful');
        return true;
    } catch (error) {
        console.error('Unable to sync the database:', error);
        return false;
    }
};

export {sequelize, executeQueryWithTiming};