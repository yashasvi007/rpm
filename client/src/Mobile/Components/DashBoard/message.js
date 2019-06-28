import { defineMessages } from "react-intl";

const messages = defineMessages({
  careCoachProgramHeading: {
    id: "app.dashboard.carecoach.program.heading",
    description: "carecoach dashboard program heading",
    defaultMessage: "Programs"
  },
  careCoachActiveProgram: {
    id: "app.dashboard.carecoach.program.active",
    description: "carecoach dashboard active program",
    defaultMessage: "Active"
  },
  careCoachExpiredProgram: {
    id: "app.dashboard.carecoach.program.expired",
    description: "carecoach dashboard expired program",
    defaultMessage: "Expired"
  },
  careCoachSortProgramByRecentUpdated: {
    id: "app.dashboard.carecoach.program.sort.recentUpdated",
    description: "carecoach dashboard sort program by recently updated",
    defaultMessage: "Recently Updated"
  },
  careCoachExpiredSortProgramByName: {
    id: "app.dashboard.carecoach.program.sort.name",
    description: "carecoach dashboard sort program by name",
    defaultMessage: "Name"
  },
  careCoachExpiredSortProgramByDate: {
    id: "app.dashboard.carecoach.program.sort.dateAdded",
    description: "carecoach dashboard sort program by dateAdded",
    defaultMessage: "Date Added"
  },
  dashboardAppointments: {
    id: "common.dashboard.appointments",
    description: "All users dashboard headings for appointments",
    defaultMessage: "Appointments"
  },
  dashboardReminders: {
    id: "common.dashboard.reminders",
    description: "All users dashboard headings for reminders",
    defaultMessage: "Reminders"
  },
  dashboardViewAll: {
    id: "common.dashboard.view.all",
    description: "All users dashboard heading for view all",
    defaultMessage: "View All"
  },
  dateSent: {
    id: "CareCoach.dashboard.dateSent",
    description: "All dashboard Survey Sorting based on DateSent",
    defaultMessage: "Date Sent"
  },
  name: {
    id: "CareCoach.dashboard.name",
    description: "All dashboard Survey Sorting based on name",
    defaultMessage: "Name"
  },
  category: {
    id: "CareCoach.dashboard.category",
    description: "All dashboard Survey Sorting based on category",
    defaultMessage: "Category"
  },
  survey: {
    id: "CareCoach.dashboard.survey",
    description: "Dashboard Survey title",
    defaultMessage: "Surveys"
  },
  sortBy: {
    id: "CareCoach.dashboard.sortBy",
    description: "Dashboard sortBy title",
    defaultMessage: "Sort By"
  },
  dashboardSurveys: {
    id: "common.dashboard.surveys",
    description: "All users dashboard headings for surveys",
    defaultMessage: "Recently Sent Surveys"
  },
  dashboardPatientSurveys: {
    id: "common.dashboard.patientSurveys",
    description: "All users dashboard headings for surveys",
    defaultMessage: "Recent Surveys"
  },
  newAppointment: {
    id: "app.header.newAppointment",
    description: "newAppointment in add button",
    defaultMessage: "New Appointment/ Reminder"
  },
  newPatient: {
    id: "app.header.newPatient",
    description: "newPatient in add button",
    defaultMessage: "New Patient"
  },
  newDoctor: {
    id: "app.header.newDoctor",
    description: "newDoctor in add button",
    defaultMessage: "New Doctor"
  },
  reportAdverseEvent: {
    id: "app.header.reportAdverseEvent",
    description: "reportAdverseEvent in add",
    defaultMessage: "Report Adverse Event"
  }
});

export default messages;
