import { Image } from '../models/imageModel.js'; // Adjust the path as needed

export const createImage = async (data) => {
    try {
        const newImage = await Image.create(data);
        return newImage;
    } catch (error) {
        throw new Error('Error creating image: ' + error.message);
    }
};

export const getAllImages = async () => {
    try {
        const images = await Image.findAll();
        return images;
    } catch (error) {
        throw new Error('Error fetching images: ' + error.message);
    }
};

export const findImageById = async (id) => {
    try {
        const image = await Image.findByPk(id);
        if (!image) {
            throw new Error('Image not found');
        }
        return image;
    } catch (error) {
        throw new Error('Error fetching image: ' + error.message);
    }
};

export const findImageByUserId = async (user_id) => {
    try {
        const image = await Image.findOne({ where: { user_id } });
        return image;
    } catch (error) {
        throw new Error('Error finding image by user ID: ' + error.message);
    }
};

export const deleteImageByUserId = async (user_id) => {
    try {
        const image = await findImageByUserId(user_id); 
        if (!image) {
            throw new Error('No image found for this user ID');
        }
        await image.destroy();
        return { message: 'Image deleted successfully' };
    } catch (error) {
        throw new Error('Error deleting image: ' + error.message);
    }
};