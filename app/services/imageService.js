import { Image } from '../models/imageModel.js'; // Adjust the path as needed
import statsd from '../config/statsdConfig.js'; // Import your StatsD client

export const createImage = async (data) => {
    const startTime = Date.now(); // Start timing
    try {
        const newImage = await Image.create(data);
        const duration = Date.now() - startTime; // Calculate duration
        statsd.timing('CreateImageExecutionTime', duration); // Log the duration
        return newImage;
    } catch (error) {
        throw new Error('Error creating image: ' + error.message);
    }
};

export const getAllImages = async () => {
    const startTime = Date.now(); // Start timing
    try {
        const images = await Image.findAll();
        const duration = Date.now() - startTime; // Calculate duration
        statsd.timing('GetAllImagesExecutionTime', duration); // Log the duration
        return images;
    } catch (error) {
        throw new Error('Error fetching images: ' + error.message);
    }
};

export const findImageById = async (id) => {
    const startTime = Date.now(); // Start timing
    try {
        const image = await Image.findByPk(id);
        if (!image) {
            throw new Error('Image not found');
        }
        const duration = Date.now() - startTime; // Calculate duration
        statsd.timing('FindImageByIdExecutionTime', duration); // Log the duration
        return image;
    } catch (error) {
        throw new Error('Error fetching image: ' + error.message);
    }
};

export const findImageByUserId = async (user_id) => {
    const startTime = Date.now(); // Start timing
    try {
        const image = await Image.findOne({ where: { user_id } });
        const duration = Date.now() - startTime; // Calculate duration
        statsd.timing('FindImageByUserIdExecutionTime', duration); // Log the duration
        return image;
    } catch (error) {
        throw new Error('Error finding image by user ID: ' + error.message);
    }
};

export const deleteImageByUserId = async (user_id) => {
    const startTime = Date.now(); // Start timing
    try {
        const image = await findImageByUserId(user_id); 
        if (!image) {
            throw new Error('No image found for this user ID');
        }
        await image.destroy();
        const duration = Date.now() - startTime; // Calculate duration
        statsd.timing('DeleteImageByUserIdExecutionTime', duration); // Log the duration
        return { message: 'Image deleted successfully' };
    } catch (error) {
        throw new Error('Error deleting image: ' + error.message);
    }
};


// import { Image } from '../models/imageModel.js'; // Adjust the path as needed

// export const createImage = async (data) => {
//     try {
//         // const newImage = await Image.create(data);
//         // return newImage;
//         return await executeQueryWithTiming(async () => {
//             const newImage = await Image.create(data);
//             return newImage;
//         }, 'CreateImageExecutionTime');
//     } catch (error) {
//         throw new Error('Error creating image: ' + error.message);
//     }
// };

// export const getAllImages = async () => {
//     try {
//         // const images = await Image.findAll();
//         // return images;
//         return await executeQueryWithTiming(async () => {
//             const images = await Image.findAll();
//             return images;
//         }, 'GetAllImagesExecutionTime');
//     } catch (error) {
//         throw new Error('Error fetching images: ' + error.message);
//     }
// };

// export const findImageById = async (id) => {
//     try {
//         // const image = await Image.findByPk(id);
//         // if (!image) {
//         //     throw new Error('Image not found');
//         // }
//         // return image;
//         return await executeQueryWithTiming(async () => {
//             const image = await Image.findByPk(id);
//             if (!image) {
//                 throw new Error('Image not found');
//             }
//             return image;
//         }, 'FindImageByIdExecutionTime');
//     } catch (error) {
//         throw new Error('Error fetching image: ' + error.message);
//     }
// };

// export const findImageByUserId = async (user_id) => {
//     try {
//         // const image = await Image.findOne({ where: { user_id } });
//         // return image;
//         return await executeQueryWithTiming(async () => {
//             const image = await Image.findOne({ where: { user_id } });
//             return image;
//         }, 'FindImageByUserIdExecutionTime');    
//     } catch (error) {
//         throw new Error('Error finding image by user ID: ' + error.message);
//     }
// };

// export const deleteImageByUserId = async (user_id) => {
//     try {
//         // const image = await findImageByUserId(user_id); 
//         // if (!image) {
//         //     throw new Error('No image found for this user ID');
//         // }
//         // await image.destroy();
//         // return { message: 'Image deleted successfully' };
//         return await executeQueryWithTiming(async () => {
//             const image = await findImageByUserId(user_id); 
//             if (!image) {
//                 throw new Error('No image found for this user ID');
//             }
//             await image.destroy();
//             return { message: 'Image deleted successfully' };
//         }, 'DeleteImageByUserIdExecutionTime');
//     } catch (error) {
//         throw new Error('Error deleting image: ' + error.message);
//     }
// };