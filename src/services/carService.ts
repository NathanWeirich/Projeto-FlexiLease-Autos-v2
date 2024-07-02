import Car from "../models/Car";
import { ICar } from "../interfaces/ICar";

export class CarService {
  async registerCar(carData: ICar) {
    const car = new Car(carData);
    await car.save();
    return car;
  }

  async getCars(query: any, limit: number, offset: number) {
    const cars = await Car.find(query).limit(limit).skip(offset).exec();
    const total = await Car.countDocuments(query);
    return { cars, total };
  }

  async getCarById(id: string) {
    return await Car.findById(id).exec();
  }
}
