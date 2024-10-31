import { checkDatabaseConnection } from "../config/db.js";
import logger from '../config/logger.js'; // Import the logger

export const healthCheck = async (req, res) => {
    // Log the incoming request
    logger.info(`Health check requested from ${req.ip}`);

    // Check for invalid requests
    if (req.headers['content-length']) {
        logger.warn('Health check received with content-length header');
        res.status(400).end();
        return;
    }
    if (Object.keys(req.body).length > 0) {
        logger.warn('Health check received with body content');
        res.status(400).end();
        return;
    }
    if (Object.keys(req.query).length > 0) {
        logger.warn('Health check received with query parameters');
        res.status(400).end();
        return;
    }

    // Check database connection
    const dbConnected = await checkDatabaseConnection();

    if (dbConnected) {
        logger.info('Database connection is healthy');
        res.status(200).end();
    } else {
        logger.error('Database connection is unhealthy');
        res.status(503).end();
    }
};

export const nonGetHealthCheck = async (req, res) => {
    logger.warn(`Non-GET request made to health check endpoint from ${req.ip}`);
    res.status(405).end();
};