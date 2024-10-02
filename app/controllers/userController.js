import { UniqueConstraintError } from 'sequelize';
import * as userService from '../services/userService.js';

export const createUser = async (req, res) => {
  try {
    const { email, password, first_name, last_name } = req.body;
    
    const user = await userService.createUser({ email, password, first_name, last_name });
    
    return res.status(201).json({
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.first_name,
      account_created: user.account_created,
      account_updated: user.account_updated,
    });
  } catch (error) {
    if (error instanceof UniqueConstraintError){
      return res.status(400).json({ error: "User already exists" });
    }
    return res.status(500).json({ error: "Error creating user" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { first_name, last_name, password } = req.body;
    const updateData = { first_name, last_name, password };

    const user = await userService.updateUser(req.user.id, updateData);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      account_created: user.account_created,
      account_updated: user.account_updated,
    });
  } catch (error) {
    return res.status(500).json({ error: "Error updating user" });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await userService.findUserById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error fetching user" });
  }
};

export const unsupportedCall = async (req, res) => {
  return res.status(405).end();
};