// loggingMiddleware.js
import logger from '../config/logger.js'; // Import the logger

const loggingMiddleware = (req, res, next) => {
    logger.info(`Received ${req.method} request for '${req.url}'`);
    next();
};

export default loggingMiddleware;