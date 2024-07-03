import { Schema, model } from "mongoose";

const UserSchema = new Schema({
  name: { type: String, required: true },
  cpf: { type: String, required: true, unique: true },
  birth: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cep: { type: String, required: true },
  qualified: { type: String, required: true },
  patio: { type: String, required: true, default: "N/A" },
  complement: { type: String, required: true, default: "N/A" },
  neighborhood: { type: String, required: true, default: "N/A" },
  locality: { type: String, required: true, default: "N/A" },
  uf: { type: String, required: true, default: "N/A" },
});

const User = model("User", UserSchema);
export default User;
