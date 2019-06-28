import { defineMessages } from "react-intl";

const messages = defineMessages({
  passwordError: {
    id: "app.forgot-password.password-error",
    description: "password not filled error text",
    defaultMessage: "Please enter your password!"
  },
  confirmPasswordError: {
    id: "app.forgot-password.confirm-password-error",
    description: "confirm password not filled error text",
    defaultMessage: "Please confirm your Password!"
  },
  confirmPassword: {
    id: "app.forgot-password.confirm-password",
    description: "confirm password text",
    defaultMessage: "Confirm Password"
  },
  newPassword: {
    id: "app.forgot-password.new-password",
    description: "new password text",
    defaultMessage: "New Password"
  },
  comparePasswordText: {
    id: "app.forgot-password.compare-password-text",
    description: "compare password text",
    defaultMessage: "Two passwords that you enter is inconsistent!"
  },
  changePassword: {
    id: "app.forgot-password",
    description: "change password",
    defaultMessage: "Chnage password"
  }
});

export default messages;
