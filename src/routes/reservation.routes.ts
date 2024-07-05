import { Router } from "express";
import { container } from "tsyringe";
import { reserveValidation } from "../validation/reserveValidation";
import { authenticateJWT } from "../middlewares/authenticate";
import ReservationController from "../controllers/ReservationController";

const router = Router();
const reservationController = container.resolve(ReservationController);

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
