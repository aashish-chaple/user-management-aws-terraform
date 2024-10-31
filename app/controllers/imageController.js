import { UniqueConstraintError } from "sequelize";
import * as imageService from "../services/imageService.js";
import logger from "../config/logger.js";
import * as s3Service from "../services/s3Service.js";
import statsd from "../config/statsdConfig.js";

export const createImage = async (req, res) => {
  const startTime = Date.now();

  try {
    const user = req.user;
    logger.info(
      `Received request to create image for user: ${user ? user.id : "unknown"}`
    );

    if (!user) {
      logger.warn("User not found during image creation attempt");
      statsd.increment(`api.${req.path}.calls.invalid`); // Increment for invalid call
      return res.status(404).json({ error: "User not found." });
    }

    const user_id = user.id;
    const existingImage = await imageService.findImageByUserId(user_id);

    if (existingImage) {
      logger.warn(`Profile picture already present for user: ${user_id}`);
      statsd.increment(`api.${req.path}.calls.duplicate`); // Increment for duplicate call
      return res
        .status(400)
        .json({ error: "Profile picture already present." });
    }

    let chunks = [];
    req.on("data", (chunk) => {
      chunks.push(chunk);
    });

    req.on("end", async () => {
      const buffer = Buffer.concat(chunks);
      const contentType = req.headers["content-type"];
      let fileExtension;

      if (contentType === "image/jpeg") {
        fileExtension = "jpg";
      } else if (contentType === "image/png") {
        fileExtension = "png";
      } else if (contentType === "image/jpg") {
        fileExtension = "jpg";
      } else {
        logger.warn(`Unsupported image format: ${contentType}`);
        statsd.increment(`api.${req.path}.calls.invalid_format`); // Increment for unsupported format
        return res.status(400).json({
          error: "Unsupported image format. Please upload a PNG or JPG image.",
        });
      }

      const file_name = `${user_id}-${Date.now()}.${fileExtension}`;
      const s3Response = await s3Service.uploadImageToS3(
        user_id,
        file_name,
        buffer,
        contentType
      );

      const newImage = await imageService.createImage({
        file_name,
        url: s3Response.Location,
        user_id,
      });

      logger.info(`Image created successfully: ${newImage.id}`);

      const duration = Date.now() - startTime;
      statsd.increment(`api.${req.path}.calls.success`); // Increment successful call count
      statsd.timing(`api.${req.path}.duration`, duration); // Log the duration

      return res.status(201).json({
        id: newImage.id,
        file_name: newImage.file_name,
        url: newImage.url,
        upload_date: newImage.upload_date,
        user_id: newImage.user_id,
      });
    });
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      logger.error("Error: Image already exists");
      statsd.increment(`api.${req.path}.calls.duplicate_error`); // Increment for existing image error
      return res.status(400).json({ error: "Image already exists" });
    }
    logger.error(`Error creating image: ${error.message}`);
    statsd.increment(`api.${req.path}.calls.error`); // Increment for general error
    return res
      .status(500)
      .json({ error: "Error creating image", details: error.message });
  }
};

export const getImage = async (req, res) => {
  const startTime = Date.now();

  try {
    const user = req.user;
    logger.info(
      `Received request to get image for user: ${user ? user.id : "unknown"}`
    );

    if (!user) {
      logger.warn("User not found during image retrieval attempt");
      statsd.increment(`api.${req.path}.calls.invalid`); // Increment for invalid call
      return res.status(404).json({ error: "User not found." });
    }

    const user_id = user.id;
    const existingImage = await imageService.findImageByUserId(user_id);

    if (!existingImage) {
      logger.warn(`Profile picture not found for user: ${user_id}`);
      statsd.increment(`api.${req.path}.calls.not_found`); // Increment for not found
      return res.status(404).json({ error: "Profile picture Not Found" });
    }

    logger.info(`Profile picture retrieved successfully for user: ${user_id}`);

    const duration = Date.now() - startTime;
    statsd.increment(`api.${req.path}.calls.success`); // Increment successful call count
    statsd.timing(`api.${req.path}.duration`, duration); // Log the duration

    return res.status(200).json(existingImage);
  } catch (error) {
    logger.error(`Error retrieving image: ${error.message}`);
    statsd.increment(`api.${req.path}.calls.error`); // Increment for general error
    return res.status(400).json({ error: "Error retrieving images" });
  }
};

