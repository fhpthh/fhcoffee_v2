import express from 'express';
import { loginAdmin, verifyAdmin, registerAdmin } from '../controllers/adminController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { getStatistics } from '../controllers/statisticsController.js';

const adminRouter = express.Router();

adminRouter.post("/register", registerAdmin);
adminRouter.post("/login", loginAdmin);
adminRouter.get("/verify", verifyToken, verifyAdmin);
adminRouter.get("/statistics", verifyToken, getStatistics);

export default adminRouter;