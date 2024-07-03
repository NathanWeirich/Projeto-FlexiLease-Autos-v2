import Joi from "joi";
import { Request, Response, NextFunction } from "express";

const carSchema = Joi.object({
  model: Joi.string().required(),
  color: Joi.string().required(),
  year: Joi.string()
    .pattern(/^(19[5-9]\d|20[0-2]\d|2023)$/)
    .required(),
  value_per_day: Joi.number().required(),
  accessories: Joi.array()
    .items(
      Joi.object({
        description: Joi.string().required(),
      }),
    )
    .min(1)
    .unique("description")
    .required(),
  number_of_passengers: Joi.number().required(),
});

export const validateCar = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { error } = carSchema.validate(req.body);
  if (error) {
    return res.status(400).send({ error: error.details[0].message });
  }
  next();
};
