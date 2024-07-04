import { Router } from "express";
import ReservationController from "../controllers/ReservationController";
import { ReservationService } from "../services/ReservationService";
import { reserveValidation } from "../validation/reserveValidation";

const router = Router();
const reservationService = new ReservationService();
const reservationController = new ReservationController(reservationService);

router.post(
  "/reserve",
  reserveValidation,
  reservationController.createReservation.bind(reservationController),
);
router.get(
  "/reserve",
  reservationController.getReservations.bind(reservationController),
);
router.get(
  "/reserve/:id",
  reservationController.getReservationById.bind(reservationController),
);
router.put(
  "/reserve/:id",
  reserveValidation,
  reservationController.updateReservation.bind(reservationController),
);
router.delete(
  "/reserve/:id",
  reservationController.deleteReservation.bind(reservationController),
);
export default router;
