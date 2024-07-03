import { Request, Response } from "express";
import { UserService } from "../services/UserService";

class UserController {
  constructor(private userService: UserService) {}

  async registerUser(req: Request, res: Response) {
    try {
      const user = await this.userService.registerUser(req.body);
      res.status(201).send(user.toJSON());
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).send({ error: error.message });
      } else {
        res.status(400).send({ error: "An unknown error occurred" });
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
      res.status(200).send(paginatedResult);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).send({ error: error.message });
      } else {
        res.status(500).send({ error: "An unknown error occurred" });
      }
    }
  }

  async getUserById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const user = await this.userService.getUserById(id);
      if (!user) {
        return res.status(404).send({ error: "User not found" });
      }
      res.status(200).send(user);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).send({ error: error.message });
      } else {
        res.status(400).send({ error: "An unknown error occurred" });
      }
    }
  }

  async updateUser(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const updatedUser = await this.userService.updateUser(id, req.body);
      if (!updatedUser) {
        return res.status(404).send({ error: "User not found" });
      }
      res.status(200).send(updatedUser);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).send({ error: error.message });
      } else {
        res.status(400).send({ error: "An unknown error occurred" });
      }
    }
  }

  async deleteUser(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const deletedUser = await this.userService.deleteUser(id);
      if (!deletedUser) {
        return res.status(404).send({ error: "User not found" });
      }
      res.status(204).send();
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).send({ error: error.message });
      } else {
        res.status(400).send({ error: "An unknown error occurred" });
      }
    }
  }

  async authenticateUser(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
      const token = await this.userService.authenticateUser(email, password);
      res.status(200).send({ token });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).send({ error: "Invalid email or password" });
      } else {
        res.status(400).send({ error: "Invalid email or password" });
      }
    }
  }
}

export default UserController;
