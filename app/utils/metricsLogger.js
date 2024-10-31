import cloudwatch from '../config/cloudWatchConfig.js';
import logger from '../config/logger.js';

export const logMetric = async (metricName, value, unit = 'Count') => {
    const params = {
        MetricData: [
            {
                MetricName: metricName,
                Value: value,
                Unit: unit,
            },
        ],
        Namespace: 'CWAgent', // Replace with your application namespace
    };

    try {
        await cloudwatch.putMetricData(params).promise();
    } catch (error) {
        logger.error(`Error logging metric to CloudWatch: ${error.message}`);
        console.error('Error logging metric to CloudWatch:', error);
    }
};