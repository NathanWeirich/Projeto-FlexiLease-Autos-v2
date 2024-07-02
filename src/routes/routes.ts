import express from "express";
import carRoutes from "./car.routes";

const router = express.Router();

router.use("/api/v1/", carRoutes);

export default router;
