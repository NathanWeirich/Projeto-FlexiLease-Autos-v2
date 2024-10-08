import Reservation from "../models/Reservation";
import Car from "../models/Car";
import User from "../models/User";
import { IReservation } from "../interfaces/IReservation";
import { parse, isWithinInterval, format, addDays, subDays } from "date-fns";
import mongoose from "mongoose";
import createError from "http-errors";
import { injectable } from "tsyringe";

@injectable()
class ReservationService {
  async createReservation(reservationData: IReservation) {
    const { id_user, id_car, start_date, end_date } = reservationData;

    // Verificar se o usuário possui uma carteira de motorista
    const user = await User.findById(id_user);
    if (!user) {
      throw createError(404, "User not found");
    }
    if (user.qualified !== "sim") {
      throw createError(400, "User is not qualified to make a reservation");
    }

    // Verificar se o carro existe
    const car = await Car.findById(id_car);
    if (!car) {
      throw createError(404, "Car not found");
    }

    // Calcular o valor final
    const days = Math.ceil(
      (parse(end_date, "dd/MM/yyyy", new Date()).getTime() -
        parse(start_date, "dd/MM/yyyy", new Date()).getTime()) /
        (1000 * 60 * 60 * 24),
    );
    const finalValue = days * car.value_per_day;

    // Verificar se o carro já está reservado no mesmo período
    const existingReservations = await Reservation.find({ id_car });
    existingReservations.forEach((reservation) => {
      const reservedInterval = {
        start: reservation.start_date,
        end: reservation.end_date,
      };
      if (
        isWithinInterval(
          parse(start_date, "dd/MM/yyyy", new Date()),
          reservedInterval,
        ) ||
        isWithinInterval(
          parse(end_date, "dd/MM/yyyy", new Date()),
          reservedInterval,
        )
      ) {
        throw createError(
          400,
          "The car is already reserved for the given period",
        );
      }
    });

    // Verificar se o usuário já possui uma reserva no mesmo período
    const userReservations = await Reservation.find({ id_user });
    userReservations.forEach((reservation) => {
      const reservedInterval = {
        start: reservation.start_date,
        end: reservation.end_date,
      };
      if (
        isWithinInterval(
          parse(start_date, "dd/MM/yyyy", new Date()),
          reservedInterval,
        ) ||
        isWithinInterval(
          parse(end_date, "dd/MM/yyyy", new Date()),
          reservedInterval,
        )
      ) {
        throw createError(
          400,
          "The user already has a reservation for the given period",
        );
      }
    });

    const reservation = new Reservation({
      id_user,
      id_car,
      start_date: parse(start_date, "dd/MM/yyyy", new Date()),
      end_date: parse(end_date, "dd/MM/yyyy", new Date()),
      final_value: finalValue,
    });

    const savedReservation = await reservation.save();
    return {
      id_reserve: savedReservation._id.toString(),
      id_user: savedReservation.id_user.toString(),
      id_car: savedReservation.id_car.toString(),
      start_date: format(savedReservation.start_date, "dd/MM/yyyy"),
      end_date: format(savedReservation.end_date, "dd/MM/yyyy"),
      final_value: savedReservation.final_value.toFixed(2).replace(".", ","),
    };
  }

  async getReservations(
    query: any,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    reservations: IReservation[];
    total: number;
    limit: number;
    offset: number;
    offsets: number;
  }> {
    const offset = (page - 1) * limit;
    const total = await Reservation.countDocuments(query);
    const offsets = Math.ceil(total / limit);
    const reservationsDocuments = await Reservation.find(query)
      .skip(offset)
      .limit(limit)
      .exec();

    const reservations = reservationsDocuments.map((reservation) => ({
      id_reserve: reservation._id.toString(),
      id_user: reservation.id_user.toString(),
      id_car: reservation.id_car.toString(),
      start_date: format(reservation.start_date, "dd/MM/yyyy"),
      end_date: format(reservation.end_date, "dd/MM/yyyy"),
      final_value: reservation.final_value.toFixed(2).replace(".", ","),
    }));

    return { reservations, total, limit, offset, offsets };
  }

