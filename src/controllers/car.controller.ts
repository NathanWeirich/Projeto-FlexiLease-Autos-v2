import { Request, Response } from "express";
import { CarService } from "../services/CarService";
import mongoose from "mongoose";

class CarController {
  constructor(private carService: CarService) {}

  async registerCar(req: Request, res: Response) {
    try {
      const car = await this.carService.registerCar(req.body);
      res.status(201).send(car);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).send({ error: error.message });
      } else {
        res.status(400).send({ error: "An unknown error occurred" });
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
      res.status(200).send(paginatedResult);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).send({ error: error.message });
      } else {
        res.status(500).send({ error: "An unknown error occurred" });
      }
    }
  }

  async getCarById(req: Request, res: Response) {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ error: "Invalid ID format" });
    }

    try {
      const car = await this.carService.getCarById(id);
      if (!car) {
        return res.status(404).send({ error: "Car not found" });
      }
      res.status(200).send(car);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).send({ error: error.message });
      } else {
        res.status(500).send({ error: "An unknown error occurred" });
      }
    }
  }

  async deleteCar(req: Request, res: Response) {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ error: "Invalid ID format" });
    }

    try {
      const car = await this.carService.deleteCar(id);
      if (!car) {
        return res.status(404).send({ error: "Car not found" });
      }
      res.status(204).send();
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).send({ error: error.message });
      } else {
        res.status(500).send({ error: "An unknown error occurred" });
      }
    }
  }

  async updateCar(req: Request, res: Response) {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ error: "Invalid ID format" });
    }

    try {
      const updatedCar = await this.carService.updateCar(id, req.body);
      if (!updatedCar) {
        return res.status(404).send({ error: "Car not found" });
      }
      res.status(200).send(updatedCar);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).send({ error: error.message });
      } else {
        res.status(400).send({ error: "An unknown error occurred" });
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
      return res.status(400).send({ error: "Invalid ID format" });
    }

    if (!description) {
      return res.status(400).send({ error: "Description is required" });
    }

    try {
      const updatedCar = await this.carService.updateAccessory(
        id,
        accessoryId,
        description,
      );
      if (!updatedCar) {
        return res.status(404).send({ error: "Car or accessory not found" });
      }
      res.status(200).send({ car: updatedCar, accessoryId });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).send({ error: error.message });
      } else {
        res.status(400).send({ error: "An unknown error occurred" });
      }
    }
  }
}

export default CarController;
