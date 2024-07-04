import Reservation from "../models/Reservation";
import Car from "../models/Car";
import User from "../models/User";
import { IReservation } from "../interfaces/IReservation";
import { parse, isWithinInterval } from "date-fns";

export class ReservationService {
  async createReservation(reservationData: IReservation) {
    const { id_user, id_car, start_date, end_date } = reservationData;

    // Verificar se o usuário possui uma carteira de motorista
    const user = await User.findById(id_user);
    if (!user) {
      throw new Error("User not found");
    }
    if (user.qualified !== "sim") {
      throw new Error("User is not qualified to make a reservation");
    }

    // Verificar se o carro existe
    const car = await Car.findById(id_car);
    if (!car) {
      throw new Error("Car not found");
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
        throw new Error("The car is already reserved for the given period");
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
        throw new Error(
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

    await reservation.save();
    return reservation;
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
      start_date: reservation.start_date.toISOString().split("T")[0],
      end_date: reservation.end_date.toISOString().split("T")[0],
      final_value: reservation.final_value.toFixed(2),
    }));

    return { reservations, total, limit, offset, offsets };
  }
}
