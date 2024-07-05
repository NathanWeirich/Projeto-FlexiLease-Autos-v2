import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import createError from "http-errors";

const carSchema = Joi.object({
  model: Joi.string().required().messages({
    "string.empty": "Model is required",
  }),
  color: Joi.string().required().messages({
    "string.empty": "Color is required",
  }),
  year: Joi.string()
    .required()
    .custom((value, helpers) => {
      const year = parseInt(value, 10);
      if (isNaN(year) || year < 1950 || year > 2023) {
        return helpers.error("any.invalidYearRange", { value });
      }
      return value;
    })
    .messages({
      "string.empty": "Year is required",
      "any.invalidYearRange": "Year must be between 1950 and 2023",
    }),
  value_per_day: Joi.number().required().messages({
    "number.base": "Value per day must be a number",
    "any.required": "Value per day is required",
  }),
  accessories: Joi.array()
    .items(
      Joi.object({
        description: Joi.string().required().messages({
          "string.empty": "Accessory description is required",
        }),
      }),
    )
    .min(1)
    .unique("description")
    .required()
    .messages({
      "array.min": "At least one accessory is required",
      "array.unique": "Accessory descriptions must be unique",
    }),
  number_of_passengers: Joi.number().required().messages({
    "number.base": "Number of passengers must be a number",
    "any.required": "Number of passengers is required",
  }),
});

export const validateCar = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { error } = carSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const details = error.details.map((detail) => ({
      field: detail.path.join("."),
      message: detail.message,
    }));
    return next(createError(400, "Validation error", { details }));
  }
  next();
};
