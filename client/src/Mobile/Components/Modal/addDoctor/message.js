import { defineMessages } from "react-intl";
const messages = defineMessages({
  myProfile: {
    id: "app.edit-profile-main.my-profile",
    description: "heading",
    defaultMessage: "My Profile"
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
  settings: {
    id: "app.edit-profile.menubar.settings",
    description: "settings menu text",
    defaultMessage: "Settings"
  },
  insurance: {
    id: "app.edit-profile.menubar.insurance",
    description: "insurance menu text",
    defaultMessage: "Insurance"
  },
  insuranceProvider: {
    id: "app.edit-profile.insuranceSection.insuranceProvider",
    description: "insurance provider input label text",
    defaultMessage: "Medical Insurance Provider"
  },
  insurancePolicy: {
    id: "app.edit-profile.insuranceSection.insurancePolicy",
    description: "insurance policy input label text",
    defaultMessage: "Insurance Policy"
  },
  insuranceExpiresOn: {
    id: "app.edit-profile.insuranceSection.insuranceExpiresOn",
    description: "insurance expires input label text",
    defaultMessage: "Valid Till"
  },

  hospital: {
    id: "app.edit-profile.contact-sections.hospital",
    description: "Hospital label text",
    defaultMessage: "Hospital"
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
  bio: {
    id: "app.edit-profile.work-section.bio",
    description: "bio",
    defaultMessage: "Bio"
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
    defaultMessage: "Use , (comma) to add more"
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
  notBeBlank: {
    id: "app.contacts-section.not-be-blank",
    description: "Cannot be blank",
    defaultMessage: "Cannot be blank"
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
    defaultMessage: "Please provide phone number"
  },
  careCoachphoneNumberRule: {
    id: "app.contacts-section.carecoach-phone-number-rule",
    description: "phone number rule",
    defaultMessage: "This field cannot be blank. Please provide phone number"
  },
  changePassword: {
    id: "app.edit-profile.setting-section.chnage-password",
    description: "change password",
    defaultMessage: "Change Password"
  },
  calendarSynced: {
    id: "app.edit-profile.setting-section.calendar-sync",
    description: "calendar synced",
    defaultMessage: "Calendar Sync"
  },
  smsAlerts: {
    id: "app.edit-profile.setting-section.sms-alerts",
    description: "sms alert",
    defaultMessage: "SMS Alerts"
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
  reminderAlerts: {
    id: "app.edit-profile.setting-section.reminder-alerts",
    description: "reminder alert",
    defaultMessage: "Reminder Alerts"
  },
  reminderWillBeSent: {
    id: "app.edit-profile.setting-section.reminder-will-be-sent",
    description: "reminder will be sent",
    defaultMessage: "All reminders will be sent via SMS/Email/Calendar"
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
  verified: {
    id: "app.edit-profile.personal-section.verified",
    description: "verified",
    defaultMessage: "Verified"
  },
  notVerified: {
    id: "app.edit-profile.personal-section.not-verified",
    description: "not verified",
    defaultMessage: "Not verified"
  },
  mobile: {
    id: "app.edit-profile.personal-section.mobile",
    description: "mobile",
    defaultMessage: "Mobile"
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
  fullName: {
    id: "app.edit-profile.personal-section.full-name",
    description: "full name",
    defaultMessage: "Full Name"
  },
  dateOfBirth: {
    id: "app.edit-profile.personal-section.date-of-birth",
    description: "date of birth",
    defaultMessage: "Date of Birth"
  },
  email: {
    id: "app.edit-profile.personal-section.email",
    description: "email",
    defaultMessage: "Email"
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
  },
  consentForm: {
    id: "app.edit-profile.settingSection.consentForm",
    description: "",
    defaultMessage: "Consent Form"
  },
  idProof: {
    id: "app.edit-profile.settingSection.Idproof",
    description: "",
    defaultMessage: "ID Proof"
  },
  uploadedOn: {
    id: "app.edit-profile.settingSection.uploadedOn",
    description: "",
    defaultMessage: "Uploaded on"
  },
  newPatient: {
    id: "app.care-coach.add-patient.newPatient",
    description: "new patient text",
    defaultMessage: "New Patient"
  },
  newDoctor: {
    id: "app.care-coach.add-doctor.newDoctor",
    description: "new doctor text",
    defaultMessage: "New Doctor"
  },
  patientEmail: {
    id: "app.care-coach.add-patient.patientEmail",
    description: "patient email text",
    defaultMessage: "Patient's Email"
  },
  doctorEmail: {
    id: "app.care-coach.add-patient.doctorEmail",
    description: "patient email text",
    defaultMessage: "Doctor's Email"
  },
  incorrectEmail: {
    id: "app.care-coach.add-patient.incorrectEmail",
    description: "That's not a valid E-mail address",
    defaultMessage: "Please enter a valid email address"
  },
  program: {
    id: "app.care-coach.add-patient.program",
    description: "program menu text",
    defaultMessage: "Program"
  },
  programError: {
    id: "app.care-coach.add-patient.programError",
    description: "program error text",
    defaultMessage: "Please enter a Program"
  },
  newPatientSuccess: {
    id: "app.care-coach.add-patient.newPatientSuccess",
    description: "new patient successfully enrolled",
    defaultMessage:
      "New Patient enrolled to the program and invite sent successfully"
  },
  newPatientFailure: {
    id: "app.care-coach.add-patient.newPatientFailure",
    description: "new patient not enrolled",
    defaultMessage: "Unable to enroll new Patient, Please try again."
  },
  newDoctorSuccess: {
    id: "app.care-coach.add-patient.newDoctorSuccess",
    description: "new patient successfully enrolled",
    defaultMessage:
      "New Doctor enrolled to the program and invite sent successfully"
  },
  newDoctorFailure: {
    id: "app.care-coach.add-patient.newDoctorFailure",
    description: "new doctor not enrolled",
    defaultMessage: "Unable to enroll new Doctor, Please try again."
  },
  licenseId: {
    id: "app.care-coach.add-doctor.licenseId",
    description: "license id",
    defaultMessage: "License ID"
  },
  hospitalError: {
    id: "app.care-coach.add-patient.hospitalError",
    description: "hospital error text",
    defaultMessage: "Please enter a Hospital"
  },
  relativeNumberError: {
    id: "app.edit-profile.relativeNumber error",
    description: "relatvie number equal to personal number error",
    defaultMessage: "Relative number and Personal Number cannot be same"
  },
  emergencyNumberError: {
    id: "app.edit-profile.emergencyNumber error",
    description: "emergency number equal to personal number error",
    defaultMessage: "Emergency number and Personal Number cannot be same"
  }
});

export default messages;
