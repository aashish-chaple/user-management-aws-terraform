import { User } from "../models/userModel.js"; // Import your Sequelize User model
import statsd from '../config/statsdConfig.js'; // Import your StatsD client

export const findUserByEmail = async (email) => {
  const startTime = Date.now();
  try {
    const user = await User.findOne({ where: { email } });
    const duration = Date.now() - startTime; // Calculate duration
    statsd.timing('FindUserByEmailExecutionTime', duration); // Log the duration
    return user;
  } catch (error) {
    // Log error if needed, but not counting it
    throw error;
  }
};

export const createUser = async ({ email, password, first_name, last_name }) => {
  const startTime = Date.now();
  try {
    const user = await User.create({ email, password, first_name, last_name });
    const duration = Date.now() - startTime; // Calculate duration
    statsd.timing('CreateUserExecutionTime', duration); // Log the duration
    return user;
  } catch (error) {
    // Log error if needed, but not counting it
    throw error;
  }
};

export const findUserById = async (id) => {
  const startTime = Date.now();
  try {
    const user = await User.findByPk(id, {
      attributes: { exclude: ["password"] },
    });
    const duration = Date.now() - startTime; // Calculate duration
    statsd.timing('FindUserByIdExecutionTime', duration); // Log the duration
    return user;
  } catch (error) {
    // Log error if needed, but not counting it
    throw error;
  }
};

export const updateUser = async (userId, updates) => {
  const startTime = Date.now();
  try {
    await User.update(updates, { where: { id: userId } });
    const updatedUser = await User.findByPk(userId);
    const duration = Date.now() - startTime; // Calculate duration
    statsd.timing('UpdateUserExecutionTime', duration); // Log the duration
    return updatedUser || null; // Return null if user not found
  } catch (error) {
    // Log error if needed, but not counting it
    throw error;
  }
};


// import { User } from "../models/userModel.js"; // Import your Sequelize User model
// import { executeQueryWithTiming } from "../config/db.js";

// export const findUserByEmail = async (email) => {
//   return await executeQueryWithTiming(
//     () => User.findOne({ where: { email } }),
//     "FindUserByEmailExecutionTime"
//   );
//   // return await User.findOne({ where: { email } });
// };

// export const createUser = async ({
//   email,
//   password,
//   first_name,
//   last_name,
// }) => {
//   return await executeQueryWithTiming(
//     () => User.create({ email, password, first_name, last_name }),
//     "CreateUserExecutionTime"
//   );
//   // return await User.create({ email, password, first_name, last_name });
// };

// export const findUserById = async (id) => {
//   return await executeQueryWithTiming(
//     () =>
//       User.findByPk(id, {
//         attributes: { exclude: ["password"] },
//       }),
//     "FindUserByIdExecutionTime"
//   );
//   // return await User.findByPk(id, {
//   //     attributes: { exclude: ['password'] },
//   // });
// };

// export const updateUser = async (userId, updates) => {
//   try {
//     return await executeQueryWithTiming(async () => {
//       await User.update(updates, { where: { id: userId } });
//       const updatedUser = await User.findByPk(userId);
//       return updatedUser || null; // Return null if user not found
//     }, "UpdateUserExecutionTime");

//     // await User.update(updates, { where: { id: userId } });
//     // const updatedUser = await User.findByPk(userId);
//     // if (!updatedUser) {
//     //   return null;
//     // }
//     // return updatedUser;
//   } catch (error) {
//     if (
//       error instanceof ValidationError ||
//       error instanceof UniqueConstraintError
//     ) {
//       throw error;
//     }
//     throw new DatabaseError("Failed to update user");
//   }
// };
