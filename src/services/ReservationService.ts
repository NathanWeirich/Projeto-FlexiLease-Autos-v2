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
    const existingReservations = await Reservation.find({ carId: id_car });
    existingReservations.forEach((reservation) => {
      const reservedInterval = {
        start: reservation.startDate,
        end: reservation.endDate,
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
    const userReservations = await Reservation.find({ userId: id_user });
    userReservations.forEach((reservation) => {
      const reservedInterval = {
        start: reservation.startDate,
        end: reservation.endDate,
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
      userId: id_user,
      carId: id_car,
      startDate: parse(start_date, "dd/MM/yyyy", new Date()),
      endDate: parse(end_date, "dd/MM/yyyy", new Date()),
      finalValue,
    });

    await reservation.save();
    return reservation;
  }
}
