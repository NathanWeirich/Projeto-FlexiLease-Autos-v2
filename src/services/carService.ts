import Car from "../models/Car";
import { ICar } from "../interfaces/ICar";

export class CarService {
  async registerCar(carData: ICar) {
    const car = new Car(carData);
    await car.save();
    return car;
  }

  async getCars(
    query: any,
    limit: number,
    offset: number,
  ): Promise<{ cars: ICar[]; total: number }> {
    const cars = await Car.find(query).limit(limit).skip(offset).exec();
    const total = await Car.countDocuments(query);
    return { cars, total };
  }

  async getCarById(id: string): Promise<ICar | null> {
    return await Car.findById(id).exec();
  }

  async deleteCar(id: string): Promise<ICar | null> {
    return await Car.findByIdAndDelete(id).exec();
  }

  async updateCar(id: string, carData: Partial<ICar>): Promise<ICar | null> {
    return await Car.findByIdAndUpdate(id, carData, {
      new: true,
      runValidators: true,
    }).exec();
  }

  async updateAccessory(
    carId: string,
    accessoryId: string,
    description: string,
  ): Promise<ICar | null> {
    const car = await Car.findById(carId).exec();
    if (!car) {
      return null;
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
