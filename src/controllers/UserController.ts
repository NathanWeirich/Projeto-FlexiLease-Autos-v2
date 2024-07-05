import { Request, Response } from "express";
import { injectable, inject } from "tsyringe";
import createError from "http-errors";
import UserService from "../services/UserService";

@injectable()
class UserController {
  constructor(@inject(UserService) private userService: UserService) {}

  async registerUser(req: Request, res: Response) {
    try {
      const user = await this.userService.registerUser(req.body);
      res.status(201).json(user.toJSON());
    } catch (error: any) {
      if (error.status) {
        res
          .status(error.status)
          .json({ code: error.status, message: error.message });
      } else {
        res.status(500).json({ code: 500, error: error.message.toString() });
      }
    }
  }

  async getAllUsers(req: Request, res: Response) {
    const { page = 1, limit = 10 } = req.query;
    try {
      const paginatedResult = await this.userService.getAllUsers(
        Number(page),
        Number(limit),
      );
      res.status(200).json(paginatedResult);
    } catch (error: any) {
      if (error.status) {
        res
          .status(error.status)
          .json({ code: error.status, message: error.message });
      } else {
        res.status(500).json({ code: 500, error: error.message.toString() });
      }
    }
  }

  async getUserById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const user = await this.userService.getUserById(id);
      if (!user) {
        throw createError(404, "User not found");
      }
      res.status(200).json(user);
    } catch (error: any) {
      if (error.status) {
        res
          .status(error.status)
          .json({ code: error.status, message: error.message });
      } else {
        res.status(500).json({ code: 500, error: error.message.toString() });
      }
    }
  }

  async updateUser(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const updatedUser = await this.userService.updateUser(id, req.body);
      if (!updatedUser) {
        throw createError(404, "User not found");
      }
      res.status(200).json(updatedUser);
    } catch (error: any) {
      if (error.status) {
        res
          .status(error.status)
          .json({ code: error.status, message: error.message });
      } else {
        res.status(500).json({ code: 500, error: error.message.toString() });
      }
    }
  }

  async deleteUser(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const deletedUser = await this.userService.deleteUser(id);
      if (!deletedUser) {
        throw createError(404, "User not found");
      }
      res.status(204).send();
    } catch (error: any) {
      if (error.status) {
        res
          .status(error.status)
          .json({ code: error.status, message: error.message });
      } else {
        res.status(500).json({ code: 500, error: error.message.toString() });
      }
    }
  }

  async authenticateUser(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
      const token = await this.userService.authenticateUser(email, password);
      res.status(200).json({ token });
    } catch (error: any) {
      res.status(400).json({ error: "Invalid email or password" });
    }
  }
}

export default UserController;
