import AWS from "aws-sdk";
import logger from "../config/logger.js";
import statsd from "../config/statsdConfig.js"; // Import your StatsD client

const s3 = new AWS.S3();

export const uploadImageToS3 = async (
  user_id,
  file_name,
  buffer,
  contentType
) => {
  const startTime = Date.now();
  const s3Params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${user_id}/${file_name}`,
    Body: buffer,
    ContentType: contentType,
  };

  logger.info(`Uploading image to S3: ${file_name}`);
  try {
    const s3Response = await s3.upload(s3Params).promise();
    const duration = Date.now() - startTime;

    statsd.timing("S3UploadTime", duration); 

    logger.info(`Image uploaded successfully to S3: ${s3Response.Location}`);
    return s3Response;
  } catch (error) {
    logger.error(`Error uploading image to S3: ${error.message}`);
    throw error;
  }
};

export const deleteImageFromS3 = async (user_id, file_name) => {
  const startTime = Date.now();
  const s3Params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${user_id}/${file_name}`,
  };

  logger.info(`Deleting image from S3: ${file_name}`);
  try {
    await s3.deleteObject(s3Params).promise();
    const duration = Date.now() - startTime;
    statsd.timing("S3DeleteTime", duration); 

    logger.info(`Image deleted successfully from S3: ${file_name}`);
  } catch (error) {
    logger.error(`Error deleting image from S3: ${error.message}`);
    throw error;
  }
};

// import AWS from 'aws-sdk';
// import logger from '../config/logger.js';
// import { logMetric } from '../utils/metricsLogger.js';
// // import { s3 } from "../config/s3Config.js";

// const s3 = new AWS.S3();

// export const uploadImageToS3 = async (user_id, file_name, buffer, contentType) => {
//     const startTime = Date.now();
//     const s3Params = {
//         Bucket: process.env.AWS_BUCKET_NAME,
//         Key: `${user_id}/${file_name}`,
//         Body: buffer,
//         ContentType: contentType,
//     };

//     logger.info(`Uploading image to S3: ${file_name}`);
//     try {
//         const s3Response = await s3.upload(s3Params).promise();
//         const duration = Date.now() - startTime;
//         await logMetric('S3UploadTime', duration, 'Milliseconds');
//         logger.info(`Image uploaded successfully to S3: ${s3Response.Location}`);
//         return s3Response;
//     } catch (error) {
//         logger.error(`Error uploading image to S3: ${error.message}`);
//         throw error;
//     }
// };

// export const deleteImageFromS3 = async (user_id, file_name) => {
//     const startTime = Date.now();
//     const s3Params = {
//         Bucket: process.env.AWS_BUCKET_NAME,
//         Key: `${user_id}/${file_name}`,
//     };

//     logger.info(`Deleting image from S3: ${file_name}`);
//     try {
//         await s3.deleteObject(s3Params).promise();
//         const duration = Date.now() - startTime;
//         await logMetric('S3DeleteTime', duration, 'Milliseconds');
//         logger.info(`Image deleted successfully from S3: ${file_name}`);
//     } catch (error) {
//         logger.error(`Error deleting image from S3: ${error.message}`);
//         throw error;
//     }
// }
