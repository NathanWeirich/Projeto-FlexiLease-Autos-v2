import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "tsyringe";
import createError from "http-errors";
import ReservationService from "../services/ReservationService";

@injectable()
class ReservationController {
  constructor(
    @inject(ReservationService) private reservationService: ReservationService,
  ) {}

  async createReservation(req: Request, res: Response, next: NextFunction) {
    try {
      const reservation = await this.reservationService.createReservation(
        req.body,
      );
      res.status(201).json({ reservationId: reservation._id });
    } catch (error: any) {
      next(error);
    }
  }

  async getReservations(req: Request, res: Response, next: NextFunction) {
    const { page = 1, limit = 10, ...filters } = req.query;
    try {
      const paginatedResult = await this.reservationService.getReservations(
        filters,
        Number(page),
        Number(limit),
      );
      res.status(200).json(paginatedResult);
    } catch (error: any) {
      next(error);
    }
  }

  async getReservationById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      const reservation = await this.reservationService.getReservationById(id);
      if (!reservation) {
        throw createError(404, "Reservation not found");
      }
      res.status(200).json(reservation);
    } catch (error: any) {
      next(error);
    }
  }

  async updateReservation(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const reservationData = req.body;
    try {
      const updatedReservation =
        await this.reservationService.updateReservation(id, reservationData);
      if (!updatedReservation) {
        throw createError(404, "Reservation not found");
      }
      res.status(200).json(updatedReservation);
    } catch (error: any) {
      next(error);
    }
  }

  async deleteReservation(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      const deletedReservation =
        await this.reservationService.deleteReservation(id);
      if (!deletedReservation) {
        throw createError(404, "Reservation not found");
      }
      res.status(204).send();
    } catch (error: any) {
      next(error);
    }
  }
}

export default ReservationController;
