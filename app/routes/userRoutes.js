import express from "express";
import {authenticateUser} from "../middleware/authMiddleware.js";
import {validateJsonContentType} from "../middleware/validateJsonRoute.js";
import * as userController from "../controllers/userController.js";

const router = express.Router();

// Public route for user creation
router.post("/", validateJsonContentType, userController.createUser);

router.head("/self", userController.unsupportedCall);

// Protected routes (require authentication)
router.get("/self", authenticateUser, userController.getUser);
router.put("/self", authenticateUser, userController.updateUser);

router.all('/self', userController.unsupportedCall);

export default router;