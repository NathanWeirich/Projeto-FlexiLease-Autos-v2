import { ICarAccessory } from "./ICarAccessory";

export interface ICar {
  model: string;
  color: string;
  year: string;
  value_per_day: number;
  accessories: ICarAccessory[];
  number_of_passengers: number;
}
