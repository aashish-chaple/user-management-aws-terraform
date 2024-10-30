import express from "express";
import {authenticateUser} from "../middleware/authMiddleware.js";
import * as imageController from "../controllers/imageController.js";

const router = express.Router();

router.head("/", imageController.unsupportedCall);

// Protected routes (require authentication)
router.get("/", authenticateUser, imageController.getImage);
router.post("/", authenticateUser, imageController.createImage);
router.delete("/", authenticateUser, imageController.deleteImage);

router.all('/', imageController.unsupportedCall);

export default router;