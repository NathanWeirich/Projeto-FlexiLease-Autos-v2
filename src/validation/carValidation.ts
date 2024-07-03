import Joi from "joi";
import { Request, Response, NextFunction } from "express";

const carSchema = Joi.object({
  model: Joi.string().required().messages({
    "string.empty": "Model is required",
  }),
  color: Joi.string().required().messages({
    "string.empty": "Color is required",
  }),
  year: Joi.string()
    .pattern(/^(19[5-9]\d|20[0-2]\d|2023)$/)
    .required()
    .messages({
      "string.empty": "Year is required",
      "string.pattern.base": "Year must be between 1950 and 2023",
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
      "array.mini": "At least one accessory is required",
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
