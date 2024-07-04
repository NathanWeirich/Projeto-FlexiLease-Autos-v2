import Joi from "joi";
import { Request, Response, NextFunction } from "express";

const reservationSchema = Joi.object({
  id_user: Joi.string().required().messages({
    "string.empty": "User ID is required",
  }),
  id_car: Joi.string().required().messages({
    "string.empty": "Car ID is required",
  }),
  start_date: Joi.string()
    .pattern(/^\d{2}\/\d{2}\/\d{4}$/)
    .required()
    .messages({
      "string.empty": "Start date is required",
      "string.pattern.base": "Start date must be in the format DD/MM/YYYY",
    }),
  end_date: Joi.string()
    .pattern(/^\d{2}\/\d{2}\/\d{4}$/)
    .required()
    .messages({
      "string.empty": "End date is required",
      "string.pattern.base": "End date must be in the format DD/MM/YYYY",
    }),
});

export const reserveValidation = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { error } = reservationSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const details = error.details.map((detail) => ({
      message: detail.message,
      path: detail.path.join("."),
      type: detail.type,
    }));
    return res.status(400).json({
      status: "error",
      message: "Validation error",
      details,
    });
  }
  next();
};
