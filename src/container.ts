import "reflect-metadata";
import { container } from "tsyringe";
import UserService from "./services/UserService";
import UserController from "./controllers/UserController";
import CarService from "./services/CarService";
import CarController from "./controllers/CarController";
import ReservationService from "./services/ReservationService";
import ReservationController from "./controllers/ReservationController";

container.registerSingleton<UserService>(UserService);
container.registerSingleton<UserController>(UserController);
container.registerSingleton<CarService>(CarService);
container.registerSingleton<CarController>(CarController);
container.registerSingleton<ReservationService>(ReservationService);
container.registerSingleton<ReservationController>(ReservationController);
