import { defineMessages } from "react-intl";

const messages = defineMessages({
  welcomeText: {
    id: "app.calendar-sync.welcome-text",
    description: "welcome text for calendar sync page",
    defaultMessage: "Welcome to"
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
  },
  gotIt: {
    id: "app.change-password.got-it",
    description: "got it",
    defaultMessage: "Got It"
  },
  change: {
    id: "app.change-password.change-text",
    description: "change text",
    defaultMessage: "Change"
  },
  myProfile: {
    id: "app.edit-profile.edit-form.my-profile",
    description: "my profile",
    defaultMessage: "My Profile"
  },
  profileSetupText: {
    id: "app.edit-profile.edit-form.profile-setup-text",
    description: "profile set up text",
    defaultMessage: "Now, let’s get your profile set & customize the settings"
  },
  subduedProfileSetupText: {
    id: "app.edit-profile.edit-form.subdued-profile-setup-text",
    description: "profile set up description",
    defaultMessage:
      "You can change this information anytime, in “Settings” section from “My Profile”"
  },
  phoneVerificationTitle: {
    id: "app.edit-profile.personal-section.mobile-verification.modal-title",
    description: "mobile verification title",
    defaultMessage: "Mobile Verification"
  },
  phoneVerificationOKText: {
    id: "app.edit-profile.personal-section.mobile-verification.ok-text",
    description: "mobile verification ok text",
    defaultMessage: "Verify"
  },
  chnageNumberText: {
    id: "app.edit-profile.personal-section.mobile-verification.change-number",
    description: "change number",
    defaultMessage: "Change Number"
  },
  OTPReceivingTimeText: {
    id: "app.edit-profile.personal-section.mobile-verification.receiving-otp",
    description: "receiving otp in",
    defaultMessage: "You’ll be receiving the OTP verification code in"
  },
  resendOTP: {
    id: "app.edit-profile.personal-section.mobile-verification.resend-otp",
    description: "resend otp",
    defaultMessage: "Resend OTP"
  },
  OTPSent: {
    id: "app.edit-profile.personal-section.mobile-verification.otp-sent",
    description: "otp sent",
    defaultMessage: "OTP sent successfully."
  },
  OTPPlaceholder: {
    id: "app.edit-profile.personal-section.mobile-verification.otp-placeholder",
    description: "enter otp placeholder",
    defaultMessage: "Enter OTP code"
  },
  calendarSynced: {
    id: "app.edit-profile.setting-section.calendar-sync",
    description: "calendar synced",
    defaultMessage: "Calendar Sync"
  },
  smsWillBeSent: {
    id: "app.edit-profile.setting-section.sms-will-be-sent",
    description: "sms will be sent",
    defaultMessage: "SMS will be sent to your registered mobile contact"
  },
  emailAlerts: {
    id: "app.edit-profile.setting-section.email-alerts",
    description: "email alert",
    defaultMessage: "Email Alerts"
  },
  emailWillBeSent: {
    id: "app.edit-profile.setting-section.email-will-be-sent",
    description: "email will be sent",
    defaultMessage: "Email will be sent to your registered email address"
  },
  pushAlerts: {
    id: "app.edit-profile.setting-section.push-alerts",
    description: "push alert",
    defaultMessage: "In-app / Push Alerts"
  },
  pushWillBeSent: {
    id: "app.edit-profile.setting-section.push-will-be-sent",
    description: "push will be sent",
    defaultMessage: "These alerts are notified within the RPM web app."
  },
  reminderWillBeSent: {
    id: "app.edit-profile.setting-section.reminder-will-be-sent",
    description: "reminder will be sent",
    defaultMessage: "All reminders will be sent via SMS/Email/Calendar"
  },
  settings: {
    id: "app.edit-profile.setting-section.settings",
    description: "settings",
    defaultMessage: "Settings"
  },
  account: {
    id: "app.edit-profile.setting-section.account",
    description: "account",
    defaultMessage: "Account"
  },
  notifications: {
    id: "app.edit-profile.setting-section.notifications",
    description: "notifications",
    defaultMessage: "Notifications"
  },
  personal: {
    id: "app.edit-profile.menubar.personal",
    description: "personal menu text",
    defaultMessage: "Personal"
  },
  contacts: {
    id: "app.edit-profile.menubar.contacts",
    description: "contacts menu text",
    defaultMessage: "Contacts"
  },
  medical: {
    id: "app.edit-profile.menubar.medical",
    description: "medical menu text",
    defaultMessage: "Medical"
  },
  work: {
    id: "app.edit-profile.menubar.work",
    description: "work menu text",
    defaultMessage: "Work"
  },
  hospitalName: {
    id: "app.edit-profile.work-section.hospital-name",
    description: "hospital name",
    defaultMessage: "Hospital Name"
  },
  speciality: {
    id: "app.edit-profile.work-section.speciality",
    description: "speciality",
    defaultMessage: "Speciality"
  },
  specialityRule: {
    id: "app.edit-profile.work-section.speciality-rule",
    description: "speciality rule",
    defaultMessage: "Please provide speciality"
  },
  licenseNumber: {
    id: "app.edit-profile.work-section.license-number",
    description: "license number",
    defaultMessage: "License Number"
  },
  addressLine1: {
    id: "app.edit-profile.work-section.address-line1",
    description: "address line 1",
    defaultMessage: "Flat / House / Floor / Building"
  },
  addressLine2: {
    id: "app.edit-profile.work-section.address-line2",
    description: "address line 2",
    defaultMessage: "Street / Locality / Area"
  },
  zipcode: {
    id: "app.edit-profile.work-section.zipcode",
    description: "zip code",
    defaultMessage: "PO box / Zipcode"
  },
  cityLabel: {
    id: "app.edit-profile.work-section.city",
    description: "city label",
    defaultMessage: "Region or State"
  },
  countryLabel: {
    id: "app.edit-profile.work-section.country",
    description: "country label",
    defaultMessage: "Country"
  },
  organisationName: {
    id: "app.edit-profile.work-section.organisation-name",
    description: "organization name",
    defaultMessage: "Organisation Name"
  },
  services: {
    id: "app.edit-profile.work-section.services",
    description: "services",
    defaultMessage: "Services"
  },
  notBlank: {
    id: "app.edit-profile.not-blank",
    description: "not be blank",
    defaultMessage: "not be blank"
  },
  nursingTitle: {
    id: "app.edit-profile.service-section.nursing-title",
    description: "nursing title",
    defaultMessage: "Nursing"
  },
  physicalTherapyTitle: {
    id: "app.edit-profile.service-section.physical-therapy-title",
    description: "physical therapy title",
    defaultMessage: "Physical Therapy"
  },
  occupationalTherapyTitle: {
    id: "app.edit-profile.service-section.occupational-therapy-title",
    description: "occupational therapy title",
    defaultMessage: "Occupational Therapy"
  },
  speechAndLanguagePathologyTitle: {
    id: "app.edit-profile.service-section.speech-and-language-pathology-title",
    description: "speech and language pathology title",
    defaultMessage: "Speech and Language Pathology"
  },
  medicalCounsellingTitle: {
    id: "app.edit-profile.service-section.medical-counselling-title",
    description: "medical counselling title",
    defaultMessage: "Medical Counselling"
  },
  healthAideTitle: {
    id: "app.edit-profile.service-section.health-aide-title",
    description: "health aide title",
    defaultMessage: "Health Aide"
  },
  nursing: {
    id: "app.edit-profile.service-section.nursing",
    description: "nursing",
    defaultMessage:
      "Physical assessments, which include monitoring of vital signs, administer oral and intravenous medications as well as monitoring of cardiac and respiratory status"
  },
  physicalTherapy: {
    id: "app.edit-profile.service-section.physical-therapy",
    description: "physical therapy",
    defaultMessage: "Assist patients to condition muscles and regain strength"
  },
  occupationalTherapy: {
    id: "app.edit-profile.service-section.occupational-therapy",
    description: "occupational therapy",
    defaultMessage:
      "Assist patients to perform functional skills such as bathing, eating, cooking, and many other skills"
  },
  speechAndLanguagePathology: {
    id: "app.edit-profile.service-section.speech-and-language-pathology",
    description: "speech and language pathology",
    defaultMessage:
      "Assist patients to regain their ability to speak, swallow, and eat after a stroke or other neurological injuries"
  },
  medicalCounselling: {
    id: "app.edit-profile.service-section.medical-counselling",
    description: "medical counselling",
    defaultMessage:
      "Assistance with medications, provision of counseling, assistance with financial matters, transportation, and in accessing educational and treatment resources"
  },
  healthAide: {
    id: "app.edit-profile.service-section.health-aide",
    description: "health aide",
    defaultMessage:
      "Assist patients with their activities of daily living while patients are limited in mobility and strength which includes tasks such as bathing, grooming, and preparing meals"
  },
  cardiacCareTitle: {
    id: "app.edit-profile.service-section.cardiac-care-title",
    description: "cardiac care title",
    defaultMessage: "Cardiac Care"
  },
  diabetesCareTitle: {
    id: "app.edit-profile.service-section.diabetes-care-title",
    description: "diabetes care title",
    defaultMessage: "Diabetes Care"
  },
  smokingCessationTitle: {
    id: "app.edit-profile.service-section.smoking-cessation-title",
    description: "smoking cessation title",
    defaultMessage: "Smoking Cessation"
  },
  respiteCareTitle: {
    id: "app.edit-profile.service-section.respite-care-title",
    description: "respite care title",
    defaultMessage: "Respite Care"
  },
  homemakingTitle: {
    id: "app.edit-profile.service-section.homemaking-title",
    description: "homemaking title",
    defaultMessage: "Homemaking"
  },
  cardiacCare: {
    id: "app.edit-profile.service-section.cardiac-care",
    description: "Cardiac Care",
    defaultMessage:
      "Assist patients with cardiac disease to manage their disease and to help slow down progression of their disease, monitor the cardiac status, prompt efficient treatment that will prevent re- hospitalization"
  },
  diabetesCare: {
    id: "app.edit-profile.service-section.diabetes-care",
    description: "Diabetes Care",
    defaultMessage:
      "Assist patient with diabetes and their families in learning to manage their diabetes, educate diet, exercise, self- blood glucose monitoring, and about complications of uncontrolled diabetes"
  },
  smokingCessation: {
    id: "app.edit-profile.service-section.smoking-cessation",
    description: "Smoking Cessation",
    defaultMessage: "Provide nicotine replacement therapy"
  },
  respiteCare: {
    id: "app.edit-profile.service-section.respite-care",
    description: "Respite Care",
    defaultMessage:
      "Assist patients with Adult Care, Alzheimer’s Care, Hospital Support"
  },
  homemaking: {
    id: "app.edit-profile.service-section.homemaking",
    description: "Homemaking",
    defaultMessage:
      "Provide patients with daily assistance including meal preparation, housekeeping, laundary & maintaining chores"
  },
  medicalServices: {
    id: "app.myprofile.medical-services",
    description: "medical services",
    defaultMessage: "Medical Services"
  },
  homeHealthCare: {
    id: "app.myprofile.home-health-care",
    description: "home health care",
    defaultMessage: "Home Health Care"
  },
  specialCare: {
    id: "app.myprofile.special-care",
    description: "special care",
    defaultMessage: "Special Care"
  },
  nonMedicalServices: {
    id: "app.myprofile.non-medical-services",
    description: "non medical services",
    defaultMessage: "Non-medical Services"
  },
  notBeBlank: {
    id: "app.contacts-section.not-be-blank",
    description: "not be blank",
    defaultMessage: "not be blank"
  },
  caseDoctor: {
    id: "app.contacts-section.case-doctor",
    description: "case doctor",
    defaultMessage: "Case Doctor"
  },
  notAssigned: {
    id: "app.contacts-section.not-assigned",
    description: "not assigned",
    defaultMessage: "Not assigned"
  },
  careCoach: {
    id: "app.contacts-section.care-coach",
    description: "care coach",
    defaultMessage: "Care coach"
  },
  relativeName: {
    id: "app.contacts-section.relative-name",
    description: "relative name",
    defaultMessage: "Relative Name"
  },
  parent: {
    id: "app.contacts-section.parent",
    description: "parent",
    defaultMessage: "Parent"
  },
  spouse: {
    id: "app.contacts-section.spouse",
    description: "spouse",
    defaultMessage: "Spouse"
  },
  guardian: {
    id: "app.contacts-section.guardian",
    description: "guardian",
    defaultMessage: "Guardian"
  },
  relativeMobile: {
    id: "app.contacts-section.relative-mobile",
    description: "relative mobile",
    defaultMessage: "Relative Mobile"
  },
  contactRelative: {
    id: "app.contacts-section.contact-relative",
    description: "contact relative for emergency",
    defaultMessage: "Contact Relative for Emergency"
  },
  emergencyContactMobile: {
    id: "app.contacts-section.emergency-contact-mobile",
    description: "emergency contact mobile",
    defaultMessage: "Emergency Contact Mobile"
  },
  emergencyContactName: {
    id: "app.contacts-section.emergency-contact-name",
    description: "emergency contact name",
    defaultMessage: "Emergency Contact Name"
  },
  emergencyContactRule: {
    id: "app.contacts-section.emergency-contact-rule",
    description: "emergency contact rule",
    defaultMessage: "Please provide emergency contact"
  },
  phoneNumberRule: {
    id: "app.contacts-section.phone-number-rule",
    description: "phone number rule",
    defaultMessage: "Please provide emergency contact phone number"
  },
  basic: {
    id: "app.medical-section.basic",
    description: "basic",
    defaultMessage: "Basic"
  },
  chiefComplaint: {
    id: "app.medical-section.chief-complaint",
    description: "chief complaint",
    defaultMessage: "Chief Complaint"
  },
  allergies: {
    id: "app.medical-section.allergies",
    description: "allergies",
    defaultMessage: "Allergies"
  },
  useComma: {
    id: "app.medical-section.use-comma",
    description: "use comma tip",
    defaultMessage: "Use , (comma) to add more • Optional"
  },
  surgeriesFracture: {
    id: "app.medical-section.surgeries-fracture",
    description: "surgeries fracture label",
    defaultMessage: "Surgeries/Fracture"
  },
  otherConditions: {
    id: "app.medical-section.other-conditions",
    description: "other conditions label",
    defaultMessage: "Other Conditions"
  },
  vital: {
    id: "app.medical-section.vital",
    description: "vital label",
    defaultMessage: "Vital"
  },
  vitalSubtitle: {
    id: "app.medical-section.vital-subtitle",
    description: "vital subtitle",
    defaultMessage: "Add most recent vital readings"
  },
  bodyTemperature: {
    id: "app.medical-section.body-temperature",
    description: "body temperature",
    defaultMessage: "Body Temperature"
  },
  respirationRate: {
    id: "app.medical-section.respiration-rate",
    description: "respiration rate",
    defaultMessage: "Respiration Rate"
  },
  breathePerMinute: {
    id: "app.medical-section.breathe-per-minute",
    description: "breathe per minute",
    defaultMessage: "breathe per minute"
  },
  pulseRate: {
    id: "app.medical-section.pulse-rate",
    description: "pulse rate",
    defaultMessage: "Pulse Rate"
  },
  bpm: {
    id: "app.medical-section.bpm",
    description: "bpm",
    defaultMessage: "bpm"
  },
  bloodPressure: {
    id: "app.medical-section.blood-pressure",
    description: "blood pressure",
    defaultMessage: "Blood Pressure"
  },
  bpUnit: {
    id: "app.medical-section.bp-unit",
    description: "blood pressure unit",
    defaultMessage: "systolic/diastolic in mmHG"
  },
  clinicalReadings: {
    id: "app.medical-section.clinical-readings",
    description: "clinical readings",
    defaultMessage: "Clinical Readings"
  },
  clinicalReadingsSubtitle: {
    id: "app.medical-section.clinical-readings-subtitle",
    description: "clinical readings subtitle",
    defaultMessage:
      "Choose a diagnosis method & add clinical readings respectively. You can add multiple readings"
  },
  changePassword: {
    id: "app.myprofile.change-password",
    description: "change password",
    defaultMessage: "Chnage password"
  },
  calendarSync: {
    id: "app.myprofile.calendar-sync",
    description: "calendar Sync",
    defaultMessage: "Calendar Sync"
  },
  smsAlertsDetail: {
    id: "app.myprofile.sms-alerts-detail",
    description: "sms alerts description",
    defaultMessage: "SMS will be sent to your registered mobile contact"
  },
  emailAlertsDetail: {
    id: "app.myprofile.email-alerts-detail",
    description: "email alerts description",
    defaultMessage: "Email will be sent to your registered email address"
  },
  pushAlertsDetail: {
    id: "app.myprofile.push-alerts-detail",
    description: "push alerts description",
    defaultMessage: "These alerts are notified within the RPM web app."
  },
  reminderAlerts: {
    id: "app.myprofile.reminder-alerts",
    description: "reminder alerts",
    defaultMessage: "Reminder Alerts"
  },
  reminderAlertsDetail: {
    id: "app.myprofile.reminder-alerts-detail",
    description: "reminder alerts description",
    defaultMessage: "All reminders will be sent via SMS/Email/Calendar"
  },
  goToDashBoard: {
    id: "app.myprofile.go-to-dashboard",
    description: "go to dashboard",
    defaultMessage: "Go to Dashboard"
  },
  save: {
    id: "app.myprofile.save",
    description: "save",
    defaultMessage: "Save"
  },
  editProfile: {
    id: "app.myprofile.edit-profile",
    description: "edit profile",
    defaultMessage: "Edit Profile"
  },
  email: {
    id: "app.myprofile.email",
    description: "email",
    defaultMessage: "Email"
  },
  verified: {
    id: "app.myprofile.verified",
    description: "verified",
    defaultMessage: "Verified"
  },
  notVerified: {
    id: "app.myprofile.not-verified",
    description: "not verified",
    defaultMessage: "Not Verified"
  },
  mobile: {
    id: "app.myprofile.mobile",
    description: "mobile",
    defaultMessage: "Mobile"
  },
  fullName: {
    id: "app.myprofile.full-name",
    description: "full name",
    defaultMessage: "Full name"
  },
  dob: {
    id: "app.myprofile.dob",
    description: "date of birth",
    defaultMessage: "Date of Birth"
  },
  gender: {
    id: "app.myprofile.gender",
    description: "gender",
    defaultMessage: "Gender"
  },
  relativeNo: {
    id: "app.myprofile.relative-no",
    description: "relative mobile no",
    defaultMessage: "Relative Mobile"
  },
  isEmergencyContactSet: {
    id: "app.myprofile.is-emergency-contact-set",
    description: "is emergency contact set",
    defaultMessage: "Contact Relative for Emergency"
  },
  emergencyContactNo: {
    id: "app.myprofile.emergency-contact-no",
    description: "emergency contact no",
    defaultMessage: "Emergency Contact Mobile"
  },
  noAllergies: {
    id: "app.myprofile.no-allergies",
    description: "no allergies text",
    defaultMessage: "You have “No Allergies”"
  },
  noSurgeries: {
    id: "app.myprofile.no-surgeries",
    description: "no surgeries text",
    defaultMessage: "You have “No surgeries/Fractures”"
  },
  noOtherCondition: {
    id: "app.myprofile.no-other-condition",
    description: "no other condition text",
    defaultMessage: "You have mentioned “No Other Conditions”"
  },
  otherCondition: {
    id: "app.myprofile.other-condition",
    description: "other condition",
    defaultMessage: "Other Condition"
  },
  accounts: {
    id: "app.myprofile.accounts",
    description: "accounts",
    defaultMessage: "Accounts"
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
  enterEmail: {
    id: "app.sign-in.enter-email",
    description: "email decorator text",
    defaultMessage: "Please enter your email"
  },
  validEmail: {
    id: "app.sign-in.valid-email",
    description: "valid email decorator text",
    defaultMessage: "Please provide a valid email"
  },
  salutation: {
    id: "app.sign-up.salutation",
    description: "salutation text",
    defaultMessage: "Hey"
  },
  salutationWithoutName: {
    id: "app.sign-up.salutation-without-name",
    description: "salutation text without name",
    defaultMessage: "Hello User"
  },
  clickAway: {
    id: "app.sign-up.click-away",
    description: "just a click away text",
    defaultMessage: "You are just a click away from getting started"
  },
  passwordLengthError: {
    id: "app.sign-up.password-length-error",
    description: "password length less than 6 error text",
    defaultMessage: "Password must be at least 6 characters"
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
    defaultMessage: "Privacy policy"
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
  confirmPasswordError: {
    id: "app.sign-up.confirm-password-error",
    description: "confirm password not filled error text",
    defaultMessage: "Please confirm your Password!"
  },
  currentPassword: {
    id: "app.change-password.current-password",
    description: "current password text",
    defaultMessage: "Current Password"
  },
  currentPasswordRule: {
    id: "app.change-password.current-password-rule",
    description: "current password rule",
    defaultMessage: "Please input current password!"
  },
  newPassword: {
    id: "app.change-password.new-password",
    description: "new password text",
    defaultMessage: "New Password"
  },
  comparePasswordText: {
    id: "app.forgot-password.compare-password-text",
    description: "compare password text",
    defaultMessage: "Two passwords that you enter is inconsistent!"
  },

  heroText: {
    id: "app.landing-page.hero-text",
    description: "hero text of app",
    defaultMessage: "Patient Health Care Journey Made Easy Than Ever Before!"
  },
  heroButton: {
    id: "app.landing-page.hero-button",
    description: "hero button",
    defaultMessage: "LET’S GET STARTED"
  },
  upperViewTitle: {
    id: "app.landing-page.upper-view-title",
    description: "introducing title",
    defaultMessage: "Introducing"
  },
  upperViewSubTitle: {
    id: "app.landing-page.upper-view-sub-title",
    description: "",
    defaultMessage: "Remote Patient Monitoring"
  },
  upperViewDoctor: {
    id: "app.landing-page.upper-view-doctor",
    description: "",
    defaultMessage: "Patients can now consult with Doctors online from anywhere"
  },
  upperViewCareCoach: {
    id: "app.landing-page.upper-view-care-coach",
    description: "",
    defaultMessage: "Patients are taken care by Care Coaches near by them"
  },
  upperViewReport: {
    id: "app.landing-page.upper-view-report",
    description: "",
    defaultMessage: "Doctors can track their patients’ health from anywhere"
  },
  lowerViewTitle: {
    id: "app.landing-page.lower-view-title",
    description: "",
    defaultMessage: "Here’s How It Works"
  },
  lowerViewMedicalCheckUpTitle: {
    id: "app.landing-page.lower-view-report-title",
    description: "introducing title",
    defaultMessage: "Online Doctor Consultation"
  },

  lowerViewMedicalReportTitle: {
    id: "app.landing-page.lower-view-checkup-title",
    description: "introducing title",
    defaultMessage: "Personal Care Assistance"
  },
  lowerViewMedicalCheckUpContent: {
    id: "app.landing-page.lower-view-checkup",
    description: "introducing title",
    defaultMessage:
      "Patients can make an appointment for a Doctor’s consultation from their home convenience, at the scheduled time Patient can join the live interactive video call with Doctor online, to consult and Doctor can also give prescriptions during the session."
  },

  lowerViewMedicalReportContent: {
    id: "app.landing-page.lower-view-report",
    description: "introducing title",
    defaultMessage:
      "Personal Care Coaches are assigned from near the patient’s living place. The Care Coach will make an appointment to administer medicines or to check patients health, vitals & always at reach to assist patients in need."
  },

  selectPhotoTitle: {
    id: "app.edit-profile.personal-section.select-photo-title",
    description: "profile photo selection title",
    defaultMessage: "Select profile photo"
  },
  photoOKText: {
    id: "app.edit-profile.personal-section.photo-ok-text",
    description: "profile photo ok text",
    defaultMessage: "Set as Profile Photo"
  },
  cropImage: {
    id: "app.edit-profile.personal-section.crop-image-text",
    description: "crop image instruction text",
    defaultMessage:
      "To crop this image, drag the region below and then click “Set as Profile Photo” button"
  },
  photoVisibleInfo: {
    id: "app.edit-profile.personal-section.photo-visible-info",
    description: "photo will be visible info text",
    defaultMessage:
      "Your profile photo will be visible to everyone, across IQVIA products."
  },
  nameRule: {
    id: "app.edit-profile.personal-section.name-rule",
    description: "name rule",
    defaultMessage: "please provide your Name"
  },
  dobRule: {
    id: "app.edit-profile.personal-section.dob-rule",
    description: "dob rule",
    defaultMessage: "please provide your Date of Birth"
  },
  genderRule: {
    id: "app.edit-profile.personal-section.gender-rule",
    description: "gender rule",
    defaultMessage: "please provide your gender"
  },
  localityRule: {
    id: "app.edit-profile.personal-section.locality-rule",
    description: "locality rule",
    defaultMessage: "please fill your locality"
  },
  zipcodeRule: {
    id: "app.edit-profile.personal-section.zipcode-rule",
    description: "zipcode rule",
    defaultMessage: "please fill your zip code"
  },
  cityRule: {
    id: "app.edit-profile.personal-section.city-rule",
    description: "city rule",
    defaultMessage: "please provide your city"
  },
  countryRule: {
    id: "app.edit-profile.personal-section.country-rule",
    description: "country rule",
    defaultMessage: "please provide your country"
  },
  sendOTP: {
    id: "app.edit-profile.personal-section.send-otp",
    description: "send otp",
    defaultMessage: "Send OTP"
  },
  dateOfBirth: {
    id: "app.edit-profile.personal-section.date-of-birth",
    description: "date of birth",
    defaultMessage: "Date of Birth"
  },
  male: {
    id: "app.edit-profile.personal-section.male",
    description: "male",
    defaultMessage: "Male"
  },
  female: {
    id: "app.edit-profile.personal-section.female",
    description: "female",
    defaultMessage: "Female"
  },
  city: {
    id: "app.edit-profile.personal-section.city",
    description: "city",
    defaultMessage: "City"
  },
  country: {
    id: "app.edit-profile.personal-section.country",
    description: "country",
    defaultMessage: "Country"
  }
});

export default messages;
