import { User } from '../models/userModel.js'; // Import your Sequelize User model

export const findUserByEmail = async (email) => {
    return await User.findOne({ where: { email } });
};

export const createUser = async ({ email, password, first_name, last_name }) => {
    return await User.create({ email, password, first_name, last_name });
};

;export const findUserById = async (id) => {
    return await User.findByPk(id, {
        attributes: { exclude: ['password'] }, // Exclude password from result
    });
}

export const updateUser = async (id, updateData) => {
    const user = await User.findByPk(id);
    if (!user) return null;

    Object.assign(user, updateData); // Merge updateData with user
    return await user.save();  // Save updated user
};