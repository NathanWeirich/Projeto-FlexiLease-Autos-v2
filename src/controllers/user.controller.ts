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
}

export default UserController;
