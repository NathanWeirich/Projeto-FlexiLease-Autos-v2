import { Request, Response } from "express";
import { ReservationService } from "../services/ReservationService";

class ReservationController {
  constructor(private reservationService: ReservationService) {}

  async createReservation(req: Request, res: Response) {
    try {
      const reservation = await this.reservationService.createReservation(
        req.body,
      );
      res.status(201).send({ reservationId: reservation._id });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).send({ error: error.message });
      } else {
        res.status(400).send({ error: "An unknown error occurred" });
      }
    }
  }
}

export default ReservationController;
