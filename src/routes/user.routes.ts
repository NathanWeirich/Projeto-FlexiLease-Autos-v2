import { Router } from "express";
import { container } from "tsyringe";
import { validateUser } from "../validation/userValidation";
import UserController from "../controllers/UserController";

const router = Router();
const userController = container.resolve(UserController);

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - cpf
 *         - birth
 *         - email
 *         - password
 *         - cep
 *         - qualified
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the user
 *           example: 'Joãozinho Ciclano'
 *         cpf:
 *           type: string
 *           description: The user cpf
 *           example: '131.147.859-49'
 *         birth:
 *           type: string
 *           description: The user birth date
 *           example: '03/03/2000'
 *         email:
 *           type: string
 *           description: The email of the user
 *           example: 'joaozinho@email.com'
 *         password:
 *           type: string
 *           description: The user password
 *           example: '123456'
 *         cep:
 *           type: string
 *           description: The user residence cep
 *           example: '01001000'
 *         qualified:
 *           type: string
 *           description: If the user is qualified for drive
 *           example: 'sim'
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management Routes
 */

/**
 * @swagger
 * /api/v1/user:
 *   post:
 *     summary: Registers a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User successfully registered
 *       400:
 *         description: Invalid data
 */
router.post(
  "/user",
  validateUser,
  userController.registerUser.bind(userController),
);

/**
 * @swagger
 * /api/v1/user:
 *   get:
 *     summary: Lists all users
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *         description: number of page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         description: number of users per page
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get("/user", userController.getAllUsers.bind(userController));

/**
 * @swagger
 * /api/v1/user/{id}:
 *   get:
 *     summary: Retrieve a single user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: A single user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       400:
 *         description: Invalid ID
 */
router.get("/user/:id", userController.getUserById.bind(userController));

/**
 * @swagger
 * /api/v1/user/{id}:
 *   put:
 *     summary: Update a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid data
 *       404:
 *         description: User not found
 */
router.put(
  "/user/:id",
  validateUser,
  userController.updateUser.bind(userController),
);

/**
 * @swagger
 * /api/v1/user/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       204:
 *         description: User successfully deleted
 *       404:
 *         description: User not found
 *       400:
 *         description: Invalid ID
 */
router.delete("/user/:id", userController.deleteUser.bind(userController));

/**
 * @swagger
 * /api/v1/authenticate:
 *   post:
 *     summary: Authenticate a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email
 *                 example: joaozinho@email.com
 *               password:
 *                 type: string
 *                 description: The user's password
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Authentication successful, returns a token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: The JWT token
 *       400:
 *         description: Invalid email or password
 */
router.post(
  "/authenticate",
  userController.authenticateUser.bind(userController),
);

export default router;