export const deleteImage = async (req, res) => {
  const startTime = Date.now();

  const user = req.user;
  logger.info(
    `Received request to delete image for user: ${user ? user.id : "unknown"}`
  );

  if (!user) {
    logger.warn("User not found during image deletion attempt");
    statsd.increment(`api.${req.path}.calls.invalid`); // Increment for invalid call
    return res.status(404).json({ error: "User not found." });
  }

  const user_id = user.id;
  const existingImage = await imageService.findImageByUserId(user_id);

  try {
    if (!existingImage) {
      logger.warn(`Image not found for user: ${user_id}`);
      statsd.increment(`api.${req.path}.calls.not_found`); // Increment for not found
      return res.status(404).json({ error: "Image not found" });
    }

    await s3Service.deleteImageFromS3(user_id, existingImage.file_name);

    await existingImage.destroy();

    logger.info(`Image deleted successfully for user: ${user_id}`);

    const duration = Date.now() - startTime;
    statsd.increment(`api.${req.path}.calls.success`); // Increment successful call count
    statsd.timing(`api.${req.path}.duration`, duration); // Log the duration

    return res.status(204).send();
  } catch (error) {
    logger.error(`Error deleting image: ${error.message}`);
    statsd.increment(`api.${req.path}.calls.error`); // Increment for general error
    return res
      .status(400)
      .json({ error: "Error deleting image", details: error.message });
  }
};

export const unsupportedCall = async (req, res) => {
  logger.warn(`Unsupported request method: ${req.method} for URL: ${req.url}`);
  statsd.increment(`api.${req.path}.calls.unknown`); // Increment for unsupported calls
  return res.status(405).end();
};

// import { UniqueConstraintError} from "sequelize";
// import * as imageService from "../services/imageService.js"; // Ensure you create this service
// import AWS from "aws-sdk";
// // import {s3} from "../config/s3Config.js";
// const s3 = new AWS.S3();

// export const createImage = async (req, res) => {
//   try {
//     const user = req.user;
//     console.log("user : " + user);
//     if (!user) {
//       return res.status(404).json({ error: "User not found." });
//     }

//     const user_id = user.id;

//     const existingImage = await imageService.findImageByUserId(user_id);
//     if (existingImage) {
//       return res
//         .status(400)
//         .json({ error: "Profile picture already present." }); // Error if image already exists
//     }

//     let chunks = [];
//     req.on("data", (chunk) => {
//       chunks.push(chunk);
//     });

//     req.on("end", async () => {
//       const buffer = Buffer.concat(chunks);

//       const contentType = req.headers["content-type"];

//       let fileExtension;
//       if (contentType === "image/jpeg") {
//         fileExtension = "jpg";
//       } else if (contentType === "image/png") {
//         fileExtension = "png";
//       } else if (contentType === "image/jpg") {
//         fileExtension = "jpg";
//       } else {
//         return res
//           .status(400)
//           .json({
//             error:
//               "Unsupported image format. Please upload a PNG or JPG image.",
//           });
//       }

//       const file_name = `${user_id}-${Date.now()}.${fileExtension}`;

//       const s3Params = {
//         Bucket: process.env.AWS_BUCKET_NAME,
//         Key: `${user_id}/${file_name}`,
//         Body: buffer,
//         ContentType: contentType,
//       };

//       const s3Response = await s3.upload(s3Params).promise();

//       const newImage = await imageService.createImage({
//         file_name,
//         url: s3Response.Location,
//         user_id,
//       });

//       return res.status(201).json({
//         id: newImage.id,
//         file_name: newImage.file_name,
//         url: newImage.url,
//         upload_date: newImage.upload_date,
//         user_id: newImage.user_id,
//       });
//     });
//   } catch (error) {
//     if (error instanceof UniqueConstraintError) {
//       return res.status(400).json({ error: "Image already exists" });
//     }
//     return res
//       .status(500)
//       .json({ error: "Error creating image", details: error.message });
//   }
// };

// export const getImage = async (req, res) => {
//   try {
//     const user = req.user;
//     if (!user) {
//       return res.status(404).json({ error: "User not found." });
//     }

//     const user_id = user.id;

//     const existingImage = await imageService.findImageByUserId(user_id);
//     if (!existingImage) {
//       return res.status(404).json({ error: "Profile picture Not Found" });
//     }
//     return res.status(200).json(existingImage);
//   } catch (error) {
//     return res.status(400).json({ error: "Error retrieving images" });
//   }
// };

// export const deleteImage = async (req, res) => {
//   const user = req.user;
//   if (!user) {
//     return res.status(404).json({ error: "User not found." });
//   }

//   const user_id = user.id;

//   const existingImage = await imageService.findImageByUserId(user_id);

//   try {
//     if (!existingImage) {
//       return res.status(404).json({ error: "Image not found" });
//     }

//     const s3Params = {
//       Bucket: process.env.AWS_BUCKET_NAME,
//       Key: existingImage.file_name,
//     };

//     await s3.deleteObject(s3Params).promise();

//     await existingImage.destroy();

//     return res.status(204).send();
//   } catch (error) {
//     return res
//       .status(400)
//       .json({ error: "Error deleting image", details: error.message });
//   }
// };

// export const unsupportedCall = async (req, res) => {
//   return res.status(405).end();
// };
