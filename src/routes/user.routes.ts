import { Router } from "express";
import UserController from "../controllers/user.controller";
import { UserService } from "../services/UserService";
import { validateUser } from "../validation/userValidation";

const router = Router();
const userService = new UserService();
const userController = new UserController(userService);

router.post(
  "/user",
  validateUser,
  userController.registerUser.bind(userController),
);
router.get("/user", userController.getAllUsers.bind(userController));
router.get("/user/:id", userController.getUserById.bind(userController));
router.put(
  "/user/:id",
  validateUser,
  userController.updateUser.bind(userController),
);
router.delete("/user/:id", userController.deleteUser.bind(userController));
router.post(
  "/authenticate",
  userController.authenticateUser.bind(userController),
);

export default router;
