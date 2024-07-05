import { Request, Response } from "express";
import { injectable, inject } from "tsyringe";
import mongoose from "mongoose";
import createError from "http-errors";
import CarService from "../services/CarService";

@injectable()
class CarController {
  constructor(@inject(CarService) private carService: CarService) {}

  async registerCar(req: Request, res: Response) {
    try {
      const car = await this.carService.registerCar(req.body);
      res.status(201).json(car);
    } catch (error: any) {
      if (error.status) {
        res
          .status(error.status)
          .json({ code: error.status, message: error.message });
      } else {
        res.status(500).json({ code: 500, error: error.message.toString() });
      }
    }
  }

  async getCars(req: Request, res: Response) {
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
      if (error.status) {
        res
          .status(error.status)
          .json({ code: error.status, message: error.message });
      } else {
        res.status(500).json({ code: 500, error: error.message.toString() });
      }
    }
  }

  async getCarById(req: Request, res: Response) {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    try {
      const car = await this.carService.getCarById(id);
      if (!car) {
        throw createError(404, "Car not found");
      }
      res.status(200).json(car);
    } catch (error: any) {
      if (error.status) {
        res
          .status(error.status)
          .json({ code: error.status, message: error.message });
      } else {
        res.status(500).json({ code: 500, error: error.message.toString() });
      }
    }
  }

  async deleteCar(req: Request, res: Response) {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    try {
      const car = await this.carService.deleteCar(id);
      if (!car) {
        throw createError(404, "Car not found");
      }
      res.status(204).send();
    } catch (error: any) {
      if (error.status) {
        res
          .status(error.status)
          .json({ code: error.status, message: error.message });
      } else {
        res.status(500).json({ code: 500, error: error.message.toString() });
      }
    }
  }

  async updateCar(req: Request, res: Response) {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    try {
      const updatedCar = await this.carService.updateCar(id, req.body);
      if (!updatedCar) {
        throw createError(404, "Car not found");
      }
      res.status(200).json(updatedCar);
    } catch (error: any) {
      if (error.status) {
        res
          .status(error.status)
          .json({ code: error.status, message: error.message });
      } else {
        res.status(500).json({ code: 500, error: error.message.toString() });
      }
    }
  }

  async updateAccessory(req: Request, res: Response) {
    const { id, accessoryId } = req.params;
    const { description } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(id) ||
      !mongoose.Types.ObjectId.isValid(accessoryId)
    ) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    if (!description) {
      return res.status(400).json({ error: "Description is required" });
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
      if (error.status) {
        res
          .status(error.status)
          .json({ code: error.status, message: error.message });
      } else {
        res.status(500).json({ code: 500, error: error.message.toString() });
      }
    }
  }
}

export default CarController;
