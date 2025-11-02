import Joi from "joi";

export const signupValidation = (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });
  console.log(req.body);
  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: "Bad request", error });
  }
  next();
};

export const loginValidation = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });
  console.log(req.body);

  const { error } = schema.validate(req.body);
  console.log(error);
  if (error) {
    return res.status(400).json({ message: "Bad request", error });
  }
  next();
};

// module.exports = { signupValidation, loginValidation };
