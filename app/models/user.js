const mongoose = require("mongoose");
const collectionName = "users";
const USER_STATUS = {
  ENROLLED: "ENROLLED",
  DISCHARGED: "DISCHARGED",
  INACTIVE: "INACTIVE"
};

const calendar = new mongoose.Schema(
  {
    calendarId: {
      type: String
    },
    calendarAccessToken: {
      type: String
    },
    calendarRefreshToken: {
      type: String
    },
    scope: {
      type: [String]
    },
    accountId: {
      type: String
    },
    providerName: {
      type: String
    },
    profileId: {
      type: String
    },
    profileName: {
      type: String
    }
  },
  { _id: false }
);

const address = new mongoose.Schema(
  {
    addressLine1: {
      type: String
    },
    addressLine2: {
      type: String
    },
    zipCode: {
      type: String
    },
    city: {
      type: mongoose.Schema.Types.ObjectId
    },
    country: {
      type: mongoose.Schema.Types.ObjectId
    }
  },
  { _id: false }
);

const work = new mongoose.Schema(
  {
    organizationName: { type: String },
    speciality: { type: String },
    officeAddress: address,
    licenseNumber: { type: String },
    services: { type: String },
    about: { type: String }
  },
  { _id: false }
);

// const clinicalReadings = new mongoose.Schema(
//   {
//     diagnosisMethod: {
//       type: String
//     },
//     result: {
//       type: Array
//     }
//   },
//   { _id: false }
// );

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String
    },
    profilePicLink: {
      type: String
    },
    homeAddress: address,
    programId: [{ type: mongoose.Schema.Types.ObjectId, ref: "program" }],
    visitingHospitals: [
      { type: mongoose.Schema.Types.ObjectId, ref: "hospital" }
    ],
    category: {
      required: true,
      type: String,
      enum: ["doctor", "patient", "careCoach", "programAdmin", "superAdmin"],
      index: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      match: [
        /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/,
        "Please fill a valid email address"
      ]
      //https://emailregex.com/  General Email Regex (RFC 5322 Official Standard)
    },
    contactNo: {
      _id: false,
      countryCode: { type: String },
      phoneNumber: { type: String, unique: true, sparse: true },
      verified: { type: Boolean, default: false }
    },
    tempContactNo: {
      countryCode: { type: String },
      phoneNumber: { type: String, sparse: true },
      otp: { type: Number }
    },
    calendar: calendar,
    password: {
      type: String
    },
    insurance: {
      provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "InsuranceProvider"
      },
      policy: {
        type: String
      },
      expiresOn: {
        type: Date
      }
    },
    dob: { type: Date },
    gender: { type: String, enum: ["M", "F"] },
    work: work,
    isProfileCompleted: { type: Boolean, default: false },
    isConsentFormUploaded: { type: Boolean, default: false },
    isIdProofUploaded: { type: Boolean, default: false },
    settings: {
      _id: false,
      isCalendarSynced: { type: Boolean, default: false },
      preferences: {
        _id: false,
        smsAlerts: { type: Boolean, default: true },
        emailAlerts: { type: Boolean, default: true },
        pushAlerts: { type: Boolean, default: true },
        reminderAlerts: { type: Boolean, default: true }
      }
    },
    contacts: {
      _id: false,
      relatives: {
        _id: false,
        name: { type: String },
        contactNo: {
          _id: false,
          countryCode: { type: String },
          phoneNumber: { type: String }
        },
        relation: { type: String, enum: ["Parent", "Spouse", "Guardian"] }
      },
      useRelativeAsEmergencyContact: { type: Boolean, default: false },
      emergencyContact: {
        _id: false,
        name: { type: String },
        contactNo: {
          _id: false,
          countryCode: { type: String },
          phoneNumber: { type: String }
        }
      }
    },
    services: {
      _id: false,
      medicalServices: { type: Boolean, default: false },
      homeHealthCare: {
        _id: false,
        nursing: { type: Boolean, default: false },
        physicalTherapy: { type: Boolean, default: false },
        occupationalTherapy: { type: Boolean, default: false },
        speechPathology: { type: Boolean, default: false },
        medicalCounselling: { type: Boolean, default: false },
        healthAide: { type: Boolean, default: false }
      },
      specialCare: {
        _id: false,
        cardiacCare: { type: Boolean, default: false },
        diabetesCare: { type: Boolean, default: false },
        smokingCessation: { type: Boolean, default: false }
      },
      nonMedicalServices: {
        _id: false,
        respiteCare: { type: Boolean, default: false },
        homemaking: { type: Boolean, default: false }
      }
    },
    documents: {
      consentForm: [
        { file: String, uploadedOn: { type: Date, default: Date.now } }
      ],
      idProof: [
        { file: String, uploadedOn: { type: Date, default: Date.now } }
      ],
      consentFormVerified: { type: Boolean, default: false },
      idProofVerified: { type: Boolean, default: false }
    },
    status: {
      type: String,
      enum: [
        USER_STATUS.ENROLLED,
        USER_STATUS.DISCHARGED,
        USER_STATUS.INACTIVE
      ],
      default: USER_STATUS.INACTIVE
    },
    isActive: {
      type: Boolean,
      default: true
    },
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user"
    }
  },
  {
    collection: collectionName,
    timestamps: true
  }
);

module.exports = mongoose.model("user", userSchema);
