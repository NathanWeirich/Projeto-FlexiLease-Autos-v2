import { Router } from "express";
import { container } from "tsyringe";
import { validateCar } from "../api/validation/carValidation";
import CarController from "../api/controllers/CarController";

const router = Router();
const carController = container.resolve(CarController);

/**
 * @swagger
 * components:
 *   schemas:
 *     Car:
 *       type: object
 *       required:
 *         - model
 *         - color
 *         - year
 *         - value_per_day
 *         - accessories
 *         - number_of_passengers
 *       properties:
 *         model:
 *           type: string
 *           description: The model of the car
 *           example: 'Honda Civic'
 *         color:
 *           type: string
 *           description: The color of the car
 *           example: 'Black'
 *         year:
 *           type: string
 *           description: The manufacturing year of the car
 *           example: '2020'
 *         value_per_day:
 *           type: number
 *           description: The rental price per day
 *           example: 100
 *         accessories:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *           description: List of car accessories
 *           example: [{ "description": "Air conditioning" }, { "description": "Power steering" }]
 *         number_of_passengers:
 *           type: integer
 *           description: The number of passengers
 *           example: 5
 */

/**
 * @swagger
 * tags:
 *   name: Cars
 *   description: API for car management
 */

/**
 * @swagger
 * /api/v1/car:
 *   post:
 *     summary: Registers a new car
 *     tags: [Cars]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Car'
 *     responses:
 *       201:
 *         description: Car successfully registered
 *       400:
 *         description: Invalid data
 */
router.post("/car", validateCar, carController.registerCar.bind(carController));

/**
 * @swagger
 * /api/v1/car:
 *   get:
 *     summary: Lists all cars
 *     tags: [Cars]
 *     parameters:
 *       - in: query
 *         name: model
 *         schema:
 *           type: string
 *         description: Car model
 *       - in: query
 *         name: color
 *         schema:
 *           type: string
 *         description: Car color
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Car year
 *     responses:
 *       200:
 *         description: List of cars
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Car'
 */
router.get("/car", carController.getCars.bind(carController));

/**
 * @swagger
 * /api/v1/car/{id}:
 *   get:
 *     summary: Gets a car by ID
 *     tags: [Cars]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Car ID
 *     responses:
 *       200:
 *         description: Car found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Car'
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Car not found
 */
router.get("/car/:id", carController.getCarById.bind(carController));

/**
 * @swagger
 * /api/v1/car/{id}:
 *   delete:
 *     summary: Deletes a car by ID
 *     tags: [Cars]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Car ID
 *     responses:
 *       204:
 *         description: Car successfully deleted
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Car not found
 */
router.delete("/car/:id", carController.deleteCar.bind(carController));

/**
 * @swagger
 * /api/v1/car/{id}:
 *   put:
 *     summary: Updates a car by ID
 *     tags: [Cars]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Car ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Car'
 *     responses:
 *       200:
 *         description: Car successfully updated
 *       400:
 *         description: Invalid data or ID format
 *       404:
 *         description: Car not found
 */
router.put(
  "/car/:id",
  validateCar,
  carController.updateCar.bind(carController),
);

/**
 * @swagger
 * /api/v1/car/{id}/accessories/{accessoryId}:
 *   patch:
 *     summary: Updates an accessory of a car by ID
 *     tags: [Cars]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Car ID
 *       - in: path
 *         name: accessoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Accessory ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *             required:
 *               - description
 *     responses:
 *       200:
 *         description: Accessory successfully updated
 *       400:
 *         description: Invalid data or ID format
 *       404:
 *         description: Car or accessory not found
 */
router.patch(
  "/car/:id/accessories/:accessoryId",
  carController.updateAccessory.bind(carController),
);

export default router;
