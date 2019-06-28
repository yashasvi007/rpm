import { defineMessages } from "react-intl";

const messages = defineMessages({
  welcomeText: {
    id: "app.calendar-sync.welcome-text",
    description: "welcome text for calendar sync page",
    defaultMessage: "Welcome to the"
  },
  program: {
    id: "app.calendar-sync.program",
    description: "program",
    defaultMessage: "program!"
  },
  welcomeSubtitleText: {
    id: "app.calendar-sync.welcome-subtitle-text",
    description: "subtitle for calendar sync",
    defaultMessage:
      "First, let’s sync your email calendar for a personalised experience"
  },
  calendarSyncDescriptionText: {
    id: "app.calendar-sync.calendar-sync-description-text",
    description: "description for calendar sync",
    defaultMessage:
      "You can change this information anytime, in “Settings” section from “My Profile”"
  },
  privacyText: {
    id: "app.calendar-sync.privacy-text",
    description: "privacy is safe text",
    defaultMessage:
      "Your information is safe. We do not use or sell your information"
  },
  enableButton: {
    id: "app.calendar-sync.enable-button",
    description: "enable button",
    defaultMessage: "Enable Calendar Sync"
  },
  skipButton: {
    id: "app.calendar-sync.skip-button",
    description: "skip button",
    defaultMessage: "Skip"
  }
});

export default messages;
