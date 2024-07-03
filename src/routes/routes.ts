import express from "express";
import carRoutes from "./car.routes";
import userRoutes from "./user.routes";

const router = express.Router();

router.use("/api/v1/", carRoutes);
router.use("/api/v1/", userRoutes);

export default router;
