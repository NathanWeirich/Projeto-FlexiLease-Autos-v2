import { ICarAccessory } from "../api/interfaces/ICarAccessory";
import mongoose from "mongoose";

const { Schema } = mongoose;

const CarAccessory = new Schema<ICarAccessory>({
  description: {
    type: String,
    required: true,
  },
});

export default CarAccessory;