  async getReservationById(id: string): Promise<IReservation | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createError(400, "Invalid ID format");
    }
    const reservation = await Reservation.findById(id).exec();
    if (!reservation) {
      throw createError(404, "Reservation not found");
    }

    return {
      id_reserve: reservation._id.toString(),
      id_user: reservation.id_user.toString(),
      id_car: reservation.id_car.toString(),
      start_date: format(reservation.start_date, "dd/MM/yyyy"),
      end_date: format(reservation.end_date, "dd/MM/yyyy"),
      final_value: reservation.final_value.toFixed(2).replace(".", ","),
    };
  }

  async updateReservation(
    id: string,
    reservationData: IReservation,
  ): Promise<IReservation | null> {
    const { id_user, id_car, start_date, end_date } = reservationData;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createError(400, "Invalid reservation ID");
    }

    const user = await User.findById(id_user);
    if (!user) {
      throw createError(404, "User not found");
    }
    if (user.qualified !== "sim") {
      throw createError(400, "User is not qualified to make a reservation");
    }

    const car = await Car.findById(id_car);
    if (!car) {
      throw createError(404, "Car not found");
    }

    const days = Math.ceil(
      (parse(end_date, "dd/MM/yyyy", new Date()).getTime() -
        parse(start_date, "dd/MM/yyyy", new Date()).getTime()) /
        (1000 * 60 * 60 * 24),
    );
    const finalValue = days * car.value_per_day;

    const existingReservations = await Reservation.find({
      id_car,
      _id: { $ne: id },
    });
    existingReservations.forEach((reservation) => {
      const reservedInterval = {
        start: reservation.start_date,
        end: reservation.end_date,
      };
      if (
        isWithinInterval(
          parse(start_date, "dd/MM/yyyy", new Date()),
          reservedInterval,
        ) ||
        isWithinInterval(
          parse(end_date, "dd/MM/yyyy", new Date()),
          reservedInterval,
        )
      ) {
        throw createError(
          400,
          "The car is already reserved for the given period",
        );
      }

      const nextDay = addDays(reservation.end_date, 1);
      if (isWithinInterval(nextDay, reservedInterval)) {
        throw createError(400, "The car is reserved for the next day");
      }

      const previousDay = subDays(reservation.start_date, 1);
      if (isWithinInterval(previousDay, reservedInterval)) {
        throw createError(400, "The car is reserved for the previous day");
      }
    });

    const userReservations = await Reservation.find({
      id_user,
      _id: { $ne: id },
    });
    userReservations.forEach((reservation) => {
      const reservedInterval = {
        start: reservation.start_date,
        end: reservation.end_date,
      };
      if (
        isWithinInterval(
          parse(start_date, "dd/MM/yyyy", new Date()),
          reservedInterval,
        ) ||
        isWithinInterval(
          parse(end_date, "dd/MM/yyyy", new Date()),
          reservedInterval,
        )
      ) {
        throw createError(
          400,
          "The user already has a reservation for the given period",
        );
      }
    });

    const updatedReservation = await Reservation.findByIdAndUpdate(
      id,
      {
        id_user,
        id_car,
        start_date: parse(start_date, "dd/MM/yyyy", new Date()),
        end_date: parse(end_date, "dd/MM/yyyy", new Date()),
        final_value: finalValue,
      },
      { new: true },
    );

    if (!updatedReservation) {
      throw createError(404, "Reservation not found");
    }

    return {
      id_reserve: updatedReservation._id.toString(),
      id_user: updatedReservation.id_user.toString(),
      id_car: updatedReservation.id_car.toString(),
      start_date: format(updatedReservation.start_date, "dd/MM/yyyy"),
      end_date: format(updatedReservation.end_date, "dd/MM/yyyy"),
      final_value: updatedReservation.final_value.toFixed(2).replace(".", ","),
    };
  }

  async deleteReservation(id: string): Promise<IReservation | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createError(400, "Invalid ID format");
    }
    const reservation = await Reservation.findByIdAndDelete(id).exec();
    if (!reservation) {
      throw createError(404, "Reservation not found");
    }

    return {
      id_reserve: reservation._id.toString(),
      id_user: reservation.id_user.toString(),
      id_car: reservation.id_car.toString(),
      start_date: format(reservation.start_date, "dd/MM/yyyy"),
      end_date: format(reservation.end_date, "dd/MM/yyyy"),
      final_value: reservation.final_value.toFixed(2).replace(".", ","),
    };
  }
}

export default ReservationService;
