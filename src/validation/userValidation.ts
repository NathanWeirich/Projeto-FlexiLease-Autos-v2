import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { isValid, parse, differenceInYears } from "date-fns";

const userSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Name is required",
  }),
  cpf: Joi.string()
    .pattern(/^\d{11}$|^\d{3}\.\d{3}\.\d{3}-\d{2}$/)
    .required()
    .messages({
      "string.empty": "CPF is required",
      "string.pattern.base":
        "CPF must be either 11 digits or in the format 000.000.000-00",
    }),
  birth: Joi.string()
    .pattern(/^\d{2}\/\d{2}\/\d{4}$/)
    .required()
    .custom((value, helpers) => {
      const parsedDate = parse(value, "dd/MM/yyyy", new Date());
      if (!isValid(parsedDate)) {
        return helpers.error("any.invalid");
      }
      const age = differenceInYears(new Date(), parsedDate);
      if (age < 18) {
        return helpers.error("any.invalidAge");
      }
      return value;
    })
    .messages({
      "string.empty": "Birth date is required",
      "string.pattern.base": "Birth date must be in the format DD/MM/YYYY",
      "any.invalid": "Birth date must be a valid date",
      "any.invalidAge": "User must be at least 18 years old",
    }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Email must be a valid email",
  }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters",
  }),
  cep: Joi.string()
    .pattern(/^\d{8}$/)
    .required()
    .messages({
      "string.empty": "CEP is required",
      "string.pattern.base": "CEP must be 8 digits",
    }),
  qualified: Joi.string().valid("sim", "não").required().messages({
    "string.empty": "Qualified is required",
    "any.only": "Qualified must be either 'sim' or 'não'",
  }),
});

export const validateUser = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { error } = userSchema.validate(req.body, { abortEarly: false });
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
