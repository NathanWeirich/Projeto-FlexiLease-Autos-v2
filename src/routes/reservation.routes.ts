import { Router } from "express";
import { container } from "tsyringe";
import { reserveValidation } from "../api/validation/reserveValidation";
import ReservationController from "../api/controllers/ReservationController";

const router = Router();
const reservationController = container.resolve(ReservationController);

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
