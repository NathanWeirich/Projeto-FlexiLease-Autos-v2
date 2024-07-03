import axios from "axios";
import bcrypt from "bcrypt";
import User from "../models/User";
import { IUser } from "../interfaces/IUser";

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
}
