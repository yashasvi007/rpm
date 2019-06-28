const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const moment = require("moment");
const atob = require("atob");

const userService = require("../../services/user/user.service");
const eventService = require("../../services/event/event.service");
const minioService = require("../../services/minio/minio.service");
const programService = require("../../services/program/program.service");
const medicationService = require("../../services/medication/medication.service");
const productService = require("../../services/product/product.service");
const medicalConditionService = require("../../services/medicalCondition/medicalCondition.service");

const Response = require("../../helper/responseFormat");
const { validationResult } = require("express-validator/check");
const Log = require("../../../libs/log")("userController");
const emailManager = require("../../../app/communications/email/emailManger");
const uuid = require("uuid/v4");
const smsManager = require("../../../app/communications/sms/smsManger");
const Notifier = require("../../communications/appNotification/helpers/notify");
const md5 = require("js-md5");
const path = require("path");
const errMessage = require("../../../config/messages.json").errMessages;
const constants = require("../../../config/constants");
const axios = require("axios");
const rbac = require("../../helper/rbac");
const cityCountryService = require("../../services/cityCountry/cityCountry.service");
const medicalService = require("../../services/medicalCondition/medicalCondition.service");
const insuranceService = require("../../services/insurance/insurance.service");
const hospitalService = require("../../services/hospital/hospital.service");
const programKeyValueService = require("../../services/programKeyValue/programKeyValue.service");
const { Proxy_Sdk, EVENTS } = require("../../proxySdk");
import { fieldPicker } from "../../helper/fieldPicker";
import {
  addUserInProgramOnSignUp,
  getUserProgramDetails,
  saveFileIntoUserBucket,
  formatClinicalReading
} from "./userControllerHelper";
import get from "lodash/get";
import set from "lodash/set";
import isEqual from "lodash/isEqual";
import { USER_CATEGORY, USER_STATUS } from "../../../constant";
//user category

const DOCTOR = "doctor";
const CARECOACH = "careCoach";
const PATIENT = "patient";
const PROGRAMADMIN = "programAdmin";
const SUPERADMIN = "superAdmin";

//Basic Info

const BASICS_DETAILS = "basic_details";
const NAME = "name";
const EMAIL = "email";
const DOB = "dob";
const GENDER = "gender";
const CONTACT_COUNTRY_CODE = "contactNo.countryCode";
const CONTACT_NO = "contactNo.phoneNumber";

//HomeAddress
const HOME_ADDRESSLINE1 = "homeAddress.addressLine1";
const HOME_ADDRESSLINE2 = "homeAddress.addressLine2";
const HOME_ZIP_CODE = "homeAddress.zipCode";
const HOME_CITY = "homeAddress.city";
const HOME_COUNTRY = "homeAddress.country";

//Work Info
const WORK_DETAILS = "work_details";
const WORK_ORGANIZATION_NAME = "work.organizationName";
const WORK_SPECIALITY = "work.speciality";
const WORK_SERVICES = "work.services";
const WORK_BIO = "work.about";
const WORK_LICENSE_NUMBER = "work.licenseNumber";

//work address
const WORK_ADDRESSLINE1 = "work.officeAddress.addressLine1";
const WORK_ADRESSLINE2 = "work.officeAddress.addressLine2";
const WORK_ZIP_CODE = "work.officeAddress.zipCode";
const WORK_CITY = "work.officeAddress.city";
const WORK_COUNTRY = "work.officeAddress.country";

//carecoach services

const SERVICE_DETAILS = "service_details";
const MEDICAL_SERVICES = "services.medicalServices";
const NURSING = "services.homeHealthCare.nursing";
const PHYSICAL_THERAPY = "services.homeHealthCare.physicalTherapy";
const OCCUPATIONAL_THERAPY = "services.homeHealthCare.occupationalTherapy";
const SPEECH_PATHOLOGY = "services.homeHealthCare.speechPathology";
const MEDICAL_COUNSELLING = "services.homeHealthCare.medicalCounselling";
const HEALTH_AIDE = "services.homeHealthCare.healthAide";
const CARDIAC_CARE = "services.specialCare.cardiacCare";
const DIABETES_CARE = "services.specialCare.diabetesCare";
const SMOKING_CESSATION = "services.specialCare.smokingCessation";
const RESPITE_CARE = "services.nonMedicalServices.respiteCare";
const HOME_MAKING = "services.nonMedicalServices.homemaking";

//medicalSections
//basic conditions

const MEDICAL_DETAILS = "MEDICAL_DETAILS";
const CHIEF_COMPLAINT = "medicalCondition.basicCondition.chiefComplaint";
const ALLERGIES = "medicalCondition.basicCondition.allergies";
const SURGERIES_OR_FRACTURE =
  "medicalCondition.basicCondition.surgeriesOrFracture";
const OTHERS = "medicalCondition.basicCondition.others";

//vitals
const TEMPERATURE_UNIT = "medicalCondition.vitals.temperatureUnit";
const TEMPERATURE = "medicalCondition.vitals.temperature";
const RESPIRATION_RATE = "medicalCondition.vitals.respirationRate";
const PULSE = "medicalCondition.vitals.pulse";
const BLOOD_PRESSURE = "medicalCondition.vitals.bloodPressure";
const VITALS_UPDATED_AT = "medicalCondition.vitals.updatedAt";

//clinicalReadings
const CLINICAL_READINGS = "medicalCondition.clinicalReadings";

//settings

const SETTING_DETAILS = "settings_details";
const PROFILE_COMPLETED = "settings.isProfileCompleted";
const SYNCED_CALENDAR = "settings.isCalendarSynced";
const SMS_ALERTS = "settings.preferences.smsAlerts";
const EMAIL_ALERTS = "settings.preferences.emailAlerts";
const PUSH_ALERTS = "settings.preferences.pushAlerts";
const REMINDERS_ALERTS = "settings.preferences.reminderAlerts";

//relative contacts
const RELATIVES_CONTACT = "relativesContact";
const RELATIVES_NAME = "contacts.relatives.name";
const RELATIVES_COUNTRY_CODE = "contacts.relatives.contactNo.countryCode";
const RELATIVES_PHONE_NUMBER = "contacts.relatives.contactNo.phoneNumber";
const RELATIVES_RELATION = "contacts.relatives.relation";

//emergency contacts
const CONTACT_RELATIVE_IN_EMERGENCY = "contacts.useRelativeAsEmergencyContact";
const EMERGENCY_CONTACT_NAME = "contacts.emergencyContact.name";
const EMERGENCY_CONTACT_COUNTRY_CODE =
  "contacts.emergencyContact.contactNo.countryCode";
const EMERGENCY_CONTACT_PHONE_NUMBER =
  "contacts.emergencyContact.contactNo.phoneNumber";

const INSURANCE = "insurance";
const INSURANCE_PROVIDER = "insurance.provider";
const INSURANCE_POLICY = "insurance.policy";
const INSURANCE_EXPIRES_ON = "insurance.expiresOn";

const STATUS = "status";

const USER_FIELDS = {
  [DOCTOR]: {
    [BASICS_DETAILS]: [
      NAME,
      HOME_ADDRESSLINE1,
      HOME_ADDRESSLINE2,
      HOME_ZIP_CODE,
      HOME_CITY,
      HOME_COUNTRY
      // CONTACT_NO,
      // CONTACT_COUNTRY_CODE
    ],
    [WORK_DETAILS]: [
      WORK_ORGANIZATION_NAME,
      WORK_BIO,
      WORK_SPECIALITY,
      WORK_LICENSE_NUMBER,
      WORK_ADDRESSLINE1,
      WORK_ADRESSLINE2,
      WORK_ZIP_CODE,
      WORK_CITY,
      WORK_COUNTRY
    ],
    [SETTING_DETAILS]: [
      SYNCED_CALENDAR,
      SMS_ALERTS,
      EMAIL_ALERTS,
      PUSH_ALERTS,
      REMINDERS_ALERTS
    ]
  },
  [CARECOACH]: {
    [BASICS_DETAILS]: [
      NAME,
      HOME_ADDRESSLINE1,
      HOME_ADDRESSLINE2,
      HOME_ZIP_CODE,
      HOME_CITY,
      HOME_COUNTRY
    ],
    [WORK_DETAILS]: [
      WORK_ORGANIZATION_NAME,
      WORK_BIO,
      WORK_SERVICES,
      WORK_SPECIALITY,
      WORK_LICENSE_NUMBER,
      WORK_ADDRESSLINE1,
      WORK_ADRESSLINE2,
      WORK_ZIP_CODE,
      WORK_CITY,
      WORK_COUNTRY
    ],
    [SERVICE_DETAILS]: [
      MEDICAL_SERVICES,
      NURSING,
      PHYSICAL_THERAPY,
      OCCUPATIONAL_THERAPY,
      SPEECH_PATHOLOGY,
      MEDICAL_COUNSELLING,
      HEALTH_AIDE,
      CARDIAC_CARE,
      DIABETES_CARE,
      SMOKING_CESSATION,
      RESPIRATION_RATE,
      HOME_MAKING,
      RESPITE_CARE
    ],
    [SETTING_DETAILS]: [
      SYNCED_CALENDAR,
      SMS_ALERTS,
      EMAIL_ALERTS,
      PUSH_ALERTS,
      REMINDERS_ALERTS
    ]
  },
  [PROGRAMADMIN]: {
    [BASICS_DETAILS]: [
      NAME,
      HOME_ADDRESSLINE1,
      HOME_ADDRESSLINE2,
      HOME_ZIP_CODE,
      HOME_CITY,
      HOME_COUNTRY
    ],
    [WORK_DETAILS]: [
      WORK_ORGANIZATION_NAME,
      WORK_ADDRESSLINE1,
      WORK_ADRESSLINE2,
      WORK_ZIP_CODE,
      WORK_CITY,
      WORK_COUNTRY
    ],
    [SETTING_DETAILS]: [
      SYNCED_CALENDAR,
      SMS_ALERTS,
      EMAIL_ALERTS,
      PUSH_ALERTS,
      REMINDERS_ALERTS
    ]
  },
  [PATIENT]: {
    [BASICS_DETAILS]: [
      NAME,
      GENDER,
      DOB,
      HOME_ADDRESSLINE1,
      HOME_ADDRESSLINE2,
      HOME_ZIP_CODE,
      HOME_CITY,
      HOME_COUNTRY
    ],
    [STATUS]: [STATUS],
    [INSURANCE]: [INSURANCE_PROVIDER, INSURANCE_POLICY, INSURANCE_EXPIRES_ON],
    [MEDICAL_DETAILS]: [
      CHIEF_COMPLAINT,
      ALLERGIES,
      SURGERIES_OR_FRACTURE,
      OTHERS,
      TEMPERATURE_UNIT,
      TEMPERATURE,
      RESPIRATION_RATE,
      PULSE,
      BLOOD_PRESSURE,
      CLINICAL_READINGS,
      VITALS_UPDATED_AT
    ],
    [SETTING_DETAILS]: [
      SYNCED_CALENDAR,
      SMS_ALERTS,
      EMAIL_ALERTS,
      PUSH_ALERTS,
      REMINDERS_ALERTS
    ],
    [RELATIVES_CONTACT]: [
      RELATIVES_NAME,
      RELATIVES_COUNTRY_CODE,
      RELATIVES_PHONE_NUMBER,
      RELATIVES_RELATION
    ]
  }
};

class UserController {
  constructor() {}
  /**
   * @api {POST} /sign-up Sign-up
   * @apiName signUp
   * @apiGroup Users
   * @apiVersion 1.0.0
   *
   *
   * @apiSuccess (200) {json} Status Success status
   *
   * @apiParam {String} password Given password.
   * @apiParam {String} confirmPassword Given confirmPassword.
   * @apiParam {String} link Unique key sent to the user in link.
   *
   * @apiParamExample {json} Request-Example:
   *{
   *  "password": "mypassword",
   *  "confirmPassword": "mypassword",
   *  "link": "feadcde2-56a8-4b2b-87d2-f9ac42a22351"
   *}
   *
   *
   * @apiSuccessExample {json} Success-Response:
   *{
   *  "status": true,
   *  "statusCode": 200,
   *  "payload": {
   *    "data": {},
   *    "message": "Sign up successful!"
   *  }
   *}
   *
   * @apiErrorExample {json} Password-Mismatch-Response:
   * {
   *    "status": false,
   *    "statusCode": 401,
   *    "payload": {
   *        "error": {
   *            "password": {
   *                "location": "body",
   *                "param": "password",
   *                "value": "passwor",
   *                "msg": "Passwords do not match"
   *            }
   *        }
   *    }
   * }
   *
   * @apiErrorExample {json} Invalid-Link-Response:
   * {
   *    "status": false,
   *    "statusCode": 422,
   *    "payload": {
   *        "error": {
   *            "link": {
   *                "location": "body",
   *                "param": "link",
   *                "value": "fb0df9f4-595d-4d96-84cb-c77a72766ea",
   *                "msg": "Invalid value"
   *            }
   *        }
   *    }
   * }
   *
   *
   * @apiErrorExample {json} Server-Error-Response:
   * {
   *    "status": false,
   *    "statusCode": 500,
   *    "payload": {
   *        "error": {
   *           "status": "UNSUCCESSFUL",
   *           "message": "There was some error in signing you up. Please try again."
   *        }
   *    }
   * }
   */

  async signUp(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let response = new Response(false, 422);
      response.setError(
        Object.assign(errors.mapped(), {
          message: "Invalid value"
        })
      );
      return res.status(422).json(response.getResponse());
    }

