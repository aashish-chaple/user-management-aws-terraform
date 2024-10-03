import { User } from '../models/userModel.js'; // Import your Sequelize User model

export const findUserByEmail = async (email) => {
    return await User.findOne({ where: { email } });
};

export const createUser = async ({ email, password, first_name, last_name }) => {
    return await User.create({ email, password, first_name, last_name });
};

;export const findUserById = async (id) => {
    return await User.findByPk(id, {
        attributes: { exclude: ['password'] }, 
    });
}

export const updateUser = async (userId, updates) => {
    try {
      await User.update(updates, { where: { id: userId } });
      const updatedUser = await User.findByPk(userId);
      if (!updatedUser) {
        return null;
      }
      return updatedUser;
    } catch (error) {
      if (
        error instanceof ValidationError ||
        error instanceof UniqueConstraintError
      ) {
        throw error;
      }
      throw new DatabaseError("Failed to update user");
    }
};