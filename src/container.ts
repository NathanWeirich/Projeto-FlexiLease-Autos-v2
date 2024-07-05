import "reflect-metadata";
import { container } from "tsyringe";
import UserService from "./api/services/UserService";
import UserController from "./api/controllers/UserController";
import CarService from "./api/services/CarService";
import CarController from "./api/controllers/CarController";
import ReservationService from "./api/services/ReservationService";
import ReservationController from "./api/controllers/ReservationController";

container.registerSingleton<UserService>(UserService);
container.registerSingleton<UserController>(UserController);
container.registerSingleton<CarService>(CarService);
container.registerSingleton<CarController>(CarController);
container.registerSingleton<ReservationService>(ReservationService);
container.registerSingleton<ReservationController>(ReservationController);
