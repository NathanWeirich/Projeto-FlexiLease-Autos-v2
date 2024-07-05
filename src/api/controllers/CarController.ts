import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "tsyringe";
import mongoose from "mongoose";
import createError from "http-errors";
import CarService from "../services/CarService";

@injectable()
class CarController {
  constructor(@inject(CarService) private carService: CarService) {}

  async registerCar(req: Request, res: Response, next: NextFunction) {
    try {
      const car = await this.carService.registerCar(req.body);
      res.status(201).json(car);
    } catch (error: any) {
      next(error);
    }
  }

  async getCars(req: Request, res: Response, next: NextFunction) {
    const {
      page = 1,
      limit = 10,
      model,
      color,
      year,
      value_per_day,
      accessories,
    } = req.query;

    const query: any = {};
    if (model) query.model = model;
    if (color) query.color = color;
    if (year) query.year = year;
    if (value_per_day) query.value_per_day = value_per_day;
    if (accessories)
      query.accessories = { $elemMatch: { description: accessories } };

    try {
      const paginatedResult = await this.carService.getCars(
        query,
        Number(page),
        Number(limit),
      );
      res.status(200).json(paginatedResult);
    } catch (error: any) {
      next(error);
    }
  }

  async getCarById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createError(400, "Invalid ID format"));
    }

    try {
      const car = await this.carService.getCarById(id);
      if (!car) {
        throw createError(404, "Car not found");
      }
      res.status(200).json(car);
    } catch (error: any) {
      next(error);
    }
  }

  async deleteCar(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createError(400, "Invalid ID format"));
    }

    try {
      const car = await this.carService.deleteCar(id);
      if (!car) {
        throw createError(404, "Car not found");
      }
      res.status(204).send();
    } catch (error: any) {
      next(error);
    }
  }

  async updateCar(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createError(400, "Invalid ID format"));
    }

    try {
      const updatedCar = await this.carService.updateCar(id, req.body);
      if (!updatedCar) {
        throw createError(404, "Car not found");
      }
      res.status(200).json(updatedCar);
    } catch (error: any) {
      next(error);
    }
  }

  async updateAccessory(req: Request, res: Response, next: NextFunction) {
    const { id, accessoryId } = req.params;
    const { description } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(id) ||
      !mongoose.Types.ObjectId.isValid(accessoryId)
    ) {
      return next(createError(400, "Invalid ID format"));
    }

    if (!description) {
      return next(createError(400, "Description is required"));
    }

    try {
      const updatedCar = await this.carService.updateAccessory(
        id,
        accessoryId,
        description,
      );
      if (!updatedCar) {
        throw createError(404, "Car or accessory not found");
      }
      res.status(200).json({ car: updatedCar, accessoryId });
    } catch (error: any) {
      next(error);
    }
  }
}

export default CarController;
