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

  async getReservations(req: Request, res: Response) {
    const { page = 1, limit = 10, ...filters } = req.query;
    try {
      const paginatedResult = await this.reservationService.getReservations(
        filters,
        Number(page),
        Number(limit),
      );
      res.status(200).send(paginatedResult);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).send({ error: error.message });
      } else {
        res.status(500).send({ error: "An unknown error occurred" });
      }
    }
  }

  async getReservationById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const reservation = await this.reservationService.getReservationById(id);
      if (!reservation) {
        return res.status(404).send({ error: "Reservation not found" });
      }
      res.status(200).send(reservation);
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
