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
    try {
      const users = await this.userService.getAllUsers();
      res.status(200).send(users);
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
}

export default UserController;
