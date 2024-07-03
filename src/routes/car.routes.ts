import { Router } from "express";
import CarController from "../controllers/car.controller";
import { CarService } from "../services/carService";

const router = Router();
const carService = new CarService();
const carController = new CarController(carService);

router.post("/car", carController.registerCar.bind(carController));
router.get("/car", carController.getCars.bind(carController));
router.get("/car/:id", carController.getCarById.bind(carController));
router.delete("/car/:id", carController.deleteCar.bind(carController));
router.put("/car/:id", carController.updateCar.bind(carController));

export default router;
