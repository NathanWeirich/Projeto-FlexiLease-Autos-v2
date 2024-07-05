import { Router } from "express";
import { container } from "tsyringe";
import { reserveValidation } from "../api/validation/reserveValidation";
import ReservationController from "../api/controllers/ReservationController";

const router = Router();
const reservationController = container.resolve(ReservationController);

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: 'http'
 *       scheme: 'bearer'
 *       bearerFormat: 'JWT'
 *   schemas:
 *     Reservation:
 *       type: object
 *       required:
 *         - id_user
 *         - id_car
 *         - start_date
 *         - end_date
 *         - final_value
 *       properties:
 *         id_user:
 *           type: string
 *           description: The ID of the user making the reservation
 *           example: '60d0fe4f5311236168a109ca'
 *         id_car:
 *           type: string
 *           description: The ID of the car being reserved
 *           example: '60d1b80a5311236168a109cb'
 *         start_date:
 *           type: string
 *           description: The start date of the reservation in DD/MM/YYYY format
 *           example: '20/03/2023'
 *         end_date:
 *           type: string
 *           description: The end date of the reservation in DD/MM/YYYY format
 *           example: '30/03/2023'
 *         final_value:
 *           type: number
 *           description: The total value of the reservation
 *           example: 50
 */

/**
 * @swagger
 * tags:
 *   name: Reservations
 *   description: Reserve management routes
 */

/**
 * @swagger
 * /api/v1/reserve:
 *   post:
 *     summary: Create a new reservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reservation'
 *     responses:
 *       201:
 *         description: Reservation created successfully
 *       400:
 *         description: Invalid data
 */
router.post(
  "/reserve",
  reserveValidation,
  reservationController.createReservation.bind(reservationController),
);

/**
 * @swagger
 * /api/v1/reserve:
 *   get:
 *     summary: Get all reservations
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         description: Number of reservations per page
 *       - in: query
 *         name: id_user
 *         schema:
 *           type: string
 *         description: User ID to filter by
 *       - in: query
 *         name: id_car
 *         schema:
 *           type: string
 *         description: Car ID to filter by
 *     responses:
 *       200:
 *         description: List of reservations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reservation'
 */
router.get(
  "/reserve",
  reservationController.getReservations.bind(reservationController),
);

/**
 * @swagger
 * /api/v1/reserve/{id}:
 *   get:
 *     summary: Get a reservation by ID
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Reservation ID
 *     responses:
 *       200:
 *         description: Reservation found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservation'
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Reservation not found
 */

router.get(
  "/reserve/:id",
  reservationController.getReservationById.bind(reservationController),
);

/**
 * @swagger
 * /api/v1/reserve/{id}:
 *   put:
 *     summary: Update a reservation by ID
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Reservation ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reservation'
 *     responses:
 *       200:
 *         description: Reservation updated successfully
 *       400:
 *         description: Invalid data or ID format
 *       404:
 *         description: Reservation not found
 */

router.put(
  "/reserve/:id",
  reserveValidation,
  reservationController.updateReservation.bind(reservationController),
);

/**
 * @swagger
 * /api/v1/reserve/{id}:
 *   delete:
 *     summary: Delete a reservation by ID
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Reservation ID
 *     responses:
 *       204:
 *         description: Reservation deleted successfully
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Reservation not found
 */
router.delete(
  "/reserve/:id",
  reservationController.deleteReservation.bind(reservationController),
);

export default router;
