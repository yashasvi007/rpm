import { defineMessages } from "react-intl";

const messages = defineMessages({
  salutation: {
    id: "app.sign-up.salutation",
    description: "salutation text",
    defaultMessage: "Hello"
  },
  salutationWithoutName: {
    id: "app.sign-up.salutation-without-name",
    description: "salutation text without name",
    defaultMessage: "Hello "
  },
  clickAway: {
    id: "app.sign-up.click-away",
    description: "just a click away text",
    defaultMessage: "You are just a click away from getting started"
  },
  email: {
    id: "app.sign-up.email",
    description: "email text",
    defaultMessage: "Email"
  },
  password: {
    id: "app.sign-up.password",
    description: "password text",
    defaultMessage: "Password"
  },
  confirmPassword: {
    id: "app.sign-up.confirm-password",
    description: "confirm password text",
    defaultMessage: "Confirm Password"
  },
  signUp: {
    id: "app.sign-up.sign-up",
    description: "sign up button text",
    defaultMessage: "Sign Up"
  },
  passwordEnsure: {
    id: "app.sign-up.password-ensure",
    description: "Tip for password and confirm password not matching",
    defaultMessage: "Please ensure if password entered is correct & matching"
  },
  ensureAgreement: {
    id: "app.sign-up.ensure-agreement",
    description: "Tip for not checking agreement checkbox",
    defaultMessage: "Please agree the terms and conditions!"
  },
  agreement: {
    id: "app.sign-up.agreement",
    description: "I agree text",
    defaultMessage: "I agree with the"
  },
  privacy: {
    id: "app.sign-up.privacy",
    description: "privacy text",
    defaultMessage: "Privacy Policy"
  },
  conditions: {
    id: "app.sign-up.conditions",
    description: "condition text",
    defaultMessage: "Conditions"
  },
  checkbox: {
    id: "app.sign-up.checkbox",
    description: "checkbox error text",
    defaultMessage: "Please check the box"
  },
  passwordError: {
    id: "app.sign-up.password-error",
    description: "password not filled error text",
    defaultMessage: "Please enter your password"
  },
  passwordLengthError: {
    id: "app.sign-up.password-length-error",
    description: "password length less than 6 error text",
    defaultMessage: "Password must be at least 6 characters"
  },
  confirmPasswordError: {
    id: "app.sign-up.confirm-password-error",
    description: "confirm password not filled error text",
    defaultMessage: "Please confirm your Password!"
  }
});

export default messages;
