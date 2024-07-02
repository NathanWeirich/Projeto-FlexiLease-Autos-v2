import { ICar } from "interfaces/ICar";
import { ICarAccessory } from "interfaces/ICarAccessory";
import { Schema, model } from "mongoose";
import CarAccessory from "./CarAccessory";

const CarSchema = new Schema<ICar>({
  model: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
    validate: {
      validator: function (v: string) {
        const value: number = parseInt(v);
        return value >= 1950 && value <= 2023;
      },
      message: (props) => `${props.value} is not a valid year!`,
    },
  },
  value_per_day: {
    type: Number,
    required: true,
  },
  accessories: {
    type: [CarAccessory],
    required: true,
    validate: {
      validator: function (v: ICarAccessory[]) {
        if (v.length === 0) {
          return false;
        }
        const descriptions = v.map((accessory) => accessory.description);
        const uniqueDescriptions = new Set(descriptions);
        return descriptions.length === uniqueDescriptions.size;
      },
      message: (props) => {
        if (props.value.length === 0) {
          return `At least one accessory is required.`;
        }
        return `Duplicate accessories are not allowed!`;
      },
    },
  },
  number_of_passengers: {
    type: Number,
    required: true,
  },
});

const Car = model<ICar>("Car", CarSchema);

export default Car;
