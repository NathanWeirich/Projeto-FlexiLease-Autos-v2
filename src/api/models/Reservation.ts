import { Schema, model } from "mongoose";

const ReservationSchema = new Schema({
  id_user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  id_car: {
    type: Schema.Types.ObjectId,
    ref: "Car",
    required: true,
  },
  start_date: {
    type: Date,
    required: true,
  },
  end_date: {
    type: Date,
    required: true,
  },
  final_value: {
    type: Number,
    required: true,
  },
});

const Reservation = model("Reservation", ReservationSchema);
export default Reservation;
