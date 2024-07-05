import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import createError from "http-errors";

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
      field: detail.path.join("."),
      message: detail.message,
    }));
    return next(createError(400, "Validation error", { details }));
  }
  next();
};
