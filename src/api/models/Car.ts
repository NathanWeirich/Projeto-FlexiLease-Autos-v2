import { ICar } from "api/interfaces/ICar";
import { Schema, model } from "mongoose";
import CarAccessory from "./CarAccessory";

const CarSchema = new Schema<ICar>({
  model: { type: String, required: true },
  color: { type: String, required: true },
  year: { type: String, required: true },
  value_per_day: { type: Number, required: true },
  accessories: { type: [CarAccessory], required: true },
  number_of_passengers: { type: Number, required: true },
});

CarSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

const Car = model<ICar>("Car", CarSchema);

export default Car;
