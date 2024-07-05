import Car from "../models/Car";
import { ICar } from "../interfaces/ICar";
import { injectable } from "tsyringe";
import createError from "http-errors";

@injectable()
class CarService {
  async registerCar(carData: ICar) {
    const car = new Car(carData);
    await car.save();
    return car;
  }

  async getCars(
    query: any,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    cars: ICar[];
    total: number;
    limit: number;
    offset: number;
    offsets: number;
  }> {
    const offset = (page - 1) * limit;
    const cars = await Car.find(query).limit(limit).skip(offset).exec();
    const total = await Car.countDocuments(query).exec();
    const offsets = Math.ceil(total / limit);
    return { cars, total, limit, offset, offsets };
  }

  async getCarById(id: string): Promise<ICar | null> {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw createError(400, "Invalid ID format");
    }
    const car = await Car.findById(id).exec();
    if (!car) {
      throw createError(404, "Car not found");
    }
    return car;
  }

  async deleteCar(id: string): Promise<ICar | null> {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw createError(400, "Invalid ID format");
    }
    const car = await Car.findByIdAndDelete(id).exec();
    if (!car) {
      throw createError(404, "Car not found");
    }
    return car;
  }

  async updateCar(id: string, carData: Partial<ICar>): Promise<ICar | null> {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw createError(400, "Invalid ID format");
    }
    const car = await Car.findByIdAndUpdate(id, carData, {
      new: true,
      runValidators: true,
    }).exec();
    if (!car) {
      throw createError(404, "Car not found");
    }
    return car;
  }

  async updateAccessory(
    carId: string,
    accessoryId: string,
    description: string,
  ): Promise<ICar | null> {
    if (
      !carId.match(/^[0-9a-fA-F]{24}$/) ||
      !accessoryId.match(/^[0-9a-fA-F]{24}$/)
    ) {
      throw createError(400, "Invalid ID format");
    }
    const car = await Car.findById(carId).exec();
    if (!car) {
      throw createError(404, "Car not found");
    }
    const accessoryIndex = car.accessories.findIndex(
      (a) => a._id.toString() === accessoryId,
    );
    if (accessoryIndex > -1) {
      if (car.accessories[accessoryIndex].description === description) {
        car.accessories.splice(accessoryIndex, 1);
      } else {
        car.accessories[accessoryIndex].description = description;
      }
    } else {
      car.accessories.push({ _id: accessoryId, description });
    }
    await car.save();
    return car;
  }
}

export default CarService;
