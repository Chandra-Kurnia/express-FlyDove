import { body } from 'express-validator'

const registerFieldRules = () => [
  body('name')
    .notEmpty()
    .withMessage('Please insert your name')
    .bail()
    .isLength({ min: 2, max: 20 })
    .withMessage('Name min 2 and max 20'),
  body('email')
    .notEmpty()
    .withMessage('Please input your email')
    .bail()
    .isEmail()
    .withMessage('Your email is invalid'),
  body('password')
    .notEmpty()
    .withMessage('Plese insert your password')
    .isLength({ min: 8, max: 15 })
    .withMessage('Password min 8 & max 15 character')
    .bail()
    .matches('[A-Z]')
    .withMessage('Your password must have uppercase')
    .bail()
    .matches('[a-z]')
    .withMessage('Your password must have lowercase')
    .bail()
    .matches('[0-9]')
    .withMessage('Your pasword must have number')
]

export default {
  registerFieldRules
}
