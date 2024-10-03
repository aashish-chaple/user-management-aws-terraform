import { checkDatabaseConnection } from "../../db.js";

export const healthCheck = async (req, res) => {

    if (req.headers['content-length']){
        res.status(400).end();
        return;
    }
    if (Object.keys(req.body).length > 0) {
        res.status(400).end();
        return;
    }

    if (Object.keys(req.query).length > 0) {
        res.status(400).end();
        return;
    }

    const dbConnected = await checkDatabaseConnection();
    
    if (dbConnected) {
        res.status(200).end();
    } else {
        res.status(503).end();
    }
};

export const nonGetHealthCheck = async (req, res) => {
    res.status(405).end();
};