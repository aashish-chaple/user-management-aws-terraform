import { UniqueConstraintError, ValidationError } from 'sequelize';
import * as userService from '../services/userService.js';
import logger from '../config/logger.js'; // Import the logger
import statsd from '../config/statsdConfig.js'; // Import your StatsD client

export const createUser = async (req, res) => {
  const startTime = Date.now(); // Start the timer

  try {
    const { email, first_name, last_name, password, account_created, account_updated } = req.body;

    if (account_created || account_updated) {
      logger.warn("Attempt to set account_created or account_updated");
      statsd.increment(`api.${req.path}.calls.invalid`); // Increment for invalid call
      return res.status(400).json({ error: "Can't set account_created or account_updated" });
    }
    
    logger.info(`Creating user with email: ${email}`);
    const user = await userService.createUser({ email, password, first_name, last_name });
    
    logger.info(`User created successfully: ${user.id}`);
    
    const duration = Date.now() - startTime; // Calculate duration
    statsd.increment(`api.${req.path}.calls.success`); // Increment successful call count
    statsd.timing(`api.${req.path}.duration`, duration); // Log the duration

    return res.status(201).json({
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      account_created: user.account_created,
      account_updated: user.account_updated,
    });
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      logger.error("User already exists: " + error.message);
      statsd.increment(`api.${req.path}.calls.duplicate_error`); // Increment for existing user error
      return res.status(400).json({ error: "User already exists" });
    }
    logger.error("Error creating user: " + error.message);
    statsd.increment(`api.${req.path}.calls.error`); // Increment for general error
    return res.status(400).json({ error: "Error creating user" });
  }
};

