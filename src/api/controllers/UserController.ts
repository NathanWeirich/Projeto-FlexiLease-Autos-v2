import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "tsyringe";
import UserService from "../services/UserService";
import createError from "http-errors";

@injectable()
class UserController {
  constructor(@inject(UserService) private userService: UserService) {}

  async registerUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.userService.registerUser(req.body);
      res.status(201).json(user.toJSON());
    } catch (error: any) {
      next(error);
    }
  }

  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    const { page = 1, limit = 10 } = req.query;
    try {
      const paginatedResult = await this.userService.getAllUsers(
        Number(page),
        Number(limit),
      );
      res.status(200).json(paginatedResult);
    } catch (error: any) {
      next(error);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      const user = await this.userService.getUserById(id);
      if (!user) {
        throw createError(404, "User not found");
      }
      res.status(200).json(user);
    } catch (error: any) {
      next(error);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      const updatedUser = await this.userService.updateUser(id, req.body);
      if (!updatedUser) {
        throw createError(404, "User not found");
      }
      res.status(200).json(updatedUser);
    } catch (error: any) {
      next(error);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      const deletedUser = await this.userService.deleteUser(id);
      if (!deletedUser) {
        throw createError(404, "User not found");
      }
      res.status(204).send();
    } catch (error: any) {
      next(error);
    }
  }

  async authenticateUser(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    try {
      const token = await this.userService.authenticateUser(email, password);
      res.status(200).json({ token });
    } catch (error: any) {
      next(error);
    }
  }
}

export default UserController;
