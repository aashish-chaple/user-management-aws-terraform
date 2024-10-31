import { UniqueConstraintError, ValidationError } from 'sequelize';
import * as userService from '../services/userService.js';
import logger from '../config/logger.js'; // Import the logger

export const createUser = async (req, res) => {
  try {
    const { email, first_name, last_name, password, account_created, account_updated } = req.body;

    if (account_created || account_updated) {
      logger.warn("Attempt to set account_created or account_updated");
      return res.status(400).json({ error: "Can't set account_created or account_updated" });
    }
    
    logger.info(`Creating user with email: ${email}`);
    const user = await userService.createUser({ email, password, first_name, last_name });
    
    logger.info(`User created successfully: ${user.id}`);
    
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
      return res.status(400).json({ error: "User already exists" });
    }
    logger.error("Error creating user: " + error.message);
    return res.status(400).json({ error: "Error creating user" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { email, first_name, last_name, password, account_created, account_updated } = req.body;

    if (account_created || account_updated) {
      logger.warn("Attempt to set account_created or account_updated during update");
      return res.status(400).end();
    }
    
    if (email) {
      logger.warn("Attempt to update the email, which is not allowed");
      return res.status(400).json({ error: "Can't update the email" });
    }
    
    logger.info(`Updating user with ID: ${req.user.id}`);
    const updateData = { email, first_name, last_name, password };
    const user = await userService.updateUser(req.user.id, updateData);

    if (!user) {
      logger.warn(`User not found during update: ${req.user.id}`);
      return res.status(400).json({ error: "User not found" });
    }

    logger.info(`User updated successfully: ${user.id}`);
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
      return res.status(400).json({ error: "Validation failed" });
    }
    logger.error("Error updating user: " + error.message);
    return res.status(400).json({ error: "Error updating user" });
  }
};

export const getUser = async (req, res) => {
  if (req.headers['content-length']) {
    logger.warn("Health check received with content-length header");
    res.status(400).end();
    return;
  }
  if (Object.keys(req.body).length > 0) {
    logger.warn("Health check received with body content");
    res.status(400).end();
    return;
  }
  if (Object.keys(req.query).length > 0) {
    logger.warn("Health check received with query parameters");
    res.status(400).end();
    return;
  }
  
  try {
    logger.info(`Fetching user with ID: ${req.user.id}`);
    const user = await userService.findUserById(req.user.id);

    if (!user) {
      logger.warn(`User not found: ${req.user.id}`);
      return res.status(404).json({ error: "User not found" });
    }

    logger.info(`User retrieved successfully: ${user.id}`);
    return res.status(200).json(user);
  } catch (error) {
    logger.error("Error fetching user: " + error.message);
    return res.status(400).json({ error: "Error fetching user" });
  }
};

export const unsupportedCall = async (req, res) => {
  logger.warn(`Unsupported request method: ${req.method} for URL: ${req.url}`);
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