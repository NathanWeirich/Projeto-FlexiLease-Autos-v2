import "reflect-metadata";
import axios from "axios";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { IUser } from "../interfaces/IUser";
import mongoose from "mongoose";
import createError from "http-errors";
import { injectable } from "tsyringe";

@injectable()
class UserService {
  async registerUser(userData: IUser) {
    const { cpf, email, cep, birth, password } = userData;

    const cpfExists = await User.findOne({ cpf });
    if (cpfExists) {
      throw createError(409, "CPF already exists");
    }

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      throw createError(409, "Email already exists");
    }

    const birthDate = new Date(birth);
    const age = new Date().getFullYear() - birthDate.getFullYear();
    if (age < 18) {
      throw createError(400, "User must be at least 18 years old");
    }

    const { data } = await axios.get(`https://viacep.com.br/ws/${cep}/json`);
    userData.patio = data.logradouro || "N/A";
    userData.complement = data.complemento || "N/A";
    userData.neighborhood = data.bairro || "N/A";
    userData.locality = data.localidade || "N/A";
    userData.uf = data.uf || "N/A";

    const salt = await bcrypt.genSalt(10);
    userData.password = await bcrypt.hash(password, salt);

    const user = new User(userData);
    await user.save();
    return user;
  }

  async getAllUsers(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    users: IUser[];
    total: number;
    limit: number;
    offset: number;
    offsets: number;
  }> {
    const offset = (page - 1) * limit;
    const total = await User.countDocuments();
    const offsets = Math.ceil(total / limit);
    const users = await User.find({}, "-password")
      .skip(offset)
      .limit(limit)
      .exec();
    return { users, total, limit, offset, offsets };
  }

  async getUserById(id: string): Promise<IUser | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createError(400, "Invalid ID format");
    }
    const user = await User.findById(id, "-password").exec();
    if (!user) {
      throw createError(404, "User not found");
    }
    return user;
  }

  async updateUser(
    id: string,
    userData: Partial<IUser>,
  ): Promise<IUser | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createError(400, "Invalid ID format");
    }

    if (userData.email) {
      const emailExists = await User.findOne({
        email: userData.email,
        _id: { $ne: id },
      });
      if (emailExists) {
        throw createError(409, "Email already exists");
      }
    }

    if (userData.cpf) {
      const cpfExists = await User.findOne({
        cpf: userData.cpf,
        _id: { $ne: id },
      });
      if (cpfExists) {
        throw createError(409, "CPF already exists");
      }
    }

    if (userData.password) {
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(userData.password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(id, userData, {
      new: true,
    }).exec();
    if (!updatedUser) {
      throw createError(404, "User not found");
    }
    return updatedUser;
  }

  async deleteUser(id: string): Promise<IUser | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createError(400, "Invalid ID format");
    }
    const user = await User.findByIdAndDelete(id).exec();
    if (!user) {
      throw createError(404, "User not found");
    }
    return user;
  }

  async authenticateUser(
    email: string,
    password: string,
  ): Promise<string | null> {
    const user = await User.findOne({ email });
    if (!user) {
      throw createError(400, "Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw createError(400, "Invalid email or password");
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "12h",
    });
    return token;
  }
}

export default UserService;
