import { checkDatabaseConnection } from "../config/db.js";
import logger from '../config/logger.js'; // Import the logger
import statsd from '../config/statsdConfig.js'; // Import the StatsD client

export const healthCheck = async (req, res) => {
    const startTime = Date.now(); // Start timing the request
    logger.info(`Health check requested from ${req.ip}`);

    if (req.headers['content-length']) {
        logger.warn('Health check received with content-length header');
        statsd.increment('api.${req.path}.get.health_check.calls.invalid'); // Count invalid calls
        res.status(400).end();
        return;
    }
    if (Object.keys(req.body).length > 0) {
        logger.warn('Health check received with body content');
        statsd.increment('api.${req.path}.get.health_check.calls.invalid'); // Count invalid calls
        res.status(400).end();
        return;
    }
    if (Object.keys(req.query).length > 0) {
        logger.warn('Health check received with query parameters');
        statsd.increment('api.${req.path}.get.health_check.calls.invalid'); // Count invalid calls
        res.status(400).end();
        return;
    }

    // Check database connection
    const dbConnected = await checkDatabaseConnection();

    if (dbConnected) {
        logger.info('Database connection is healthy');
        statsd.increment('api.${req.path}.get.health_check.calls.success'); // Count successful calls
        res.status(200).end();
    } else {
        logger.error('Database connection is unhealthy');
        statsd.increment('api.${req.path}.get.health_check.calls.failure'); // Count failed calls
        res.status(503).end();
    }

    const duration = Date.now() - startTime; // Calculate duration
    statsd.timing('api.${req.path}.get.health_check.duration', duration); // Log the duration
};

export const nonGetHealthCheck = async (req, res) => {
    logger.warn(`Non-GET request made to health check endpoint from ${req.ip}`);
    statsd.increment('api.${req.path}.get.health_check.non_get_requests'); // Count non-GET requests
    res.status(405).end();
};

// import { checkDatabaseConnection } from "../config/db.js";
// import logger from '../config/logger.js';
// import statsd from "../config/statsdConfig.js";

// export const healthCheck = async (req, res) => {
//     // Log the incoming request
//     logger.info(`Health check requested from ${req.ip}`);

//     // Check for invalid requests
//     if (req.headers['content-length']) {
//         logger.warn('Health check received with content-length header');
//         res.status(400).end();
//         return;
//     }
//     if (Object.keys(req.body).length > 0) {
//         logger.warn('Health check received with body content');
//         res.status(400).end();
//         return;
//     }
//     if (Object.keys(req.query).length > 0) {
//         logger.warn('Health check received with query parameters');
//         res.status(400).end();
//         return;
//     }

//     // Check database connection
//     const dbConnected = await checkDatabaseConnection();

//     if (dbConnected) {
//         logger.info('Database connection is healthy');
//         res.status(200).end();
//     } else {
//         logger.error('Database connection is unhealthy');
//         res.status(503).end();
//     }
// };

// export const nonGetHealthCheck = async (req, res) => {
//     logger.warn(`Non-GET request made to health check endpoint from ${req.ip}`);
//     res.status(405).end();
// };