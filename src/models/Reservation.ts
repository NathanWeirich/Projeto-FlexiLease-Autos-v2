import { Schema, model } from "mongoose";

const ReservationSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  carId: {
    type: Schema.Types.ObjectId,
    ref: "Car",
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  finalValue: {
    type: Number,
    required: true,
  },
});

const Reservation = model("Reservation", ReservationSchema);
export default Reservation;
