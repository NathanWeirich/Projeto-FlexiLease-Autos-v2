import { Router } from "express";
import UserController from "../controllers/user.controller";
import { UserService } from "../services/UserService";

const router = Router();
const userService = new UserService();
const userController = new UserController(userService);

router.post("/user", userController.registerUser.bind(userController));
router.get("/user", userController.getAllUsers.bind(userController));
router.get("/user/:id", userController.getUserById.bind(userController));
router.put("/user/:id", userController.updateUser.bind(userController));
router.delete("/user/:id", userController.deleteUser.bind(userController));
router.post(
  "/authenticate",
  userController.authenticateUser.bind(userController),
);

export default router;