    try {
      const { password, confirmPassword, link } = req.body;
      // verify signup link
      let response;
      await eventService.updateEvent(
        {
          link: link
        },
        {
          status: "completed"
        }
      ); // mark event as completed

      let event = await eventService.searchByField({
        link: link
      });
      event = event[0];
      const salt = await bcrypt.genSalt(Number(process.config.saltRounds));
      const hash = await bcrypt.hash(password, salt);

      let inviter = await userService.getUser({
        _id: event.participantOne
      });

      let doctor;

      if (
        event.details.userCategory == "patient" &&
        inviter.category == "doctor"
      ) {
        doctor = event.participantOne;
      }

      let data;
      let hospitalId, doctorId;
      const inactiveUserStatus = "INACTIVE";
      const enrolledUserStatus = "ENROLLED";

      if (
        event.details.userCategory == "patient" &&
        inviter.category == "careCoach"
      ) {
        hospitalId = event.details.hospital ? event.details.hospital : "";
        doctorId = event.details.doctor ? event.details.doctor : "";
        data = {
          email: event.details.email,
          password: hash,
          category: event.details.userCategory,
          programId: event.details.programId,
          name: event.details.name ? event.details.name : "",
          dob: event.details.dob ? event.details.dob : "",
          contactNo: event.details.contactNo ? event.details.contactNo : "",
          gender: event.details.gender ? event.details.gender : undefined,
          status: inactiveUserStatus,
          //WILL RUN AFTER ADDING COUNTRY SEEDERS ONLY
          homeAddress: event.details.country
            ? {
                country: event.details.country,
                city: event.details.city ? event.details.city : undefined
              }
            : undefined
        };
      } else if (
        event.details.userCategory == "doctor" &&
        inviter.category == "careCoach"
      ) {
        data = {
          email: event.details.email,
          password: hash,
          category: event.details.userCategory,
          programId: event.details.programId,
          name: event.details.name ? event.details.name : "",
          contactNo: event.details.contactNo ? event.details.contactNo : "",
          status: enrolledUserStatus,
          work: {
            licenseNumber: event.details.licenseNumber
              ? event.details.licenseNumber
              : "",
            speciality: event.details.speciality
              ? event.details.speciality
              : "",
            officeAddress: event.details.country
              ? {
                  country: event.details.country,
                  city: event.details.city ? event.details.city : undefined
                }
              : undefined
          },
          //WILL RUN AFTER ADDING COUNTRY SEEDERS ONLY
          // homeAddress: event.details.country
          //   ? {
          //       country: event.details.country,
          //       city: event.details.city ? event.details.city : undefined
          //     }
          //   : undefined,
          visitingHospitals: event.details.hospital
            ? event.details.hospital
            : undefined
        };
      } else {
        data = {
          email: event.details.email,
          contactNo: event.details.contactNo ? event.details.contactNo : "",
          tempContactNo: event.details.contactNo ? event.details.contactNo : "",
          password: hash,
          category: event.details.userCategory,
          programId: event.details.programId,
          name: event.details.name,
          status: enrolledUserStatus,
          work: {
            organizationName: event.details.organizationName,
            speciality: event.details.speciality,
            licenseNumber: event.details.licenseNumber
          },
          doctor: doctor
          // accessLevel
        };
      }

      // if (
      //   event.details.contactNo == null ||
      //   event.details.contactNo == undefined ||
      //   event.details.contactNo == {}
      // ) {
      //   data = {
      //     email: event.details.email,
      //     password: hash,
      //     category: event.details.userCategory,
      //     programId: event.details.programId,
      //     name: event.details.name,
      //     work: {
      //       organizationName: event.details.organizationName,
      //       speciality: event.details.speciality,
      //       licenseNumber: event.details.licenseNumber
      //     },
      //     doctor: doctor
      //     // accessLevel
      //   };
      // } else {
      //   data = {
      //     email: event.details.email,
      //     contactNo: event.details.contactNo,
      //     tempContactNo: event.details.contactNo,
      //     password: hash,
      //     category: event.details.userCategory,
      //     programId: event.details.programId,
      //     name: event.details.name,
      //     work: {
      //       organizationName: event.details.organizationName,
      //       speciality: event.details.speciality,
      //       licenseNumber: event.details.licenseNumber
      //     },
      //     doctor: doctor
      //     // accessLevel
      //   };
      // }

      const user = await userService.addUser(data);

      const { _id, category } = inviter;
      if (
        event.details.programId != null &&
        event.details.programId != undefined &&
        event.details.programId.length > 0
      ) {
        addUserInProgramOnSignUp({
          inviter: {
            id: _id,
            category: category
          },
          invitee: {
            id: user._id,
            category: user.category
          },
          programId: event.details.programId,
          programService: programService,
          hospitalId: hospitalId,
          doctorId: doctorId
        });
      }

      const expiresIn = process.config.TOKEN_EXPIRE_TIME; // expires in 30 day
      const secret = process.config.TOKEN_SECRET_KEY;
      // create access token
      const accessToken = await jwt.sign(
        {
          userId: user._id
        },
        secret,
        {
          expiresIn
        }
      );

      await eventService.updateEvent(
        {
          link: link
        },
        {
          participantTwo: user._id
        }
      ); // setting invitee values to null and participantTwo as the added user

      const medicalCondition = await medicalConditionService.createUserMedicalData(
        user._id
      );

      const medication = await medicationService.addMedication({
        userId: user._id,
        medicine: {}
      });

      res.cookie("accessToken", accessToken, {
        expires: new Date(
          Date.now() + process.config.INVITE_EXPIRE_TIME * 86400000
        ),
        httpOnly: true
      });
      let notificationToken = Notifier({}).getUserToken(user.id);
      res.cookie("notificationToken", notificationToken, {
        expires: new Date(
          Date.now() + process.config.INVITE_EXPIRE_TIME * 86400000
        )
      });
      res.cookie("feedId", atob(user._id.toString()), {
        expires: new Date(
          Date.now() + process.config.INVITE_EXPIRE_TIME * 86400000
        )
      });

      response = new Response(true, 200);
      response.setData({
        users: {
          [user._id]: {
            basicInfo: {
              _id: user._id,
              name: user.name,
              category: user.category
            },
            isProfileCompleted: user.isProfileCompleted,
            isConsentFormUploaded: user.isConsentFormUploaded,
            isIdProofUploaded: user.isIdProofUploaded,
            settings: {
              isCalendarSynced: user.settings.isCalendarSynced
            }
          }
        },
        _id: user._id
      });
      response.setMessage("Sign up successful!");
      return res.send(response.getResponse());
    } catch (err) {
      if (err.code && err.code == 11000) {
        let response = new Response(false, 400);
        response.setError(errMessage.CONTACT_ALREADY_EXISTS);
        return res.status(400).json(response.getResponse());
      } else {
        let response = new Response(false, 500);
        response.setError(errMessage.INTERNAL_SERVER_ERROR);
        return res.status(500).json(response.getResponse());
      }
    }
  }
  /**
   * @api {POST} /sign-in Sign-in
   * @apiName signIn
   * @apiGroup Users
   * @apiVersion 1.0.0
   *
   * @apiParam {String} email Email of the user which was invited.
   * @apiParam {String} password Password against the given email.
   *
   * @apiSuccess (200) {json} Status Success status
   *
   * @apiParamExample {json} Request-Example:
   * {
   *  "email": "iamsuper@admin.com",
   *  "password": "password"
   * }
   *
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *   "status": true,
   *   "statusCode": 200,
   *   "payload": {
   *      "data": {
   *            isCalendarSynced: true,
   *            isProfileCompleted: false
   *      },
   *      "message": "Sign in successful!"
   *    }
   * }
   *
   * @apiErrorExample {json} Invalid-Email-Response:
   * {
   *     "status": false,
   *     "statusCode": 422,
   *     "payload": {
   *         "error": {
   *             "email": {
   *                 "location": "body",
   *                 "param": "email",
   *                 "value": "iamsupemin.com",
   *                 "msg": "email is not valid"
   *            }
   *        }
   *    }
   * }
   *
   * @apiErrorExample {json} Invalid-Password-Length-Response:
   * {
   *     "status": false,
   *     "statusCode": 422,
   *     "payload": {
   *         "error": {
   *             "password": {
   *                 "location": "body
   *                 "param": "password",
   *                 "value": "pas",
   *                 "msg": "Invalid value"
   *            }
   *        }
   *    }
   * }
   *
   * @apiErrorExample {json} Email-Password-Mismatch-Response:
   * {
   *    "status": false,
   *    "statusCode": 401,
   *    "payload": {
   *        "error": {
   *           "status": "UNAUTHORIZED_ACCESS",
   *           "message": "Either Username or Password is not correct."
   *        }
   *    }
   * }
   *
   * @apiErrorExample {json} Server-Error-Response:
   * {
   *    "status": false,
   *    "statusCode": 500,
   *    "payload": {
   *        "error": {
   *           "status": "INTERNAL_SERVER_ERROR",
   *           "message": "Internal Server Error!"
   *        }
   *    }
   * }
   */

  async signIn(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let response = new Response(false, 422);
      response.setError(
        Object.assign(errors.mapped(), {
          message: "Invalid value"
        })
      );
      return res.status(422).json(response.getResponse());
    }
    try {
      const { email, password } = req.body;
      const user = await userService.getUser({
        email: email.toLowerCase()
      });
      if (!user) {
        throw new Error(constants.CAN_NOT_AUTHORIZE);
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        // create access token
        const expiresIn = process.config.TOKEN_EXPIRE_TIME; // expires in 30 day

        const secret = process.config.TOKEN_SECRET_KEY;
        const accessToken = await jwt.sign(
          {
            userId: user._id
          },
          secret,
          {
            expiresIn
          }
        );
        res.cookie("accessToken", accessToken, {
          expires: new Date(
            Date.now() + process.config.INVITE_EXPIRE_TIME * 86400000
          ),
          httpOnly: true
        });
        let notificationToken = Notifier({}).getUserToken(user.id);
        res.cookie("notificationToken", notificationToken, {
          expires: new Date(
            Date.now() + process.config.INVITE_EXPIRE_TIME * 86400000
          )
        });
        res.cookie("feedId", atob(user._id.toString()), {
          expires: new Date(
            Date.now() + process.config.INVITE_EXPIRE_TIME * 86400000
          )
        });

        let response = new Response(true, 200);
        response.setData({
          users: {
            [user._id]: {
              basicInfo: {
                _id: user._id,
                profilePicLink: user.profilePicLink
                  ? "http://" +
                    path.join(process.config.IMAGE_HOST, user.profilePicLink)
                  : user.profilePicLink,
                name: user.name,
                category: user.category
              },
              status: user.status,
              isProfileCompleted: user.isProfileCompleted,
              isConsentFormUploaded: user.isConsentFormUploaded,
              isIdProofUploaded: user.isIdProofUploaded,
              settings: {
                isCalendarSynced: user.settings.isCalendarSynced
              },
              programId: user.programId
            }
          },
          _id: user._id
        });
        response.setMessage("Sign in successful!");
        return res.send(response.getResponse());
      } else {
        throw new Error(constants.CAN_NOT_AUTHORIZE);
      }
    } catch (err) {
      console.log(err);
      Log.debug("Error while signing in: ", err);
      Log.debug(err);
      let payload;
      switch (err.message) {
        case constants.CAN_NOT_AUTHORIZE:
          payload = {
            code: 401,
            error: errMessage.CAN_NOT_AUTHORIZE
          };
          break;

        default:
          payload = {
            code: 500,
            error: errMessage.INTERNAL_SERVER_ERROR
          };
          break;
      }

      Log.debug(payload.error);

      let response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }

  /**
   * @api {Post} /sign-out Sign-out
   * @apiName signOut
   * @apiGroup Users
   * @apiVersion 1.0.0
   *
   *
   * @apiSuccess (200) {json} Status Success status
   *
   *
   *
   * @apiSuccessExample {json} Success-Response:
   *{
   *  "status": true,
   *  "statusCode": 200,
   *  "payload": {
   *    "data": {},
   *    "message": "Sign out successfully!"
   *  }
   *}
   *
   * @apiErrorExample {json} Server-Error-Response:
   * {
   *    "status": false,
   *    "statusCode": 500,
   *    "payload": {
   *        "error": {
   *           "status": "INTERNAL_SERVER_ERROR",
   *           "message": "Can't sign you out for now."
   *        }
   *    }
   * }
   */
  async signOut(req, res) {
    if (req.cookies.accessToken) {
      res.clearCookie("accessToken");
      res.clearCookie("notificationToken");
      res.clearCookie("feedId");
      let response = new Response(true, 200);
      response.setData({});
      response.setMessage("Signed out successfully!");
      return res.send(response.getResponse());
    } else {
      let response = new Response(false, 500);
      response.setError(errMessage.INTERNAL_SERVER_ERROR);
      return res.status(500).json(response.getResponse());
    }
  }

  /**
   * @api {POST} /accept-invite Accept Invite
   * @apiName acceptInvite
   * @apiGroup Users
   * @apiVersion 1.0.0
   *
   * @apiParam {String} link Unique key sent to the user in link.
   *
   * @apiSuccess (301) {none} Redirection Redirects to Sign-in
   *
   * @apiParamExample {json} Request-Example:
   * {
   *    "link": "feadcde2-56a8-4b2b-87d2-f9ac42a22351"
   * }
   *
   *
   * @apiErrorExample {json} Invalid-Link-Response:
   * {
   *     "status": false,
   *     "statusCode": 422,
   *     "payload": {
   *         "error": {
   *             "link": {
   *                 "location": "body",
   *                  "param": "link",
   *                  "value": "fb0df9f4-595d-4d96-84cb-c77a72766ea",
   *                  "msg": "Invalid value"
   *             }
   *         }
   *     }
   * }
   *
   * @apiErrorExample {json} Contact-Already-Exists-Error-Response:
   * {
   *    "status": false,
   *    "statusCode": 400,
   *    "payload": {
   *        "error": {
   *           "status": "CONTACT_ALREADY_EXISTS",
   *           "message": "Please try another number. As this number already exists in our systems"
   *        }
   *    }
   * }
   *
   * @apiErrorExample {json} Link-Doesn't-Exists-Error-Response:
   * {
   *    "status": false,
   *    "statusCode": 400,
   *    "payload": {
   *        "error": {
   *           "status": "INVALID_LINK",
   *			     "message": "Provided link doens't exists in our system."
   *        }
   *    }
   * }
   *
   * @apiErrorExample {json} Server-Error-Response:
   * {
   *    "status": false,
   *    "statusCode": 500,
   *    "payload": {
   *        "error": {
   *           "status": "INTERNAL_SERVER_ERROR",
   *           "message": "Something went wrong. Please try again."
   *        }
   *    }
   * }
   *
   */
  async acceptInvite(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let response = new Response(false, 422);
      response.setError(
        Object.assign(errors.mapped(), {
          message: "Invalid value"
        })
      );
      return res.status(422).json(response.getResponse());
    }

    try {
      const { link } = req.params;

      Log.debug(link);
      //validating the link
      const url = process.config.APP_URL + "/api/validate";
      let resp;

      try {
        resp = await axios.post(url, {
          link: link
        });
      } catch (err) {
        Log.debug(err);
        throw new Error(err.message);
      }
      if (resp.status != 200) {
        throw new Error(constants.INVALID_LINK.status);
      }

      Log.debug("request made");

      let response; // mark event as completed

      let event = await eventService.searchByField({
        link: link
      });
      event = event[0];

      const user = await userService.addtoArray(
        {
          email: details.invitee.email
        },
        "programId",
        details.invitee.programId
      );

      await eventService.updateEvent(
        {
          link: link
        },
        {
          participantTwo: user._id,
          status: "completed"
        }
      ); // setting invitee values to null and participantTwo as the added user

      return res.redirect("/sign-in");
    } catch (err) {
      if (err.code && err.code == 11000) {
        let response = new Response(false, 400);
        response.setError(errMessage.CONTACT_ALREADY_EXISTS);
        return res.status(400).json(response.getResponse());
      } else if (err.message == errMessage.INVALID_LINK) {
        let response = new Response(false, 400);
        response.setError(errMessage.INVALID_LINK);
        return res.status(400).json(response.getResponse());
      } else {
        let response = new Response(false, 500);
        response.setError(errMessage.INTERNAL_SERVER_ERROR);
        return res.status(500).json(response.getResponse());
      }
    }
  }

  /** Helper method */
  checkIfProfileCompleted(category, data) {
    try {
      if (category == "doctor") {
        if (
          data.name == null ||
          data.homeAddress.country == null ||
          data.homeAddress.city == null ||
          data.work.speciality == null
        ) {
          return false;
        } else return true;
      } else if (category == "programAdmin") {
        if (
          data.name == null ||
          data.homeAddress.country == null ||
          data.homeAddress.city == null
        ) {
          return false;
        } else return true;
      } else if (category == "patient") {
        if (
          data.name == null ||
          data.contactNo == null ||
          data.dob == null ||
          data.gender == null ||
          data.homeAddress.addressLine2 == null ||
          data.homeAddress.zipCode == null ||
          data.homeAddress.country == null ||
          data.contacts.emergencyContact == null ||
          data.homeAddress.city == null
        ) {
          return false;
        } else return true;
      } else if (category == "careCoach") {
        if (
          data.name == null ||
          data.contactNo == null ||
          data.homeAddress.addressLine2 == null ||
          data.homeAddress.zipCode == null ||
          data.homeAddress.country == null ||
          data.homeAddress.city == null
        ) {
          return false;
        } else return true;
      } else return false;
    } catch (err) {
      Log.debug(err);
      return false;
    }
  }

  prepareMedicalData = data => {
    const fields = USER_FIELDS[PATIENT];
    const fieldToPick = fields[MEDICAL_DETAILS];
    return fieldPicker(fieldToPick, data);
  };

  prepareUserData = (category, data) => {
    const isProfileCompleted = this.checkIfProfileCompleted(category, data);
    let objectToAdd = {
      tempContactNo: data.contactNo,
      isProfileCompleted: isProfileCompleted
    };
    switch (category) {
      //check contactNo and countryCode and change accordingly or delete accordingly
      case DOCTOR: {
        const fields = USER_FIELDS[DOCTOR];
        const fieldToPick = [
          ...fields[BASICS_DETAILS],
          ...fields[WORK_DETAILS],
          ...fields[SETTING_DETAILS]
        ];
        objectToAdd = Object.assign(
          objectToAdd,
          fieldPicker(fieldToPick, data)
        );

        break;
      }
      case PATIENT: {
        const fields = USER_FIELDS[PATIENT];
        const fieldToPick = [
          ...fields[BASICS_DETAILS],
          ...fields[RELATIVES_CONTACT],
          ...fields[SETTING_DETAILS],
          ...fields[INSURANCE]
        ];
        //check useRelative as emergency contact set or not // Done
        objectToAdd = Object.assign(
          objectToAdd,
          fieldPicker(fieldToPick, data)
        );

        if (get(data, CONTACT_RELATIVE_IN_EMERGENCY)) {
          set(objectToAdd, CONTACT_RELATIVE_IN_EMERGENCY, true);
          set(objectToAdd, EMERGENCY_CONTACT_NAME, get(data, RELATIVES_NAME));
          set(
            objectToAdd,
            EMERGENCY_CONTACT_COUNTRY_CODE,
            get(data, RELATIVES_COUNTRY_CODE)
          );
          set(
            objectToAdd,
            EMERGENCY_CONTACT_PHONE_NUMBER,
            get(data, RELATIVES_PHONE_NUMBER)
          );
        } else if (get(data, EMERGENCY_CONTACT_NAME)) {
          set(
            objectToAdd,
            EMERGENCY_CONTACT_NAME,
            get(data, EMERGENCY_CONTACT_NAME)
          );
          set(
            objectToAdd,
            EMERGENCY_CONTACT_COUNTRY_CODE,
            get(data, EMERGENCY_CONTACT_COUNTRY_CODE)
          );
          set(
            objectToAdd,
            EMERGENCY_CONTACT_PHONE_NUMBER,
            get(data, EMERGENCY_CONTACT_PHONE_NUMBER)
          );
        }

        break;
      }
      case CARECOACH: {
        const fields = USER_FIELDS[CARECOACH];
        const fieldToPick = [
          ...fields[BASICS_DETAILS],
          ...fields[WORK_DETAILS],
          ...fields[SERVICE_DETAILS],
          ...fields[SETTING_DETAILS]
        ];
        objectToAdd = Object.assign(
          objectToAdd,
          fieldPicker(fieldToPick, data)
        );
        break;
      }
      case PROGRAMADMIN: {
        const fields = USER_FIELDS[PROGRAMADMIN];
        const fieldToPick = [
          ...fields[BASICS_DETAILS],
          ...fields[WORK_DETAILS],
          ...fields[SETTING_DETAILS]
        ];
        objectToAdd = Object.assign(
          objectToAdd,
          fieldPicker(fieldToPick, data)
        );
        break;
      }
      case SUPERADMIN: {
        throw new Error("category not supported");
      }
      default:
        throw new Error("Invalid category");
    }
    return objectToAdd;
  };

  /**
   * @api {POST} /edit-profile Edits Profile
   * @apiName editProfile
   * @apiGroup Users
   * @apiVersion 1.0.0
   *
   * @apiParam {String} name Name of the user.
   * @apiParam {String} dob Date of birth of the user(Only for patient).
   * @apiParam {String} gender Gender of the user(Only for patient).
   *
   * @apiParam {ContactObject} [contactNo] Contact number of the user
   * @apiParam {String} contactNo.countryCode Country code of the user.
   * @apiParam {String} contactNo.phoneNumber Phone number of the user.
   *
   * @apiParam {HomeAddressObject} homeAddress Address of the user.
   * @apiParam {String} [homeAddress.addressLine1] Line 1 of address of the user.
   * @apiParam {String} [homeAddress.addressLine1] Line 2 of address of the user.
   * @apiParam {String} homeAddress.zipCode Zip Code of the user.
   * @apiParam {String} homeAddress.city City of the user.
   * @apiParam {String} homeAddress.country Country of the user.
   *
   * @apiParam {ContactsObject} contacts Contacts of the user(Only for patient).
   * @apiParam {RelativesObject} contacts.relatives Information about the relatives of the user(Only for patient).
   * @apiParam {String} contacts.relatives.name Name of the relative of the user(Only for patient).
   * @apiParam {ContactObject} contacts.relatives.contactNo Contact number of the  user
   * @apiParam {String} contacts.relatives.contactNo.countryCode Country code of the user.
   * @apiParam {String} contacts.relatives.contactNo.phoneNumber Phone number of the user.
   *
   * @apiParam {WorkObject} [work] Work info of the user.
   * @apiParam {String} [work.organizationName] Organization name of the user.
   * @apiParam {String} [work.licenseNumber] License number of the user.
   * @apiParam {String} work.speciality Speciality of the user(Only for doctor).
   * @apiParam {String} [work.about] Work info of the user(Only for doctor).
   * @apiParam {String} [work.services] Services the user can provide(Only for careCoaches).
   *
   * @apiParam {OfficeAddressObject} [work.officeAddress] Office Address of the user.
   * @apiParam {String} [work.officeAddress.addressLine1] Line 1 of office address of the user.
   * @apiParam {String} [work.officeAddress.addressLine1] Line 2 of office address of the user.
   * @apiParam {String} [work.officeAddress.zipCode] Zip code of office of the user.
   * @apiParam {String} [work.officeAddress.city] City of office of the user.
   * @apiParam {String} [work.officeAddress.country] Country of office of the user.
   *
   * @apiParam {SettingsObject} [settings] Settings of the user.
   * @apiParam {PreferencesObject} settings.preferences Preferences of the user.
   * @apiParam {NotificationsObject} settings.preferences.notifications Notifications settings of the user.
   * @apiParam {Boolean} settings.preferences.notifications.smsAlerts Preference of user for sms alerts.
   * @apiParam {Boolean} settings.preferences.notifications.pushAlerts Preference of user for push alerts.
   * @apiParam {Boolean} settings.preferences.notifications.emailAlerts Preference of user for email alerts.
   * @apiParam {Boolean} settings.preferences.notifications.reminderAlerts Preference of user for reminder alerts.
   *
   * @apiParam {MedicalConditionObject} medicalCondition Medical condition of the user(Only for patient).
   * @apiParam {BasicConditionObject} medicalCondition.basicCondition Basic medical condition of the user(Only for patient).
   * @apiParam {String} medicalCondition.basicCondition.chiefComplaint Chief medical complaint of the user(Only for patient).
   * @apiParam {String} medicalCondition.basicCondition.allergies Allergies of the user(Only for patient).
   * @apiParam {String} medicalCondition.basicCondition.surgeriesOrFracture Past surgeries or fractures of the user(Only for patient).
   * @apiParam {String} medicalCondition.basicCondition.others Any other medical detials about the user(Only for patient).
   *
   * @apiParam {VitalsObject} medicalCondition.vitals Vitals of the user(Only for patient).
   * @apiParam {String} medicalCondition.vitals.temperatureUnit Temperature Unit for the temperature of the user(Only for patient).
   * @apiParam {Number} medicalCondition.vitals.temperature Temperature of the user(Only for patient).
   * @apiParam {Number} medicalCondition.vitals.respirationRate Respiration rate of the user(Only for patient).
   * @apiParam {Number} medicalCondition.vitals.pulse Pulse rate of the user(Only for patient).
   * @apiParam {String} medicalCondition.vitals.bloodPressure Blood pressure of the user(Only for patient).
   * @apiParam {ClinicalReadingsObject} clinicalReadings Clinical readings of the user(Only for patient).
   *
   * @apiParam {ServicesObject} services Services provided by the user(Only for careCoach).
   * @apiParam {Boolean} services.medicalServices Does user provide medical services(Only for careCoach).
   *
   * @apiParam {HomeHealthCareObject} services.homeHealthCare Home health care services provided by the user(Only for careCoach).
   * @apiParam {Boolean} services.homeHealthCare.nursing Does user provides nursing services(Only for careCoach).
   * @apiParam {Boolean} services.homeHealthCare.physicalTherapy Does user provides physical therapies(Only for careCoach).
   * @apiParam {Boolean} services.homeHealthCare.occupationalTherapy Does user provides occupational therapies(Only for careCoach).
   * @apiParam {Boolean} services.homeHealthCare.speechPathology Does user provides speech pathology services(Only for careCoach).
   * @apiParam {Boolean} services.homeHealthCare.medicalCounselling Does user provides medical Counselling(Only for careCoach).
   * @apiParam {Boolean} services.homeHealthCare.healthAide Does user provides health aide(Only for careCoach).
   *
   * @apiParam {SpecialCareObject} services.specialCare Special cares provided by the user(Only for careCoach).
   * @apiParam {Boolean} services.specialCare.cardiacCare Does user provides cardiac care(Only for careCoach).
   * @apiParam {Boolean} services.specialCare.diabetesCare Does user provides diabetes care(Only for careCoach).
   * @apiParam {Boolean} services.specialCare.smokingCessation Does user helps in smoking cessation(Only for careCoach).
   *
   * @apiParam {NonMedicalServicesObject} services.nonMedicalServices Non medical services provided by the user(Only for careCoach).
   * @apiParam {String} services.nonMedicalServices.respiteCare Does user provides respite care services(Only for careCoach).
   * @apiParam {String} services.nonMedicalServices.homemaking Does user provides homemaking services.(Only for careCoach).
   *
   *
   * @apiSuccess (200) {json} Status Success status
   *
   *
   * @apiParamExample {json} Request-Example:
   * {
   *	"name": "Stan lee",
   *	"gender": "M",
   *	"dob": "1953-11-19",
   *	"homeAddress": {
   *		"addressLine1": "House 4",
   *		"addressLine2": "Marvel St.",
   *		"zipCode": "52002",
   *		"city": "LA",
   *		"country": "US"
   *	},
   *	"settings": {
   *    	"preferences": {
   *        	"notifications": {
   *        	"smsAlerts": true,
   *        	"emailAlerts": false,
   *        	"pushAlerts": true,
   *        	"reminderAlerts": true
   *        	}
   *    	 }
   *    }
   * }
   *
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *   "status": true,
   *   "statusCode": 200,
   *   "payload": {
   *     "data": {},
   *     "message": "Profile saved."
   *   }
   * }
   *
   * @apiErrorExample {json} Validation-Error-Response
   * {
   *     "status": false,
   *     "statusCode": 422,
   *     "payload": {
   *         "error": {
   *             "name": {
   *                 "location": "body",
   *                 "param": "name",
   *                 "msg": "Invalid value"
   *             },
   *             "homeAddress.country": {
   *                 "location": "body",
   *                 "param": "homeAddress.country",
   *                 "msg": "Invalid value"
   *             }
   *         }
   *     }
   * }
   *
   * @apiErrorExample {json} Contacts-Already-Response:
   * {
   *    "status": false,
   *    "statusCode": 400,
   *    "payload": {
   *        "error": {
   *           "status": "CONTACT_ALREADY_EXISTS",
   *           "message": "Please try another number. As this number already exists in our systems"
   *        }
   *    }
   * }
   *
   * @apiErrorExample {json} No-Cookies-Response:
   * {
   *    "status": false,
   *    "statusCode": 401,
   *    "payload": {
   *        "error": {
   *           "status": "COOKIES_NOT_SET",
   *           "message": "Can't update your profile now, cookies are not set. Please sign in again."
   *        }
   *    }
   * }
   *
   *
   * @apiErrorExample {json} Server-Error-Response:
   * {
   *    "status": false,
   *    "statusCode": 500,
   *    "payload": {
   *        "error": {
   *           "status": "INTERNAL_SERVER_ERROR",
   *           "message": "Something went wrong while saving your profile. Please login and try again."
   *        }
   *    }
   * }
   */

  editProfile = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let response = new Response(false, 422);
      response.setError(
        Object.assign(errors.mapped(), {
          message: "Invalid value"
        })
      );
      return res.status(422).json(response.getResponse());
    }
    try {
      const { body: formData } = req;
      const {
        name,
        userId: id,
        contactNo = {},
        dob,
        gender,
        homeAddress,
        contacts,
        work,
        settings,
        services,
        hospitals
      } = formData;

      // //preparing data to save
      // let dataToSave = this.prepareUserData(category, formData);
      //

      // // copying incoming contact to dataToSave in case if it was empty previously
      // if (!req.userDetails.userData.contactNo.phoneNumber && contactNo) {
      //   dataToSave = Object.assign(dataToSave, {
      //     contactNo: {
      //       countryCode: contactNo.countryCode,
      //       phoneNumber: contactNo.phoneNumber
      //     }
      //   });
      // }
      // // save user data, do transaction here in case of patients
      // await userService.updateUser({ _id: userId }, dataToSave);

      // //save medical details if user is patient
      // if (category === PATIENT) {
      //   //prepare medicals data
      //   const medicalFormData = this.prepareMedicalData(formData);
      //   let medicalData = Object.assign(medicalFormData.medicalCondition, {
      //     userId
      //   });
      //
      //   const {vitals, clinicalReadings} = medicalData;
      //   //check if user already present or not
      //   const isUserNew = await medicalService.isUserNew(userId);

      //   const userMedicalData = await medicalService.getMedicalsDetails({userId: userId})

      //   const clinicalReading = await formatClinicalReading(clinicalReadings, userMedicalData);

      //   medicalData.clinicalReadings = clinicalReading
      //
      //   //adding updated to vitals

      //   let vital = { ...vitals };
      //   const updateAt = moment().format();
      //   vital.updatedAt = updateAt;
      //   medicalData.vitals = vital;

      //   //adding user if not present && if not update
      //   if(isUserNew){
      //     await medicalService.addUser(medicalData);
      //   }
      //   else{
      //     await medicalService.updateUser(medicalData);
      //   }
      //   //save medicalFormData
      // }
      const { userId: currUserId, programId } = req.userDetails;
      const user = await userService.getUser({
        _id: id
      });
      const userDetails = user
        ? {
            userId: id,
            userData: user._doc
          }
        : {};
      const { userId, userData: { category } = {} } = userDetails;

      //preparing data to save
      let dataToSave = this.prepareUserData(category, formData);
      //const visitingHospitalsList= dataToSave.work.organizationName;
      dataToSave.visitingHospitals = hospitals;
      //

      // copying incoming contact to dataToSave in case if it was empty previously//
      //later we have decided that to change mobile no. irrespective of it's verified status.
      const { contactNo: prevContactNo = {} } = userDetails.userData;
      if (
        !isEqual(
          {
            countryCode: prevContactNo.countryCode,
            phoneNumber: prevContactNo.phoneNumber
          },
          {
            countryCode: contactNo.countryCode,
            phoneNumber: contactNo.phoneNumber
          }
        )
      ) {
        dataToSave = Object.assign(dataToSave, {
          contactNo: {
            countryCode: contactNo.countryCode,
            phoneNumber: contactNo.phoneNumber
          }
        });
      }
      const { tempContactNo: { phoneNumber } = {} } = dataToSave;

      if (!phoneNumber || phoneNumber === null || phoneNumber === "") {
        if (category === DOCTOR && dataToSave.contactNo) {
          delete dataToSave.contactNo.phoneNumber;
        } else if (category === PATIENT || category === CARECOACH) {
          throw new Error(constants.NUMBER_CANNOT_BE_BLANK);
        }
      }

      // save user data, do transaction here  in case of patients
      await userService.updateUser(
        {
          _id: userId
        },
        {
          ...dataToSave,
          lastUpdatedBy: currUserId
        }
      );

      //save medical details if user is patient
      if (category === PATIENT) {
        //prepare medicals data
        const medicalFormData = this.prepareMedicalData(formData);
        let medicalData = Object.assign(medicalFormData.medicalCondition, {
          userId
        });

        const { vitals, clinicalReadings } = medicalData;
        //check if user already present or not
        const isUserNew = await medicalService.isUserNew(userId);

        //get all tests in program
        const programKeyValue = await programKeyValueService.getTest(programId);
        let clinicalTest = [];
        if (programKeyValue.length > 0) {
          const { values: { test } = [] } = programKeyValue;
          clinicalTest = test;
        }

        const userMedicalData = await medicalService.getMedicalsDetails({
          userId: userId
        });

        //

        const clinicalReading = clinicalReadings
          ? await formatClinicalReading(clinicalReadings, userMedicalData)
          : {};

        medicalData.clinicalReadings = clinicalReading;
        //adding updated to vitals

        let vital = { ...vitals };
        const updateAt = moment().format();
        vital.updatedAt = updateAt;
        medicalData.vitals = vital;

        // await medicalService.addMedicalCondition(medicalData);
        //adding user if not present && if not update
        if (isUserNew) {
          await medicalService.addUser(medicalData);
        } else {
          await medicalService.updateUser(medicalData);
        }
        //save medicalFormData
      }
      let response = new Response(true, 200);
      response.setData({});
      response.setMessage("Profile saved.");
      return res.send(response.getResponse());
    } catch (err) {
      let response;

      if (err.code && err.code == 11000) {
        response = new Response(false, 400);
        response.setError(errMessage.CONTACT_ALREADY_EXISTS);
        return res.status(400).json(response.getResponse());
      }

      let payload;
      switch (err.message) {
        case constants.COOKIES_NOT_SET:
          payload = {
            code: 401,
            error: errMessage.COOKIES_NOT_SET
          };
          break;

        case constants.NUMBER_CANNOT_BE_BLANK:
          payload = {
            code: 400,
            error: errMessage.NUMBER_CANNOT_BE_BLANK
          };
          break;
        default:
          payload = {
            code: 500,
            error: errMessage.INTERNAL_SERVER_ERROR
          };
          break;
      }

      response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  };

  /**
   * @api {GET} /myprofile Show profile
   * @apiName getProfile
   * @apiGroup Users
   * @apiVersion 1.0.0
   *
   *
   * @apiSuccess (200) {json} Message Success Message
   *
   *
   * @apiSuccessExample {json} Success-Response:
   *
   * {
   *     "status": true,
   *     "statusCode": 200,
   *     "payload": {
   *         "data": {
   *             "users": {
   *                 "5c2bc653a80f9301986428af": {
   *                     "basicInfo": {
   *                         "_id": "5c2bc653a80f9301986428af",
   *                         "name": "Ant Man",
   *                         "category": "doctor"
   *                     },
   *                     "work": {
   *                         "about": null,
   *                         "licenseNumber": null,
   *                         "officeAddress": {
   *                             "addressLine1": null,
   *                             "addressLine2": null,
   *                             "city": "Delhi",
   *                             "country": null,
   *                             "zipCode": 122002
   *                         },
   *                         "organizationName": "hospital",
   *                         "speciality": "ENT"
   *                     },
   *                    "settings": {
   *                         "preferences": {
   *                             "notifications": {
   *                                 "smsAlerts": false,
   *                                 "emailAlerts": true,
   *                                 "pushAlerts": false,
   *                                 "reminderAlerts": true
   *                            }
   *                         },
   *                         "isCalendarSynced": false,
   *                         "isProfileCompleted": true
   *                     },
   *                    "personalInfo": {
   *                         "contactNo": {
   *                             "countryCode": "+91",
   *                             "phoneNumber": "12345678",
   *                             "verified": false
   *                         },
   *                        "homeAddress": {
   *                             "addressLine1": "554/1102",
   *                             "addressLine2": "Suajnpura, Alambagh",
   *                             "city": "Lucknow",
   *                             "country": null,
   *                             "zipCode": 2226005
   *                         },
   *                         "email": "doctor@rpm.com"
   *                      }
   *                 },
   *                 "5c2bc653a80f9301986428b1": {
   *                    "_id": "5c2bc653a80f9301986428b1",
   *                     "profilePicLink": "dbb9/17bdc90b3247b4f1cb5061395efc.png",
   *                     "category": "patient"
   *                 },
   *                 "5c2c8c4e4af90c064a736eda": {
   *                     "_id": "5c2c8c4e4af90c064a736eda",
   *                    "name": "Stan Lee",
   *                     "category": "patient"
   *                 }
   *             },
   *             "programs": {}
   *         },
   *        "message": "User Data"
   *     }
   * }
   *
   * @apiErrorExample {json} No-Cookies-Response:
   * {
   *    "status": false,
   *    "statusCode": 401,
   *    "payload": {
   *        "error": {
   *           "status": "COOKIES_NOT_SET",
   *           "message": "Can't update your profile now, cookies are not set. Please sign in again."
   *        }
   *    }
   * }
   *
   *
   * @apiErrorExample {json} Server-Error-Response:
   * {
   *    "status": false,
   *    "statusCode": 500,
   *    "payload": {
   *        "error": {
   *           "status": "INTERNAL_SERVER_ERROR",
   *           "message": "Something went wrong while saving your profile. Please login and try again."
   *        }
   *    }
   * }
   */
  async getProfile(req, res) {
    let response;
    try {
      if (req.userDetails.exists) {
        response = new Response(true, 200);
        const { _id: userId, programId } = req.userDetails.userData;
        let userData = req.userDetails.userData;

        //getBasicInfo
        //getwork
        //getSettings
        //getMedicalCondition
        //getServices
        //getContacts

        let data;
        const baseDocUrl = `http://${process.config.IMAGE_HOST}`;
        const profilePicLink = userData.profilePicLink
          ? "http://" +
            path.join(process.config.IMAGE_HOST, userData.profilePicLink)
          : userData.profilePicLink;

        let homeCountry;
        let workCountry;
        let homeAddress = {};
        let work = {};

        if (userData.homeAddress) {
          homeAddress = {
            addressLine1: userData.homeAddress.addressLine1,
            addressLine2: userData.homeAddress.addressLine2,
            zipCode: userData.homeAddress.zipCode,
            country: userData.homeAddress.country,
            city: userData.homeAddress.city
          };

          //   if (userData.homeAddress.country) {
          //     homeCountry = await cityCountryService.getCountryById(
          //       userData.homeAddress.country
          //     );
          //     homeAddress["country"] = {
          //       _id: homeCountry._id,
          //       name: homeCountry.name
          //     };
          //   }
        }

        if (userData.work) {
          work = {
            organizationName: userData.work.organizationName,
            speciality: userData.work.speciality,
            licenseNumber: userData.work.licenseNumber,
            services: userData.work.services,
            about: userData.work.about
          };

          if (userData.work.officeAddress) {
            work["officeAddress"] = {
              addressLine1: userData.work.officeAddress.addressLine1,
              addressLine2: userData.work.officeAddress.addressLine2,
              city: userData.work.officeAddress.city,
              country: userData.work.officeAddress.country,
              zipCode: userData.work.officeAddress.zipCode
            };

            // if (userData.work.officeAddress.country) {
            //   workCountry = await cityCountryService.getCountryById(
            //     userData.work.officeAddress.country
            //   );
            //   work["officeAddress"]["country"] = {
            //     _id: workCountry._id,
            //     name: workCountry.name
            //   };
            // }
          }
        }

        let result = await userService.getBulkUsers(userData.patients);

        let patientsList = result.map(patient => {
          return {
            [patient["_id"]]: {
              _id: patient["_id"],
              name: patient["name"],
              profilePicLink: profilePicLink,
              category: patient["category"]
            }
          };
        });

        let programData = {};
        let programs = {};
        if (programId !== null && programId && programId.length > 0) {
          programData = await programService.getBasicInfo(programId[0], [
            "_id",
            "name",
            "pharmaCo",
            "targetLocation",
            "products",
            "expiresOn"
          ]);
          programs = { [programId[0]]: programData };
        }

        if (userData.category === PATIENT) {
          let medicalConditionData = {};

          const medicalCondition = await medicalConditionService.getMedicalsDetails(
            {
              userId: userId
            }
          );
          if (medicalCondition.length > 0) {
            const {
              basicCondition,
              vitals,
              clinicalReadings,
              _id: medicalConditionId
            } = medicalCondition[0];

            const clinicalReading = {};
            if (clinicalReadings) {
              const testTakenByPaitent = Object.keys(clinicalReadings);

              testTakenByPaitent.forEach(test => {
                const testData = clinicalReadings[test];

                clinicalReading[test] = testData[testData.length - 1];
              });
            }
            medicalConditionData._id = medicalConditionId;
            medicalConditionData.basicCondition = basicCondition;
            medicalConditionData.vitals = vitals[vitals.length - 1];
            medicalConditionData.clinicalReadings = clinicalReading;
          }

          let insuranceData = {};
          if (userData.insurance.provider) {
            let providerData = await insuranceService.getInsuranceProviderById(
              userData.insurance.provider
            );
            insuranceData = {
              [userData.insurance.provider]: providerData
            };
          }
          const { category } = userData;
          let userProgramData = {};
          let hospitalData = {};
          if (programId !== null && programId && programId.length > 0) {
            userProgramData = await getUserProgramDetails({
              userId,
              programs: programId[0],
              programService: programService,
              category: category
            });
            if (userProgramData.hospitalId) {
              hospitalData = await hospitalService.getHospitalInfoById(
                userProgramData.hospitalId
              );
            }
          }

          const programKeyValue = await programKeyValueService.getTest(
            programId
          );
          let clinicalTestTemplates = [];
          if (programKeyValue.length > 0) {
            const { values: { test } = {} } = programKeyValue[0];
            clinicalTestTemplates = test;
          }

          data = {
            //pick field and construct data to send according to bussiness logic
            medicalsData: {
              [userId]: medicalCondition.length > 0 ? medicalConditionData : {}
            },
            users: {
              [req.userDetails.userId]: {
                basicInfo: await userService.getBasicInfo(
                  req.userDetails.userId
                ),
                isProfileCompleted: userData.isProfileCompleted,
                isConsentFormUploaded: userData.isConsentFormUploaded,
                isIdProofUploaded: userData.isIdProofUploaded,
                settings: userData.settings,
                personalInfo: {
                  contactNo: {
                    countryCode: userData.contactNo.countryCode,
                    phoneNumber: userData.contactNo.phoneNumber,
                    verified: userData.contactNo.verified
                  },
                  dob: userData.dob,
                  gender: userData.gender,
                  homeAddress: userData.homeAddress,
                  contacts: userData.contacts,
                  email: userData.email
                },
                programIds: [userProgramData],
                documents: userData.documents,
                baseDocUrl: baseDocUrl,
                insurance: userData.insurance
              },
              [userProgramData.doctor || null]: {
                basicInfo: await userService.getBasicInfo(
                  userProgramData.doctor
                )
              },
              [userProgramData.careCoach || null]: {
                basicInfo: await userService.getBasicInfo(
                  userProgramData.careCoach
                )
              }
            },
            programs: programs,
            hospitals: hospitalData,
            insuranceProviders: insuranceData,
            countryCities: await cityCountryService.getCityCountryByIds([
              get(userData, "homeAddress.city", null)
            ]),
            clinicalTestTemplates: { [programId]: clinicalTestTemplates }
          };
        } else if (userData.category == "careCoach") {
          data = {
            users: Object.assign(
              {
                [req.userDetails.userId]: {
                  basicInfo: await userService.getBasicInfo(
                    req.userDetails.userId
                  ),
                  isProfileCompleted: userData.isProfileCompleted,
                  work: await userService.getWork(req.userDetails.userId),
                  settings: userData.settings,
                  services: userData.services,
                  personalInfo: {
                    contactNo: {
                      countryCode: userData.contactNo.countryCode,
                      phoneNumber: userData.contactNo.phoneNumber,
                      verified: userData.contactNo.verified
                    },
                    homeAddress: userData.homeAddress,
                    email: userData.email
                  }
                }
              },
              ...patientsList
            ),
            programs: programs,
            countryCities: await cityCountryService.getCityCountryByIds([
              get(userData, "homeAddress.city", null),
              get(userData, "work.officeAddress.city", null)
            ])
          };
        } else if (userData.category == "doctor") {
          data = {
            users: Object.assign(
              {
                [req.userDetails.userId]: {
                  basicInfo: await userService.getBasicInfo(
                    req.userDetails.userId
                  ),
                  isProfileCompleted: userData.isProfileCompleted,
                  work: await userService.getWork(req.userDetails.userId),
                  settings: userData.settings,
                  visitingHospitals: await userService.getVisitingHospitals(
                    req.userDetails.userId
                  ),
                  personalInfo: {
                    contactNo: {
                      countryCode: userData.contactNo.countryCode,
                      phoneNumber: userData.contactNo.phoneNumber,
                      verified: userData.contactNo.verified
                    },
                    homeAddress: userData.homeAddress,
                    email: userData.email
                  }
                }
              },
              ...patientsList
            ),
            programs: programs,
            countryCities: await cityCountryService.getCityCountryByIds([
              get(userData, "homeAddress.city", null),
              get(userData, "work.officeAddress.city", null)
            ])
          };
        } else {
          data = {
            users: Object.assign(
              {
                [req.userDetails.userId]: {
                  basicInfo: await userService.getBasicInfo(
                    req.userDetails.userId
                  ),
                  work: await userService.getWork(req.userDetails.userId),
                  isProfileCompleted: userData.isProfileCompleted,
                  settings: userData.settings,
                  personalInfo: {
                    contactNo: {
                      countryCode: userData.contactNo.countryCode,
                      phoneNumber: userData.contactNo.phoneNumber,
                      verified: userData.contactNo.verified
                    },
                    homeAddress: userData.homeAddress,
                    email: userData.email
                  }
                }
              },
              ...patientsList
            ),
            programs: programs,
            countryCities: await cityCountryService.getCityCountryByIds([
              get(userData, "homeAddress.city", null),
              get(userData, "work.officeAddress.city", null)
            ])
          };
        }
        response.setData(data);
        response.setMessage("User Data");
        return res.send(response.getResponse());
      } else {
        throw new Error(constants.COOKIES_NOT_SET);
      }
    } catch (err) {
      let payload;
      switch (err.message) {
        case constants.COOKIES_NOT_SET:
          payload = {
            code: 401,
            error: errMessage.COOKIES_NOT_SET
          };
          break;

        default:
          payload = {
            code: 500,
            error: errMessage.INTERNAL_SERVER_ERROR
          };
          break;
      }

      let response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }

  /**
   * @api {POST} /forgot-password Sends verification mail
   * @apiName forgotPassword
   * @apiGroup Users
   * @apiVersion 1.0.0
   *
   *
   * @apiSuccess (200) {json} Status Success status
   *
   * @apiParam {String} email Email of the user.
   *
   * @apiParamExample {json} Request-Example:
   * {
   *    "email": "nikhil.prabhakar@tripock.com"
   * }
   *
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *   "status": true,
   *   "statusCode": 200,
   *   "payload": {
   *     "data": {},
   *     "message": "Mail has been sent."
   *   }
   * }
   *
   * @apiErrorExample {json} Validation-Error-Response
   * {
   *     "status": false,
   *     "statusCode": 422,
   *     "payload": {
   *         "error": {
   *             "email": {
   *                 "location": "body",
   *                 "param": "email",
   *                 "value": "nikhiltripock.com"
   *                 "msg": "Invalid value"
   *             }
   *         }
   *     }
   * }
   *
   * @apiErrorExample {json} Server-Error-Response:
   * {
   *    "status": false,
   *    "statusCode": 500,
   *    "payload": {
   *        "error": {
   *           "status": "INTERNAL_SERVER_ERROR",
   *           "message": "Something went wrong. Please try again."
   *        }
   *    }
   * }
   *
   */
  async forgotPassword(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let response = new Response(false, 422);
      response.setError(
        Object.assign(errors.mapped(), {
          message: "Invalid value"
        })
      );
      return res.status(422).json(response.getResponse());
    }
    try {
      const { email } = req.body;
      let user = await userService.getUser({
        email: email
      });
      Log.debug(user);
      if (user) {
        let link = uuid();
        let templateData = new Object();
        templateData.email = user.email;
        templateData.link = link;
        templateData.host = process.config.APP_URL;
        let emailPayload = {
          toAddress: email,
          title: "Forgot Password Request",
          templateData: templateData,
          templateName: "forgotPassword"
        };
        let emailResponse = await Proxy_Sdk.execute(
          EVENTS.SEND_EMAIL,
          emailPayload
        );
        Log.debug(emailResponse);
        const eventData = {
          participantOne: user._id,
          eventCategory: "forgotPassword",
          details: {
            email
          },
          link,
          endTime: new Date(
            Date.now() + process.config.FORGOT_PASSWORD_EXPIRE_TIME * 86400000
          )
        };
        let event = await eventService.addEvent(eventData);
        Log.debug(event);
        let response = new Response(true, 200);
        response.setData({});
        response.setMessage("Mail has been sent.");
        return res.send(response.getResponse());
      } else {
        let response = new Response(true, 200);
        response.setData({});
        response.setMessage("Mail has been sent.");
        return res.send(response.getResponse());
      }
    } catch (err) {
      Log.debug(err);
      let response = new Response(false, 500);
      response.setError(errMessage.INTERNAL_SERVER_ERROR);
      return res.status(500).json(response.getResponse());
    }
  }

  /**
   * @api {POST} /change-forgotten-password Changes password after email verification
   * @apiName changeForgottenPassword
   * @apiGroup Users
   * @apiVersion 1.0.0
   *
   *
   * @apiSuccess (200) {json} Status Success status
   *
   * @apiParam {String} password Password given by the user.
   * @apiParam {String} confirmPassword ConfirmPassword given by the user.
   * @apiParam {String} link Unique key sent to the user in link.
   *
   * @apiParamExample {json} Request-Example:
   * {
   *    "password": "password",
   *    "confirmPassword": "password",
   *    "link": "2d0f78f7-9818-4ce2-9903-8c4aeb97b4c3"
   * }
   *
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *   "status": true,
   *   "statusCode": 200,
   *   "payload": {
   *     "data": {},
   *     "message": "Password Updated."
   *   }
   * }
   *
   *
   * @apiErrorExample {json} Password-Mismatch-Response:
   * {
   *    "status": false,
   *    "statusCode": 401,
   *    "payload": {
   *        "error": {
   *           "status": "PASSWORD_MISMATCH",
   *           "message": "Password and Confirm password do not match."
   *        }
   *    }
   * }
   *
   *
   * @apiErrorExample {json} Server-Error-Response:
   * {
   *    "status": false,
   *    "statusCode": 500,
   *    "payload": {
   *        "error": {
   *           "status": "INTERNAL_SERVER_ERROR",
   *           "message": "Something went wrong. Please try again."
   *        }
   *    }
   * }
   *
   */
  async changeForgottenPassword(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let response = new Response(false, 422);
      response.setError(
        Object.assign(errors.mapped(), {
          message: "Invalid value"
        })
      );
      return res.status(422).json(response.getResponse());
    }
    try {
      const { password, confirmPassword, link } = req.body;
      let event = await eventService.searchByField({
        link: link
      });
      Log.debug(event);
      event = event[0];
      let response;
      // let user = await userService.getUser({ _id: event.participantOne });
      if (password === confirmPassword) {
        const salt = await bcrypt.genSalt(Number(process.config.saltRounds));
        const hash = await bcrypt.hash(password, salt);
        await userService.updateUser(
          {
            _id: event.participantOne
          },
          {
            password: hash
          }
        );
        await eventService.updateEvent(
          {
            link: link
          },
          {
            status: "completed"
          }
        );
        await eventService.updateEvent(
          {
            link: link
          },
          {
            link: null
          }
        );
        response = new Response(true, 200);
        response.setData({});
        response.setMessage("Password updated.");
        return res.send(response.getResponse());
      } else {
        throw new Error(constants.PASSWORD_MISMATCH_ERROR);
      }
    } catch (err) {
      let payload;
      switch (err.message) {
        case constants.PASSWORD_MISMATCH_ERROR:
          payload = {
            code: 401,
            error: errMessage.PASSWORD_MISMATCH_ERROR
          };
          break;

        default:
          payload = {
            code: 500,
            error: errMessage.INTERNAL_SERVER_ERROR
          };
          break;
      }

      let response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }

  /**
   * @api {POST} /send-otp Sends an otp to the user
   * @apiName sendOTP
   * @apiGroup Users
   * @apiVersion 1.0.0
   *
   *
   * @apiSuccess (200) {json} Status Success status
   *
   * @apiParam {ContactObject} contactNo Contact details of the user
   * @apiParam {String} contactNo.countryCode Country Code of the user
   * @apiParam {Number} contactNo.phoneNumber Phone number of the user
   *
   * @apiParamExample {json} Request-Example:
   * {
   *    "contactNo": {
   *        "countryCode": "+91",
   *        "phoneNumber": 9988776655
   *    }
   * }
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *   "status": true,
   *   "statusCode": 200,
   *   "payload": {
   *     "data": {},
   *     "message": "OTP sent."
   *   }
   * }
   *
   *
   * @apiErrorExample {json} Cookies-Not-Set-Error-Response:
   * {
   *    "status": false,
   *    "statusCode": 401,
   *    "payload": {
   *        "error": {
   *           "status": "COOKIES_NOT_SET",
   *           "message": "Can't send OTP now, cookies are not set. Please sign in again."
   *        }
   *    }
   * }
   *
   * @apiErrorExample {json} Contact-Already-Exists-Response:
   * {
   *    "status": false,
   *    "statusCode": 401,
   *    "payload": {
   *        "error": {
   *           "status": "CONTACT_ALREADY_EXISTS",
   *           "message": "This number already exists. Please try again with another number."
   *        }
   *    }
   * }
   *
   * @apiErrorExample {json} Server-Error-Response:
   * {
   *    "status": false,
   *    "statusCode": 500,
   *    "payload": {
   *        "error": {
   *           "status": "INTERNAL_SERVER_ERROR",
   *           "message": "Something went wrong. Please try again."
   *        }
   *    }
   * }
   *
   */

  async sendOTP(req, res) {
    let response;
    try {
      const { contactNo, id } = req.body;
      const user = await userService.getUser({
        _id: id
      });
      const userDetails = user
        ? {
            userId: id,
            userData: user._doc
          }
        : {};
      const { userData } = userDetails;
      let contactNoExist = await userService.getUser({
        "contactNo.phoneNumber": contactNo.phoneNumber
      });

      if (contactNoExist && contactNoExist._id != userDetails.userId) {
        throw new Error(constants.CONTACT_ALREADY_EXISTS);
      }

      let otp = (low, high) => {
        return Math.floor(Math.random() * (high - low) + low);
      };
      otp = otp(1000, 9000);
      let smsPayload = {
        phonenumber: contactNo.countryCode + contactNo.phoneNumber,
        sender: "rpm",
        message: `Hi, ${otp} is your otp .`
      };
      Log.debug(otp);
      let smsResponse = await Proxy_Sdk.execute(EVENTS.SEND_SMS, smsPayload);
      Log.debug(smsResponse);
      await userService.updateUser(
        {
          _id: userDetails.userId
        },
        {
          tempContactNo: {
            // saving in temp contact
            countryCode: contactNo.countryCode,
            phoneNumber: contactNo.phoneNumber,
            otp: otp
          }
        }
      );
      response = new Response(true, 200);
      response.setData({});
      response.setMessage("OTP sent.");
      return res.send(response.getResponse());
    } catch (err) {
      Log.debug(err);

      let payload;
      switch (err.message) {
        case constants.COOKIES_NOT_SET:
          payload = {
            code: 401,
            error: errMessage.COOKIES_NOT_SET
          };
          break;

        case constants.CONTACT_ALREADY_EXISTS:
          payload = {
            code: 401,
            error: errMessage.CONTACT_ALREADY_EXISTS
          };
          break;

        default:
          payload = {
            code: 500,
            error: errMessage.INTERNAL_SERVER_ERROR
          };
          break;
      }

      let response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }

  /**
   * @api {POST} /verify-otp Verifies the otp
   * @apiName verifyOTP
   * @apiGroup Users
   * @apiVersion 1.0.0
   *
   *
   * @apiSuccess (200) {json} Status Success status
   *
   * @apiParam {Number} otp OTP sent to the user's number.
   *
   * @apiParamExample {json} Request-Example:
   * {
   *    "otp": 1457
   * }
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *   "status": true,
   *   "statusCode": 200,
   *   "payload": {
   *     "data": {},
   *     "message": "Phone verified."
   *   }
   * }
   *
   *
   * @apiErrorExample {json} Cookies-Not-Set-Error-Response:
   * {
   *    "status": false,
   *    "statusCode": 403,
   *    "payload": {
   *        "error": {
   *           "status": "COOKIES_NOT_SET",
   *           "message": "Cant' verify the otp. Cookies are not set."
   *        }
   *    }
   * }
   *
   * @apiErrorExample {json} OTP-mismatch-Error-Response:
   * {
   *    "status": false,
   *    "statusCode": 400,
   *    "payload": {
   *        "error": {
   *           "status": "OTP_MISMATCH",
   *           "message": "Given otp is wrong."
   *        }
   *    }
   * }
   *
   *
   * @apiErrorExample {json} Server-Error-Response:
   * {
   *    "status": false,
   *    "statusCode": 500,
   *    "payload": {
   *        "error": {
   *           "status": "INTERNAL_SERVER_ERROR",
   *           "message": "Something went wrong. Please try again."
   *        }
   *    }
   * }
   *
   */

  async verifyOTP(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      let response = new Response(false, 422);
      response.setError(
        Object.assign(errors.mapped(), {
          message: "Invalid value"
        })
      );
      return res.status(422).json(response.getResponse());
    }

    let response;
    try {
      const {
        body: { id, otp },
        userDetails: { userId: currUserId }
      } = req;
      const user = await userService.getUser({
        _id: id
      });
      const userDetails = user
        ? {
            userId: id,
            userData: user._doc
          }
        : {};
      const { userData } = userDetails;

      if (userData.tempContactNo.otp != otp) {
        throw new Error(constants.OTP_MISMATCH);
      }
      await userService.updateUser(
        {
          _id: id
        },
        {
          contactNo: {
            countryCode: userData.tempContactNo.countryCode,
            phoneNumber: userData.tempContactNo.phoneNumber,
            verified: true
          },
          tempContactNo: null,
          lastUpdatedBy: currUserId
        }
      );
      response = new Response(true, 200);
      response.setData({});
      response.setMessage("Phone verified.");
      return res.send(response.getResponse());
    } catch (err) {
      Log.debug(err);
      let payload;

      switch (err.message) {
        case constants.OTP_MISMATCH:
          payload = {
            code: 400,
            error: errMessage.OTP_MISMATCH
          };
          break;

        case constants.COOKIES_NOT_SET:
          payload = {
            code: 403,
            error: errMessage.COOKIES_NOT_SET
          };
          break;

        default:
          payload = {
            code: 500,
            error: errMessage.INTERNAL_SERVER_ERROR
          };
          break;
      }

      let response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }

  /**
   * @api {POST} /upload-profile-pic Uploads profile pic
   * @apiName uploadProfilePic
   * @apiGroup Users
   * @apiVersion 1.0.0
   *
   *
   * @apiSuccess (200) {json} Status Link of the uploaded image
   *
   * @apiParam {FormData} profile-pic Multipart form data(Image).
   *
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *   "status": true,
   *   "statusCode": 200,
   *   "payload": {
   *     "data": {
   *         "pic_url": "http://localhost:9001/rpm/2431/4387534059879842"
   *      },
   *     "message": "Profile picture saved"
   *   }
   * }
   *
   *
   * @apiErrorExample {json} Cookies-Not-Set-Error-Response:
   * {
   *    "status": false,
   *    "statusCode": 401,
   *    "payload": {
   *        "error": {
   *           "status": "COOKIES_NOT_SET",
   *           "message": "Cant' verify the otp. Cookies are not set."
   *        }
   *    }
   * }
   *
   * @apiErrorExample {json} Minio-Error-Response:
   * {
   *    "status": false,
   *    "statusCode": 500,
   *    "payload": {
   *        "error": {
   *           "status": "IMAGE_NOT_SAVED",
   *           "message": "There was some problem in saving your picture. Please try again."
   *        }
   *    }
   * }
   *
   *
   * @apiErrorExample {json} Server-Error-Response:
   * {
   *    "status": false,
   *    "statusCode": 500,
   *    "payload": {
   *        "error": {
   *           "status": "INTERNAL_SERVER_ERROR",
   *           "message": "Something went wrong. Please try again."
   *        }
   *    }
   * }
   *
   */
  async uploadProfilePic(req, res) {
    let response;
    try {
      // checking for bucket
      const {
        query: { id },
        userDetails: { userId: currUserId }
      } = req;

      const user = await userService.getUser({
        _id: id
      });
      const userDetails = user
        ? {
            userId: id,
            userData: user._doc
          }
        : {};
      await minioService.createBucket();

      if (userDetails.userData.profilePicLink) {
        await minioService.removeObject(userDetails.userData.profilePicLink);
        Log.debug(userDetails.userData.profilePicLink + " removed");
      }

      let hash = md5.create();
      hash.update(userDetails.userId + uuid());
      hash.hex();
      hash = String(hash);
      const folder = hash.substring(0, 4);
      const profilePicBuffer = req.file.buffer;
      const pic_file_name = hash.substring(4) + ".png";
      const picUrl = folder + "/" + pic_file_name;
      try {
        await minioService.saveBufferObject(profilePicBuffer, picUrl);
      } catch (err) {
        throw new Error(constants.IMAGE_NOT_SAVED);
      }

      await userService.updateUser(
        {
          _id: userDetails.userId
        },
        {
          profilePicLink: picUrl,
          lastUpdatedBy: currUserId
        }
      );

      response = new Response(true, 200);
      response.setData({
        pic_url: "http://" + path.join(process.config.IMAGE_HOST, picUrl)
      });
      response.setMessage("Profile picture saved");
      return res.send(response.getResponse());
    } catch (err) {
      Log.debug(err);

      let payload;

      switch (err.message) {
        case constants.IMAGE_NOT_SAVED:
          payload = {
            code: 500,
            error: errMessage.IMAGE_NOT_SAVED
          };
          break;

        case constants.COOKIES_NOT_SET:
          payload = {
            code: 403,
            error: errMessage.COOKIES_NOT_SET
          };
          break;

        default:
          payload = {
            code: 500,
            error: errMessage.INTERNAL_SERVER_ERROR
          };
          break;
      }

      let response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }

  /**
   * @api {POST} /change-password Changes password
   * @apiName changePassword
   * @apiGroup Users
   * @apiVersion 1.0.0
   *
   *
   * @apiSuccess (200) {json} Status Success status
   *
   * @apiParam {String} currentPassword User's current password.
   * @apiParam {String} newPassword Password given by the user.
   * @apiParam {String} confirmPassword ConfirmPassword given by the user.
   *
   * @apiParamExample {json} Request-Example:
   * {
   *    "currentPassword": "password",
   *    "newPassword": "qwerty",
   *    "confirmPassword": "qwerty"
   * }
   *
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *   "status": true,
   *   "statusCode": 200,
   *   "payload": {
   *     "data": {},
   *     "message": "Password Updated."
   *   }
   * }
   *
   *
   * @apiErrorExample {json} Password-Mismatch-Response:
   * {
   *    "status": false,
   *    "statusCode": 401,
   *    "payload": {
   *        "error": {
   *            "newPassword": {
   *                "location": "body",
   *                "param": "newPassword",
   *                "value": "qwertya",
   *                "msg": "Passwords do not match"
   *            }
   *        }
   *    }
   * }
   *
   * @apiErrorExample {json} Unauthorized-Access-Response(Incorrect Current Password):
   * {
   *    "status": false,
   *    "statusCode": 500,
   *    "payload": {
   *        "error": {
   *           "status": "UNAUTHORIZED_ACCESS",
   *           "message": "Wrong current password. Please try again with correct password."
   *        }
   *    }
   * }
   *
   * @apiErrorExample {json} Server-Error-Response:
   * {
   *    "status": false,
   *    "statusCode": 500,
   *    "payload": {
   *        "error": {
   *           "status": "INTERNAL_SERVER_ERROR",
   *           "message": "Something went wrong. Please try again."
   *        }
   *    }
   * }
   *
   */
  async changePassword(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let response = new Response(false, 422);
      response.setError(
        Object.assign(errors.mapped(), {
          message: "Invalid value"
        })
      );
      return res.status(422).json(response.getResponse());
    }
    try {
      if (req.userDetails.exists) {
        const { currentPassword, newPassword, confirmPassword } = req.body;
        const passwordMatch = await bcrypt.compare(
          currentPassword,
          req.userDetails.userData.password
        );
        if (passwordMatch) {
          const salt = await bcrypt.genSalt(Number(process.config.saltRounds));
          const hash = await bcrypt.hash(newPassword, salt);
          let user = await userService.updateUser(
            {
              _id: req.userDetails.userId
            },
            {
              password: hash
            }
          );
          Log.debug(user);
          let response = new Response(true, 200);
          response.setData({});
          response.setMessage("Password successfully changed");
          return res.send(response.getResponse());
        } else {
          throw new Error(constants.INCORRECT_PASSWORD);
        }
      } else {
        throw new Error(constants.INCORRECT_PASSWORD);
      }
    } catch (err) {
      let payload;

      switch (err.message) {
        case constants.INCORRECT_PASSWORD:
          payload = {
            code: 401,
            error: errMessage.INCORRECT_PASSWORD
          };
          break;

        default:
          payload = {
            code: 500,
            error: errMessage.INTERNAL_SERVER_ERROR
          };
          break;
      }

      let response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }

  /**
   * @api {GET} /get-basic-info Gets basic info
   * @apiName onAppStart
   * @apiGroup Users
   * @apiVersion 1.0.0
   *
   *
   * @apiSuccess (200) {json} BasicInfo Basic info about the user
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *   "status": true,
   *   "statusCode": 200,
   *   "payload": {
   *      "data": {
   *          "basicInfo": {
   *             "_id": "5c2bc653a80f9301986428af",
   *             "name": "Nikhil Prabhakar",
   *             "category": "doctor",
   *             "homeAddress": {
   *                 "addressLine1": "H no 1",
   *                 "addressLine2": "Area 1",
   *                 "city": "Lucknow",
   *                 "country": null,
   *                 "zipCode": 226001
   *                 }
   *            }
   *        },
   *        "message": "Basic info"
   *     }
   * }
   *
   *
   * @apiErrorExample {json} Password-Mismatch-Response:
   * {
   *    "status": false,
   *    "statusCode": 401,
   *    "payload": {
   *        "error": {
   *            "newPassword": {
   *                "location": "body",
   *                "param": "newPassword",
   *                "value": "qwertya",
   *                "msg": "Passwords do not match"
   *            }
   *        }
   *    }
   * }
   *
   * @apiErrorExample {json} Unauthorized-Access-Response(Incorrect Current Password):
   * {
   *    "status": false,
   *    "statusCode": 500,
   *    "payload": {
   *        "error": {
   *           "status": "UNAUTHORIZED_ACCESS",
   *           "message": "Wrong current password. Please try again with correct password."
   *        }
   *    }
   * }
   *
   * @apiErrorExample {json} Server-Error-Response:
   * {
   *    "status": false,
   *    "statusCode": 500,
   *    "payload": {
   *        "error": {
   *           "status": "INTERNAL_SERVER_ERROR",
   *           "message": "Something went wrong. Please try again."
   *        }
   *    }
   * }
   *
   */

  async onAppStart(req, res, next) {
    let response;
    try {
      if (req.userDetails.exists) {
        const { userId, userData } = req.userDetails;
        const {
          isConsentFormUploaded,
          isIdProofUploaded,
          isProfileCompleted,
          settings,
          programId
        } = userData;
        let basicInfo = await userService.getBasicInfo(req.userDetails.userId, [
          "_id",
          "profilePicLink",
          "name",
          "category"
        ]);

        response = new Response(true, 200);
        response.setData({
          _id: userId,
          users: {
            [userId]: {
              basicInfo,
              isProfileCompleted,
              isConsentFormUploaded,
              isIdProofUploaded,
              settings,
              programId
            }
          }
        });
        response.setMessage("Basic info");
        return res.send(response.getResponse());
      } else {
        throw new Error(constants.COOKIES_NOT_SET);
      }
    } catch (err) {
      Log.debug(err);
      let payload;

      switch (err.message) {
        case constants.COOKIES_NOT_SET:
          payload = {
            code: 401,
            error: errMessage.COOKIES_NOT_SET
          };
          break;

        default:
          payload = {
            code: 500,
            error: errMessage.INTERNAL_SERVER_ERROR
          };
          break;
      }

      response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }

  // Program admin specific APIs

  /**
   * @api {POST} /assign-to-carecoach Assign Patients to CareCoaches
   * @apiName assignPatientsToCareCoach
   * @apiGroup Users
   * @apiVersion 1.0.0
   *
   *
   * @apiSuccess (200) {json} Status Success status
   *
   * @apiParam {ObjectId[]} patients Object Ids of patients.
   * @apiParam {ObjectId} careCoach Object Id of careCoach.
   *
   * @apiParamExample {json} Request-Example:
   * {
   *    "careCoach": "5c0f5c68ed4800085154f122"
   *    "patients": ["5c0f5c68ed4800085174f343", "5c0f5c68ed4800085174f344"]
   * }
   *
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *   "status": true,
   *   "statusCode": 200,
   *   "payload": {
   *     "data": {},
   *     "message": "Patients assigned to the care coach."
   *   }
   * }
   *
   * @apiErrorExample {json} Cookies-not-set-Response:
   * {
   *    "status": false,
   *    "statusCode": 401,
   *    "payload": {
   *        "error": {
   *           "status": "COOKIES_NOT_SET",
   *           "message": "Can't process your request, cookies are not set. Please sign in again."
   *        }
   *    }
   * }
   *
   * @apiErrorExample {json} Server-Error-Response:
   * {
   *    "status": false,
   *    "statusCode": 500,
   *    "payload": {
   *        "error": {
   *           "status": "INTERNAL_SERVER_ERROR",
   *           "message": "Something went wrong. Please sign in and try again."
   *        }
   *    }
   * }
   *
   */
  async assignPatientsToCareCoach(req, res) {
    try {
      const { patients, careCoach } = req.body;
      if (req.userDetails.exists) {
        const can = await rbac.can(
          // checking access through rbac
          req.userDetails.userData.category,
          "assign",
          "patients"
        );
        if (!can) {
          throw new Error(constants.INVITE_NOT_PERMISSIBLE);
        }

        let user = await userService.updateUser(
          {
            _id: careCoach
          },
          {
            patients
          }
        ); // buggy
        Log.debug(user);
        let response = new Response(true, 200);
        response.setData({});
        response.setMessage("Patients assigned to the care coach.");
        return res.send(response.getResponse());
      } else {
        throw new Error(constants.COOKIES_NOT_SET);
      }
    } catch (err) {
      let payload;
      switch (err.message) {
        case constants.COOKIES_NOT_SET:
          payload = {
            code: 401,
            error: errMessage.COOKIES_NOT_SET
          };
          break;

        default:
          payload = {
            code: 500,
            error: errMessage.INTERNAL_SERVER_ERROR
          };
          break;
      }

      let response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }

  /**
   * @api {POST} /assign-to-patient Assign CareCoach to Patients
   * @apiName assignCareCoachToPatient
   * @apiGroup Users
   * @apiVersion 1.0.0
   *
   *
   * @apiSuccess (200) {json} Status Success status
   *
   * @apiParam {ObjectId} patient Object Id of patients.
   * @apiParam {ObjectId} careCoach Object Id of careCoach.
   *
   * @apiParamExample {json} Request-Example:
   * {
   *    "careCoach": "5c0f5c68ed4800085154f122"
   *    "patient": "5c0f5c68ed4800085174f343"
   * }
   *
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *   "status": true,
   *   "statusCode": 200,
   *   "payload": {
   *     "data": {},
   *     "message": "Care Coach assigned to the patient."
   *   }
   * }
   *
   *
   * @apiErrorExample {json} Cookies-not-set-Response:
   * {
   *    "status": false,
   *    "statusCode": 401,
   *    "payload": {
   *        "error": {
   *           "status": "COOKIES_NOT_SET",
   *           "message": "Can't process your request, cookies are not set. Please sign in again."
   *        }
   *    }
   * }
   *
   *
   * @apiErrorExample {json} Server-Error-Response:
   * {
   *    "status": false,
   *    "statusCode": 500,
   *    "payload": {
   *        "error": {
   *           "status": "INTERNAL_SERVER_ERROR",
   *           "message": "Something went wrong. Please sign in and try again."
   *        }
   *    }
   * }
   *
   */
  async assignCareCoachToPatient(req, res) {
    try {
      const { patient, careCoach } = req.body;
      if (req.userDetails.exists) {
        const can = await rbac.can(
          // checking access through rbac
          req.userDetails.userData.category,
          "assign",
          "careCoachs"
        );
        if (!can) {
          throw new Error(constants.INVITE_NOT_PERMISSIBLE);
        }

        let user = await userService.updateUser(
          {
            _id: patient
          },
          {
            careCoach
          }
        );
        Log.debug(user);
        let response = new Response(true, 200);
        response.setData({});
        response.setMessage("Care Coach assigned to the patient.");
        return res.send(response.getResponse());
      } else {
        throw new Error(constants.COOKIES_NOT_SET);
      }
    } catch (err) {
      let payload;
      switch (err.message) {
        case constants.COOKIES_NOT_SET:
          payload = {
            code: 401,
            error: errMessage.COOKIES_NOT_SET
          };
          break;

        default:
          payload = {
            code: 500,
            error: errMessage.INTERNAL_SERVER_ERROR
          };
          break;
      }

      let response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }

  addNewUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let response = new Response(false, 422);
      response.setError(errors.mapped());
      return res.status(422).json(response.getResponse());
    }
    try {
      const {
        email,
        category,
        password,
        name,
        contactNo,
        dob,
        gender,
        homeAddress,
        contacts,
        work,
        settings,
        services
      } = req.body;
      if (req.userDetails.exists) {
        const can = await rbac.can(
          // checking access through rbac
          req.userDetails.userData.category,
          "addNew",
          category + "s"
        );
        if (!can) {
          throw new Error(constants.INVITE_NOT_PERMISSIBLE);
        }

        const salt = await bcrypt.genSalt(Number(process.config.saltRounds));
        const hash = await bcrypt.hash(
          password ? password : process.config.DEFAULT_PASSWORD,
          salt
        );
        let dataToSave = this.prepareUserData(category, req.body);

        if (contactNo) {
          dataToSave = Object.assign(dataToSave, {
            contactNo: {
              countryCode: contactNo.countryCode,
              phoneNumber: contactNo.phoneNumber
            }
          });
        }

        dataToSave = Object.assign(dataToSave, {
          email,
          category,
          password: hash
        });

        let user = await userService.addUser(dataToSave);

        if (category === PATIENT) {
          //prepare medicals data
          const medicalFormData = this.prepareMedicalData(req.body);
          let medicalData = Object.assign(medicalFormData.medicalCondition, {
            userId: user._id
          });
          //save medicalFormData
          await medicalService.addMedicalCondition(medicalData);
        }
        let response = new Response(true, 200);
        response.setData({
          email,
          category
        });
        response.setMessage(`${category} added`);
        return res.send(response.getResponse());
      } else {
        throw new Error(constants.COOKIES_NOT_SET);
      }
    } catch (err) {
      let payload;
      switch (err.message) {
        case constants.COOKIES_NOT_SET:
          payload = {
            code: 401,
            error: errMessage.COOKIES_NOT_SET
          };
          break;

        default:
          payload = {
            code: 500,
            error: errMessage.INTERNAL_SERVER_ERROR
          };
          break;
      }

      let response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  };

  async saveConsentForm(req, res) {
    let response;
    try {
      if (req.userDetails.exists) {
        const files = await saveFileIntoUserBucket({
          service: minioService,
          file: req.file,
          userId: req.userDetails.userId
        });
        let userId = req.userDetails.userId;
        const result = await userService.addConsentForm(userId, files);
        response = new Response(true, 200);
        response.setData({
          files: files
        });
        response.setMessage("Consent form uploaded successfully!");
        return res.send(response.getResponse());
      }
    } catch (err) {
      throw new Error("error in saving document");
    }
  }

  async saveIdProof(req, res) {
    let response;
    try {
      if (req.userDetails.exists) {
        const files = await saveFileIntoUserBucket({
          service: minioService,
          file: req.file,
          userId: req.userDetails.userId
        });
        let userId = req.userDetails.userId;
        const result = await userService.addIdProof(userId, files);
        response = new Response(true, 200);
        response.setData({
          files: files
        });
        response.setMessage("Id Proof uploaded successfully!");
        return res.send(response.getResponse());
      }
    } catch (err) {
      throw new Error("error in saving document");
    }
  }

  getRelatedMembers = async (req, res) => {
    let response;
    try {
      const {
        userDetails: { userData: { category, programId = [] } = {} } = {}
      } = req;

      let data = {};
      if (programId.length > 0) {
        data = { programIds: programId };

        if (category === USER_CATEGORY.DOCTOR) {
          data = {
            ...data,
            category: [USER_CATEGORY.CARE_COACH, USER_CATEGORY.PATIENT]
          };
        }

        const relatedMembers = await userService.getRelatedMembers(data);
        const members = relatedMembers.map(value => {
          const { basicInfo, personalInfo, status } = value;
          return {
            basicInfo,
            personalInfo,
            status
          };
        });

        response = new Response(true, 200);
        response.setData({
          members: members
        });
        return res.send(response.getResponse());
      } else {
        response = new Response(true, 200);
        return res.send(response.getResponse());
      }
    } catch (err) {
      throw new Error("error getting members ", err);
    }
  };

  getUserById = async (req, res) => {
    try {
      let response;
      let users = {};
      let data = {};
      let countryCities = {};
      let programIds = [];
      const { params: { id } = {} } = req;
      if (id) {
        const userData = await userService.getUserById(id);
        if (userData) {
          const {
            basicInfo,
            work = {},
            personalInfo,
            settings,
            insurance,
            status,
            programId,
            documents,
            services,
            visitingHospitals,
            isConsentFormUploaded,
            isIdProofUploaded,
            isProfileCompleted
          } = userData;

          let citiesId = new Set([
            get(personalInfo, "homeAddress.city", null),
            get(work, "officeAddress.city", null)
          ]);

          const { category, _id } = basicInfo;
          if (category === DOCTOR) {
            users[_id] = {
              basicInfo,
              work,
              personalInfo,
              settings,
              documents,
              visitingHospitals,
              isProfileCompleted
            };
            countryCities = await cityCountryService.getCityCountryByIds([
              ...citiesId
            ]);
            data = {
              users: users,
              countryCities: countryCities
            };
          }

          if (category === PATIENT) {
            let insuranceData;
            let medicalConditionData = {};
            const { provider } = insurance;
            if (provider) {
              const insuranceProviderDetail = await insuranceService.getInsuranceProviderById(
                provider
              );
              insuranceData = {
                [provider]: insuranceProviderDetail
              };
            }

            const medicalCondition = await medicalConditionService.getMedicalsDetails(
              {
                userId: id
              }
            );
            if (medicalCondition.length > 0) {
              const {
                basicCondition,
                vitals,
                clinicalReadings,
                _id: medicalConditionId
              } = medicalCondition[0];

              const clinicalReading = {};
              if (clinicalReadings) {
                const testTakenByPaitent = Object.keys(clinicalReadings);

                testTakenByPaitent.forEach(test => {
                  const testData = clinicalReadings[test];

                  clinicalReading[test] = testData[testData.length - 1];
                });
              }
              medicalConditionData._id = medicalConditionId;
              medicalConditionData.basicCondition = basicCondition;
              medicalConditionData.vitals = vitals[vitals.length - 1];
              medicalConditionData.clinicalReadings = clinicalReading;
            }

            const programKeyValue = await programKeyValueService.getTest(
              programId
            );
            let clinicalTestTemplates = [];
            if (programKeyValue.length > 0) {
              const { values: { test } = {} } = programKeyValue[0];
              clinicalTestTemplates = test;
            }

            const medications = await medicationService.getMedications({
              userId: id
            });
            let medication = {};
            if (medications.length > 0) {
              const { medicine, userId: patientId } = medications[0];
              const latestMedicine = medicine[medicine.length - 1];
              medication.userId = patientId;
              medication.medicine = latestMedicine;
              //
            }
            const productId = await programService.getProgramProducts(
              programId
            );
            let products_data = [];
            if (productId !== null && productId && productId.length > 0) {
              products_data = await productService.getProductById(
                productId[0].products
              );
            }
            let products = {};
            if (products_data.length > 0) {
              products_data.map(product => {
                const { _id } = product;
                products[_id] = product;
              });
            }

            //

            let programs = {};
            let hospitals = {};
            if (programId !== null && programId && programId.length > 0) {
              const programData = await programService.getBasicInfo(
                programId[0],
                [
                  "_id",
                  "name",
                  "pharmaCo",
                  "targetLocation",
                  "products",
                  "expiresOn"
                ]
              );
              programs = {
                [programId[0]]: programData
              };
              const userProgramData = await getUserProgramDetails({
                userId: id,
                programs: programId[0],
                programService: programService,
                category: category
              });

              const {
                doctor: doctorId,
                careCoach: careCoachId,
                hospitalId
              } = userProgramData;

              programIds.push({
                id: programId[0],
                doctor: doctorId,
                careCoach: careCoachId,
                hospitalId: hospitalId
              });

              if (doctorId) {
                const doctorData = await userService.getUserById(doctorId);
                users[doctorId] = {
                  basicInfo: doctorData.basicInfo,
                  personalInfo: doctorData.personalInfo,
                  work: doctorData.work
                };
                citiesId.add(
                  get(doctorData.personalInfo, "homeAddress.city", null)
                );
                citiesId.add(get(doctorData.work, "officeAddress.city", null));
              }

              if (careCoachId) {
                const careCoachData = await userService.getUserById(
                  careCoachId
                );
                users[careCoachId] = {
                  basicInfo: careCoachData.basicInfo,
                  personalInfo: careCoachData.personalInfo
                };
                citiesId.add(
                  get(careCoachData.personalInfo, "homeAddress.city", null)
                );
                citiesId.add(
                  get(careCoachData.work, "officeAddress.city", null)
                );
              }

              if (hospitalId) {
                hospitals = await hospitalService.getHospitalInfoById(
                  userProgramData.hospitalId
                );
              }
            }

            users[_id] = {
              basicInfo,
              personalInfo,
              settings,
              insurance,
              documents,
              isProfileCompleted,
              isConsentFormUploaded,
              isIdProofUploaded,
              programIds,
              status
            };
            countryCities = await cityCountryService.getCityCountryByIds([
              ...citiesId
            ]);

            data = {
              users: users,
              programs: programs,
              hospitals: hospitals,
              countryCities: countryCities,
              insuranceProviders: insuranceData,
              medicalsData: { [id]: medicalConditionData },
              medication: { [id]: medication },
              clinicalTestTemplates: { [programId]: clinicalTestTemplates },
              products: products
            };
          }
        }
      }
      response = new Response(true, 200);
      response.setData({
        ...data
      });
      return res.send(response.getResponse());
    } catch (err) {
      throw new Error("error getting user by id ", err);
    }
  };

  async getUserProgram(req, res) {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      let response = new Response(false, 422);
      response.setError(error.mapped());
      return res.status(422).json(response.getResponse());
    }
    try {
      let response = new Response(true, 200);
      if (req.userDetails.exists) {
        let userId = req.userDetails.userId;
        let userData = await userService.getUser({
          _id: userId
        });
        if (!_.isEmpty(userData) && !_.isEmpty(userData.programId)) {
          let programData = await programService.getPrograms({
            _id: {
              $in: userData.programId
            }
          });

          if (!_.isEmpty(programData)) {
            response.setData({
              programs: programData
            });
            response.setMessage("programs found!!");
          } else {
            response.setData({});
            response.setMessage("no programs found!!");
          }
        } else {
          response.setData({});
          response.setMessage("no programs found!!");
        }
      } else {
        response.setData({});
        response.setMessage("no programs found!!");
      }
      return res.send(response.getResponse());
    } catch (err) {
      let payload;
      switch (err.message) {
        case constants.COOKIES_NOT_SET:
          payload = {
            code: 403,
            error: errMessage.COOKIES_NOT_SET
          };
          break;
        case constants.ADDITION_TO_PROGRAM_NOT_PERMISSIBLE:
          payload = {
            code: 401,
            error: errMessage.ADDITION_TO_PROGRAM_NOT_PERMISSIBLE
          };
          break;
        default:
          payload = {
            code: 500,
            error: errMessage.INTERNAL_SERVER_ERROR
          };
          break;
      }
      let response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }

  async dischargePatient(req, res) {
    try {
      const { ids } = req.body;
      const { userId: currUserId } = req.userDetails;
      const result = await userService.updateStatus(
        {
          ids: ids,
          category: PATIENT
        },
        {
          status: USER_STATUS.DISCHARGED,
          lastUpdatedBy: currUserId,
          isActive: false
        }
      );
      const response = new Response(true, 200);
      response.setMessage("patient succesfully discharged");
      return res.send(response.getResponse());
    } catch (err) {}
  }

  async getClinicalData(req, res) {
    const dummyData = {
      ABI_TEST: [
        {
          update_at: "koi date",
          data: {
            arm: {
              left: "44",
              right: "425"
            },
            leftAnkle: {
              pt: "245",
              dt: "452"
            },
            rightAnkle: {
              pt: "254",
              dt: "35"
            },
            abiIndex: {
              overAllAbiIndex: "45"
            }
          }
        },
        {
          update_at: "aur koi date",
          data: {
            arm: {
              left: "44",
              right: "425"
            },
            leftAnkle: {
              pt: "245",
              dt: "452"
            },
            rightAnkle: {
              pt: "254",
              dt: "35"
            },
            abiIndex: {
              overAllAbiIndex: "45"
            }
          }
        },
        {
          update_at: "ek aur date",
          data: {
            arm: {
              left: "44",
              right: "425"
            },
            leftAnkle: {
              pt: "245",
              dt: "452"
            },
            rightAnkle: {
              pt: "254",
              dt: "35"
            },
            abiIndex: {
              overAllAbiIndex: "45"
            }
          }
        },
        {
          update_at: "frse date",
          data: {
            arm: {
              left: "44",
              right: "425"
            },
            leftAnkle: {
              pt: "245",
              dt: "452"
            },
            rightAnkle: {
              pt: "254",
              dt: "35"
            },
            abiIndex: {
              overAllAbiIndex: "45"
            }
          }
        }
      ],
      ANOTHER_TEST: [
        {
          update_at: "some date",
          data: {
            arm: {
              left: "44",
              right: "425"
            },
            leftAnkle: {
              pt: "245",
              dt: "452"
            },
            rightAnkle: {
              pt: "254",
              dt: "35"
            },
            abiIndex: {
              overAllAbiIndex: "45"
            }
          }
        },
        {
          update_at: "some another date",
          data: {
            arm: {
              left: "44",
              right: "425"
            },
            leftAnkle: {
              pt: "245",
              dt: "452"
            },
            rightAnkle: {
              pt: "254",
              dt: "35"
            },
            abiIndex: {
              overAllAbiIndex: "45"
            }
          }
        },
        {
          update_at: "one more date",
          data: {
            arm: {
              left: "44",
              right: "425"
            },
            leftAnkle: {
              pt: "245",
              dt: "452"
            },
            rightAnkle: {
              pt: "254",
              dt: "35"
            },
            abiIndex: {
              overAllAbiIndex: "45"
            }
          }
        },
        {
          update_at: "date once again",
          data: {
            arm: {
              left: "44",
              right: "425"
            },
            leftAnkle: {
              pt: "245",
              dt: "452"
            },
            rightAnkle: {
              pt: "254",
              dt: "35"
            },
            abiIndex: {
              overAllAbiIndex: "45"
            }
          }
        }
      ]
    };

    const error = validationResult(req);
    if (!error.isEmpty()) {
      const response = new Response(false, 422);
      response.setError(error.mapped());
      return res.status(422).json(response.getResponse());
    }
    try {
      let response = new Response(true, 200);
      const { id } = req.params;
      if (id) {
        let medicalData = await medicalService.getMedicalsDetails({
          userId: id
        });

        const userData = await userService.getUser({ _id: id });
        let programId = "";
        if (userData) {
          programId = userData.programId[0];
        } else {
          throw new Error("USER_NOT_FOUND");
        }

        const programKeyValue = await programKeyValueService.getTest(programId);
        let clinicalTestTemplates = [];
        if (programKeyValue.length > 0) {
          const { values: { test } = {} } = programKeyValue[0];
          clinicalTestTemplates = test;
        }
        medicalData = medicalData[0];
        if (!_.isEmpty(medicalData)) {
          response.setData({
            clinicalReadings: { ...medicalData.clinicalReadings },
            clinicalTestTemplates
          });

          response.setMessage("Clinical Readings");
        } else {
          response.setData({});
          response.setMessage("No Clinical Readings");
        }
      } else {
        throw new Error(constants.COOKIES_NOT_SET);
      }
      return res.send(response.getResponse());
    } catch (err) {
      let payload;
      switch (err.message) {
        case constants.COOKIES_NOT_SET:
          payload = {
            code: 403,
            error: errMessage.COOKIES_NOT_SET
          };
          break;
        case "USER_NOT_FOUND":
          payload = {
            code: 401,
            error: "This user doesn't exist"
          };
          break;
        default:
          payload = {
            code: 500,
            error: errMessage.INTERNAL_SERVER_ERROR
          };
          break;
      }
      const response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }

  async uploadDoc(req, res) {
    let response;
    try {
      const files = await saveFileIntoUserBucket({
        service: minioService,
        file: req.file,
        userId: req.userDetails.userId
      });

      response = new Response(true, 200);
      response.setData({
        files: files
      });
      response.setMessage("Id Proof uploaded successfully!");
      return res.send(response.getResponse());
    } catch (err) {
      throw new Error("error in saving document");
    }
  }

  async verifyDocuments(req, res) {
    try {
      const { id: userId } = req.params;
      let { verifyConsentForm, verifyIdProof } = req.body;
      if (userId) {
        const userDetails = await userService.getUserById(userId);
        const currentConsentFormStatus =
          userDetails.documents.consentFormVerified;
        const currentIdProofStatus = userDetails.documents.idProofVerified;
        if (userDetails) {
          //Query to update status
          //db.users.updateMany({},{$set : {"documents.verified":"false"}})
          let data = { consentFormVerified: false, idProofVerified: false };
          if (verifyConsentForm && verifyIdProof) {
            const result = await userService.updateUser(
              { _id: userId },
              {
                "documents.consentFormVerified": true,
                "documents.idProofVerified": true,
                status: USER_STATUS.ENROLLED
              }
            );
            data = { consentFormVerified: true, idProofVerified: true };
          } else if (verifyConsentForm) {
            const result = await userService.updateUser(
              { _id: userId },
              {
                "documents.consentFormVerified": true,
                status: currentIdProofStatus
                  ? USER_STATUS.ENROLLED
                  : USER_STATUS.INACTIVE
              }
            );
            data = {
              consentFormVerified: true,
              idProofVerified: currentIdProofStatus
            };
          } else if (verifyIdProof) {
            const result = await userService.updateUser(
              { _id: userId },
              {
                "documents.idProofVerified": true,
                status: currentConsentFormStatus
                  ? USER_STATUS.ENROLLED
                  : USER_STATUS.INACTIVE
              }
            );
            data = {
              consentFormVerified: currentConsentFormStatus,
              idProofVerified: true
            };
          }

          const response = new Response(true, 200);
          response.setData(data);
          response.setMessage("User Documents Succesfully Verified");
          return res.send(response.getResponse());
        } else {
          throw new Error("User is not a patient");
        }
      }
    } catch (err) {}
  }

  async reUploadIdProofs(req, res) {
    try {
      const { id: userId } = req.params;
      let { docs } = req.body;
      if (userId) {
        let query = [];
        for (const key in docs) {
          const doc = docs[key];
          query.push({ file: doc });
        }
        const result = await userService.updateUser(
          { _id: userId },
          {
            "documents.idProofVerified": false,
            isIdProofUploaded: true,
            status: USER_STATUS.INACTIVE,
            "documents.idProof": query
          }
        );
        const updatedUserDetails = await userService.getUserById(userId);
        const response = new Response(true, 200);
        response.setData({
          documents: updatedUserDetails.documents,
          isIdProofUploaded: true
        });
        response.setMessage("User IdProofs ReUploaded Succesfully");
        return res.send(response.getResponse());
      } else {
        throw new Error("User is not a patient");
      }
    } catch (err) {}
  }

  async reUploadConsentDocs(req, res) {
    try {
      const { id: userId } = req.params;
      let { docs } = req.body;
      if (userId) {
        let query = [];
        for (const key in docs) {
          const doc = docs[key];
          query.push({ file: doc });
        }
        const result = await userService.updateUser(
          { _id: userId },
          {
            "documents.consentFormVerified": false,
            isConsentFormUploaded: true,
            status: USER_STATUS.INACTIVE,
            "documents.consentForm": query
          }
        );
        const updatedUserDetails = await userService.getUserById(userId);

        const response = new Response(true, 200);
        response.setData({
          documents: updatedUserDetails.documents,
          isConsentFormUploaded: true
        });
        response.setMessage("User ConsentDocs ReUploaded Succesfully");
        return res.send(response.getResponse());
      } else {
        throw new Error("User is not a patient");
      }
    } catch (err) {}
  }

  async getVitals(req, res) {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      const response = new Response(false, 422);
      response.setError(error.mapped());
      return res.status(422).json(response.getResponse());
    }
    try {
      const response = new Response(true, 200);
      const { id } = req.params;
      if (id) {
        let medicalData = await medicalService.getMedicalsDetails({
          userId: id
        });
        medicalData = medicalData[0];

        if (!_.isEmpty(medicalData)) {
          response.setData({
            vitals: medicalData.vitals
          });
          response.setMessage("Vitals");
        } else {
          response.setData({});
          response.setMessage("No Vitals");
        }
      } else {
        throw new Error(constants.COOKIES_NOT_SET);
      }
      return res.send(response.getResponse());
    } catch (err) {
      let payload;
      switch (err.message) {
        case constants.COOKIES_NOT_SET:
          payload = {
            code: 403,
            error: errMessage.COOKIES_NOT_SET
          };
          break;
        default:
          payload = {
            code: 500,
            error: errMessage.INTERNAL_SERVER_ERROR
          };
          break;
      }
      const response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }

  async getMedication(req, res) {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      let response = new Response(false, 422);
      response.setError(error.mapped());
      return res.status(422).json(response.getResponse());
    }
    try {
      let response = new Response(true, 200);
      const { id } = req.params;
      if (id) {
        let medications = await medicationService.getMedication(id);

        if (!_.isEmpty(medications)) {
          let products = [];

          medications = medications.medicine;

          medications.map(medication => {
            const keys = Object.keys(medication);
            const index = keys.indexOf("updatedAt");
            if (index !== -1) keys.splice(index, 1);
            products = products.concat(keys);
          });

          const productSet = new Set(products);

          const productsData = await productService.getProducts([
            ...productSet
          ]);
          let productsObj = {};
          productsData.map(product => {
            Object.assign(productsObj, {
              [product._id]: product
            });
          });

          let parsedMedication = medications.map(medication => {
            const newMedication = {};
            _.forIn(medication, (value, key) => {
              if (key !== "updatedAt") {
                const product = productsObj[key];
                Object.assign(newMedication, {
                  [key]: {
                    name: product.name + " " + product.volume.strength + "mg",
                    often: value.often,
                    upto: moment(value.upto).format("DD-MM-YYYY")
                  }
                });
              }
            });
            Object.assign(newMedication, {
              updatedAt: moment(medication.updatedAt).format("DD-MM-YYYY")
            });
            return newMedication;
          });

          response.setData({
            medications: parsedMedication
          });
          response.setMessage("Medication");
        } else {
          response.setData({});
          response.setMessage("No Medication");
        }
      } else {
        throw new Error(constants.COOKIES_NOT_SET);
      }
      return res.send(response.getResponse());
    } catch (err) {
      let payload;
      switch (err.message) {
        case constants.COOKIES_NOT_SET:
          payload = {
            code: 403,
            error: errMessage.COOKIES_NOT_SET
          };
          break;
        default:
          payload = {
            code: 500,
            error: errMessage.INTERNAL_SERVER_ERROR
          };
          break;
      }
      let response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }

  async getRecentMedication(req, res) {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      const response = new Response(false, 422);
      response.setError(error.mapped());
      return res.status(422).json(response.getResponse());
    }
    try {
      const response = new Response(true, 200);
      const { id } = req.params;
      if (id) {
        const medications = await medicationService.getMedications({
          userId: id
        });
        let medication = {};
        if (medications.length > 0) {
          const { medicine, userId: patientId } = medications[0];
          const latestMedicine = medicine[medicine.length - 1];
          medication.userId = patientId;
          medication.medicine = latestMedicine;
        }
        const userDetails = await userService.getUserById(id);
        const programId = userDetails.programId[0];
        const productId = await programService.getProgramProducts(programId);
        let products_data = [];
        if (productId !== null && productId && productId.length > 0) {
          products_data = await productService.getProductById(
            productId[0].products
          );
        }
        let products = {};
        if (products_data.length > 0) {
          products_data.map(product => {
            const { _id } = product;
            products[_id] = product;
          });
        }

        response.setData({
          medication: { [id]: medication },
          products: products
        });
        response.setMessage("Recent Medication");
      } else {
        response.setData({});
        response.setMessage("No Medication");
      }
      return res.send(response.getResponse());
    } catch (err) {
      let payload;
      switch (err.message) {
        case constants.COOKIES_NOT_SET:
          payload = {
            code: 403,
            error: errMessage.COOKIES_NOT_SET
          };
          break;
        default:
          payload = {
            code: 500,
            error: errMessage.INTERNAL_SERVER_ERROR
          };
          break;
      }
      let response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }

  async test(req, res) {
    return res.send(200);
  }
}

module.exports = new UserController();
