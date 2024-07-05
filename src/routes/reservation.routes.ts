import { Router } from "express";
import ReservationController from "../controllers/ReservationController";
import { ReservationService } from "../services/ReservationService";
import { reserveValidation } from "../validation/reserveValidation";
import { authenticateJWT } from "../middlewares/authenticate";

const router = Router();
const reservationService = new ReservationService();
const reservationController = new ReservationController(reservationService);

router.post(
  "/reserve",
  authenticateJWT,
  reserveValidation,
  reservationController.createReservation.bind(reservationController),
);
router.get(
  "/reserve",
  authenticateJWT,
  reservationController.getReservations.bind(reservationController),
);
router.get(
  "/reserve/:id",
  authenticateJWT,
  reservationController.getReservationById.bind(reservationController),
);
router.put(
  "/reserve/:id",
  reserveValidation,
  authenticateJWT,
  reservationController.updateReservation.bind(reservationController),
);
router.delete(
  "/reserve/:id",
  authenticateJWT,
  reservationController.deleteReservation.bind(reservationController),
);
export default router;
