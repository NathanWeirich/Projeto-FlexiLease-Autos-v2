import express from "express";
import carRoutes from "./car.routes";
import userRoutes from "./user.routes";
import reservationRoutes from "./reservation.routes";
import { authenticateJWT } from "../api/middlewares/authenticate";

const router = express.Router();

router.use("/api/v1/", userRoutes);
router.use("/api/v1/", authenticateJWT, carRoutes);
router.use("/api/v1", authenticateJWT, reservationRoutes);

export default router;
