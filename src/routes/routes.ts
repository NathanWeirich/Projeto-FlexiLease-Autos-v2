import express from "express";
import carRoutes from "./car.routes";
import userRoutes from "./user.routes";
import reservationRoutes from "./reservation.routes";
import { authenticateJWT } from "../middlewares/authenticate";

const router = express.Router();

router.use("/api/v1/", authenticateJWT, carRoutes);
router.use("/api/v1", authenticateJWT, reservationRoutes);
router.use("/api/v1/", userRoutes);

export default router;
