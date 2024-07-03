import axios from "axios";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { IUser } from "../interfaces/IUser";
import mongoose from "mongoose";

export class UserService {
  async registerUser(userData: IUser) {
    const { cpf, email, cep, birth, password } = userData;

    // Verificar CPF e e-mail únicos
    const cpfExists = await User.findOne({ cpf });
    if (cpfExists) {
      throw new Error("CPF already exists");
    }

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      throw new Error("Email already exists");
    }

    // Validar idade
    const birthDate = new Date(birth);
    const age = new Date().getFullYear() - birthDate.getFullYear();
    if (age < 18) {
      throw new Error("User must be at least 18 years old");
    }

    // Consultar API Via CEP
    const { data } = await axios.get(`https://viacep.com.br/ws/${cep}/json`);
    userData.patio = data.logradouro || "N/A";
    userData.complement = data.complemento || "N/A";
    userData.neighborhood = data.bairro || "N/A";
    userData.locality = data.localidade || "N/A";
    userData.uf = data.uf || "N/A";

    // Hash da senha
    const salt = await bcrypt.genSalt(10);
    userData.password = await bcrypt.hash(password, salt);

    // Criar usuário
    const user = new User(userData);
    await user.save();
    return user;
  }

  async getAllUsers(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ users: IUser[]; total: number; page: number; pages: number }> {
    const skip = (page - 1) * limit;
    const total = await User.countDocuments();
    const pages = Math.ceil(total / limit);
    const users = await User.find({}, "-password")
      .skip(skip)
      .limit(limit)
      .exec();
    return { users, total, page, pages };
  }

  async getUserById(id: string): Promise<IUser | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid ID format");
    }
    return await User.findById(id, "-password").exec();
  }

  async updateUser(
    id: string,
    userData: Partial<IUser>,
  ): Promise<IUser | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid ID format");
    }

    // Verificar se o e-mail já existe para outro usuário
    if (userData.email) {
      const emailExists = await User.findOne({
        email: userData.email,
        _id: { $ne: id },
      });
      if (emailExists) {
        throw new Error("Email already exists");
      }
    }

    // Verificar se o CPF já existe para outro usuário
    if (userData.cpf) {
      const cpfExists = await User.findOne({
        cpf: userData.cpf,
        _id: { $ne: id },
      });
      if (cpfExists) {
        throw new Error("CPF already exists");
      }
    }

    if (userData.password) {
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(userData.password, salt);
    }

    return await User.findByIdAndUpdate(id, userData, { new: true }).exec();
  }

  async deleteUser(id: string): Promise<IUser | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid ID format");
    }
    return await User.findByIdAndDelete(id).exec();
  }

  async authenticateUser(
    email: string,
    password: string,
  ): Promise<string | null> {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid email or password");
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "12h",
    });
    return token;
  }
}
