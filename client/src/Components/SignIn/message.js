import { defineMessages } from "react-intl";

const messages = defineMessages({
  email: {
    id: "app.sign-in.email",
    description: "email text",
    defaultMessage: "Email"
  },
  password: {
    id: "app.sign-in.password",
    description: "password text",
    defaultMessage: "Password"
  },
  signIn: {
    id: "app.sign-in.sign-in",
    description: "sign in button text",
    defaultMessage: "Sign In"
  },
  forgotPassword: {
    id: "app.sign-in.forgot-password",
    description: "forgot password",
    defaultMessage: "Forgot Password?"
  },
  passwordError: {
    id: "app.sign-in.password-error",
    description: "password not filled error text",
    defaultMessage: "Please enter your password"
  },
  enterEmail: {
    id: "app.sign-in.enter-email",
    description: "email decorator text",
    defaultMessage: "Please enter your email"
  },
  validEmail: {
    id: "app.sign-in.valid-email",
    description: "valid email decorator text",
    defaultMessage: "Please provide a valid email"
  }
});

export default messages;
