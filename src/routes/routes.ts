import express from "express";
import carRoutes from "./car.routes";
import userRoutes from "./user.routes";
import reservationRoutes from "./reservation.routes";

const router = express.Router();

router.use("/api/v1/", carRoutes);
router.use("/api/v1/", userRoutes);
router.use("/api/v1", reservationRoutes);

export default router;