export const updateUser = async (req, res) => {
  const startTime = Date.now(); // Start the timer

  try {
    const { email, first_name, last_name, password, account_created, account_updated } = req.body;

    if (account_created || account_updated) {
      logger.warn("Attempt to set account_created or account_updated during update");
      statsd.increment(`api.${req.path}.calls.invalid`); // Increment for invalid call
      return res.status(400).end();
    }
    
    if (email) {
      logger.warn("Attempt to update the email, which is not allowed");
      statsd.increment(`api.${req.path}.calls.invalid_email_update`); // Increment for invalid email update
      return res.status(400).json({ error: "Can't update the email" });
    }
    
    logger.info(`Updating user with ID: ${req.user.id}`);
    const updateData = { email, first_name, last_name, password };
    const user = await userService.updateUser(req.user.id, updateData);

    if (!user) {
      logger.warn(`User not found during update: ${req.user.id}`);
      statsd.increment(`api.${req.path}.calls.user_not_found`); // Increment for user not found
      return res.status(400).json({ error: "User not found" });
    }

    logger.info(`User updated successfully: ${user.id}`);
    const duration = Date.now() - startTime; // Calculate duration
    statsd.increment(`api.${req.path}.calls.success`); // Increment successful call count
    statsd.timing(`api.${req.path}.duration`, duration); // Log the duration

    return res.status(204).json({
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      account_created: user.account_created,
      account_updated: user.account_updated,
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      logger.error("Validation failed during user update: " + error.message);
      statsd.increment(`api.${req.path}.calls.validation_error`); // Increment for validation error
      return res.status(400).json({ error: "Validation failed" });
    }
    logger.error("Error updating user: " + error.message);
    statsd.increment(`api.${req.path}.calls.error`); // Increment for general error
    return res.status(400).json({ error: "Error updating user" });
  }
};

export const getUser = async (req, res) => {
  const startTime = Date.now(); // Start the timer

  if (req.headers['content-length']) {
    logger.warn("Health check received with content-length header");
    statsd.increment(`api.${req.path}.calls.invalid`); // Increment for invalid call
    res.status(400).end();
    return;
  }
  if (Object.keys(req.body).length > 0) {
    logger.warn("Health check received with body content");
    statsd.increment(`api.${req.path}.calls.invalid`); // Increment for invalid call
    res.status(400).end();
    return;
  }
  if (Object.keys(req.query).length > 0) {
    logger.warn("Health check received with query parameters");
    statsd.increment(`api.${req.path}.calls.invalid`); // Increment for invalid call
    res.status(400).end();
    return;
  }
  
  try {
    logger.info(`Fetching user with ID: ${req.user.id}`);
    const user = await userService.findUserById(req.user.id);

    if (!user) {
      logger.warn(`User not found: ${req.user.id}`);
      statsd.increment(`api.${req.path}.calls.not_found`); // Increment for user not found
      return res.status(404).json({ error: "User not found" });
    }

    logger.info(`User retrieved successfully: ${user.id}`);
    const duration = Date.now() - startTime; // Calculate duration
    statsd.increment(`api.${req.path}.calls.success`); // Increment successful call count
    statsd.timing(`api.${req.path}.duration`, duration); // Log the duration

    return res.status(200).json(user);
  } catch (error) {
    logger.error("Error fetching user: " + error.message);
    statsd.increment(`api.${req.path}.calls.error`); // Increment for general error
    return res.status(400).json({ error: "Error fetching user" });
  }
};

export const unsupportedCall = async (req, res) => {
  logger.warn(`Unsupported request method: ${req.method} for URL: ${req.url}`);
  statsd.increment(`api.${req.path}.calls.unknown`); // Increment for unsupported calls
  return res.status(405).end();
};

// import { UniqueConstraintError, ValidationError } from 'sequelize';
// import * as userService from '../services/userService.js';

// export const createUser = async (req, res) => {
//   try {
//     const { email, first_name, last_name, password, account_created, account_updated } = req.body;
//     if (account_created || account_updated){
//       return res.status(400).json({ error: "Can't set account_created or account_updated" });
//     }
    
//     const user = await userService.createUser({ email, password, first_name, last_name });
    
//     return res.status(201).json({
//       id: user.id,
//       email: user.email,
//       first_name: user.first_name,
//       last_name: user.last_name,
//       account_created: user.account_created,
//       account_updated: user.account_updated,
//     });
//   } catch (error) {
//     if (error instanceof UniqueConstraintError){
//       return res.status(400).json({ error: "User already exists" });
//     }
//     return res.status(400).json({ error: "Error creating user" });
//   }
// };

// export const updateUser = async (req, res) => {
//   try {
//     const { email, first_name, last_name, password, account_created, account_updated } = req.body;
//     if (account_created || account_updated){
//       return res.status(400).end();
//     }
//     console.log("email : " + email);
//     if (email){
//       return res.status(400).json({ error: "Can't update the email" });
//     }
//     const updateData = { email, first_name, last_name, password };

//     const user = await userService.updateUser(req.user.id, updateData);

//     if (!user) {
//       return res.status(400).json({ error: "User not found" });
//     }

//     return res.status(204).json({
//       id: user.id,
//       email: user.email,
//       first_name: user.first_name,
//       last_name: user.last_name,
//       account_created: user.account_created,
//       account_updated: user.account_updated,
//     });
//   } catch (error) {
//     // console.log(error);
//     if (error instanceof ValidationError){
//       return res.status(400).json({ error: "Validation failed" });
//     }
//     return res.status(400).json({ error: "Error updating user" });
//   }
// };

// export const getUser = async (req, res) => {
//       if (req.headers['content-length']){
//         res.status(400).end();
//         return;
//     }
//     if (Object.keys(req.body).length > 0) {
//         res.status(400).end();
//         return;
//     }

//     if (Object.keys(req.query).length > 0) {
//         res.status(400).end();
//         return;
//     }
//   try {
//     const user = await userService.findUserById(req.user.id);

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     return res.status(200).json(user);
//   } catch (error) {
//     // console.log(error);
//     return res.status(400).json({ error: "Error fetching user" });
//   }
// };

// export const unsupportedCall = async (req, res) => {
//   return res.status(405).end();
// };