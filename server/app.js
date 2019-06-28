const createError = require("http-errors");
const Config = require("../config/config");
const express = require("express");
const AccessToken = require("twilio").jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;
const faker = require("faker");
const socketServer = require("../libs/socketServer");
const SocketServer = new socketServer(8000);
SocketServer.start();
global.IO = SocketServer.getIO();

Config();

const cookieSession = require("cookie-session");
const passport = require("passport");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
require("../app/services/passport");
const indexRouter = require("../routes/index");
const Mongo = require("../libs/mongo");
const eventRouter = require("../routes/api/event/index");
const productRouter = require("../routes/api/product/index");
const programRouter = require("../routes/api/program/index");
const userRouter = require("../routes/api/user/userIndex");
const calendarRouter = require("../routes/api/user/calendarIndex");
const medicationRouter = require("../routes/api/medication");

const insuranceRouter = require("../routes/api/insurance");
const proxySdkRouter = require("../routes/api/proxySdk");
const dashboardRouter = require("../routes/api/dashboard");
const hospitalRouter = require("../routes/api/hospital");
const searchRouter = require("../routes/api/search");
const medicalConditionRouter = require("../routes/api/medicalCondition");
const surveyRouter = require("../routes/api/survey");
const twilioRouter = require("../routes/api/twilio");
const articleRouter = require("../routes/api/article");

const { memberController } = require("../app/controllers/controllerIndex");
const memberService = require("../app/services/member.services");

const jwt = require("jsonwebtoken");
const userService = require("../app/services/user/user.service");
const Response = require("../app/helper/responseFormat");
const userController = require("../app/controllers/user/user.controller");
const EventObserver = require("../app/proxySdk/eventObserver");
let { Proxy_Sdk, EVENTS } = require("../app/proxySdk");
const rbac = require("../app/helper/rbac");
const rbacNew = require("../routes/api/middleware/rbac");
const schedule = require("node-schedule");
const scheduleModel = require("../app/models/scheduler");
const Activity = require("../app/activitySdk/activityObserver");
const NotificationObserver = require("../app/notificationSdk/notificationObeserver");
const app = express();
const mongo = new Mongo();

EventObserver.runObservers();
Activity.runObservers();
NotificationObserver.runObservers();

(async () => {
  await rbac.init();
})();

(async () => {
  await rbacNew.init();
})();

var conn = (async function() {
  try {
    const connection = await mongo.getConnection();
  } catch (err) {
    console.log(err);
  }
})();

var j = schedule.scheduleJob("*/15 * * * *", function() {
  console.log("The answer to life, the universe, and everything!", new Date());
  Proxy_Sdk.executeScheduledEvent();
});

// view engine setup
app.set("views", path.join(__dirname, "../app/views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({
    extended: false,
    limit: "50mb"
  })
);
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "../public")));

app.use(helmet());
app.use(cors());
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: JSON.parse(process.config.cookieKey)
  })
);
/***************appnotifier test api*********************/
let appNotifier = require("../app/communications/appNotification");
app.post("/api/testNotif", async (req, res, next) => {
  try {
    if (!req.body) throw new Error("invalid payload");
    appNotifier(req.body)
      .action("now")
      .type("appointment")
      .notify();
    res.send({ error: 0, message: "notification send" });
  } catch (err) {
    console.log(err);
    res.send({ error: 1, message: "notification not send due to error" });
  }
});
/*************************************************************/
app.use(async function(req, res, next) {
  try {
    let accessToken = req.cookies.accessToken;
    if (accessToken) {
      const secret = process.config.TOKEN_SECRET_KEY;
      const decodedAccessToken = await jwt.verify(accessToken, secret);
      let user = await userService.getUser({ _id: decodedAccessToken.userId });
      if (user) {
        req.userDetails = {
          exists: true,
          userId: decodedAccessToken.userId,
          userData: user._doc
        };
      } else {
        req.userDetails = {
          exists: false
        };
      }
    } else {
      req.userDetails = {
        exists: false
      };
    }
    next();
  } catch (err) {
    req.userDetails = {
      exists: false
    };
    next();
  }
});

app.use(passport.initialize());
app.use(passport.session());

/****test Api**********************************************************/

app.get("/api/check", async (req, res) => {
  let templateData = new Object();
  templateData.email = "yranjan@in.imshealth.com";
  templateData.link = "12321mn312";
  templateData.host = process.config.APP_URL;
  Proxy_Sdk.execute(EVENTS.SEND_EMAIL, {
    programId: "5c3f057ed8a9b8a161484a87",
    activityId: "5c3f058ff4260e3f9cd54bc9",
    loggedInUserId: "5c3f058ff4260e3f9cd54bc8",
    toAddress: templateData.email,
    title: "Testing email proxy sdk",
    templateData: templateData,
    templateName: "forgotPassword"
  });
  res.send({ message: "done" });
});

// app.post("/api/addReminders", async (req, res) => {
//   let startDateTime = new Date('2019-01-18T15:30:00.000Z');
//   let endDateTime = new Date('2019-01-20T15:30:00.000Z');
//   var reminders = [];
//   for (var d = startDateTime; d <= endDateTime; d.setDate(d.getDate() + 1)) {
//       //daysOfYear.push(new Date(d));
//       let reminder = {}
//       reminder['eventType'] = req.body.eventType;
//       reminder['scheduledOn'] = new Date(d)
//       reminder['data'] = req.body.data
//       reminders.push(reminder)
//   }
//   console.log(reminders)
//   try {
//     let result = await scheduleModel.collection.insert(reminders)
//     console.log('Result: ',result)
//     return true
//   } catch (error) {

//   }
//   });
/***************test api end****************************************************/

app.post(
  "/api/login",
  passport.authenticate("local", {
    failureRedirect: "/memberLoginFailed"
  }),
  (req, res) => {
    console.log("Redirecting urlllll: ", req.body);
    if (req.body.entity == "provider") {
      res.redirect("/provider/home");
    } else {
      res.redirect("/member/home");
    }
  }
);

app.get("/accept-invite/:link", userController.acceptInvite);
app.use("/api", indexRouter);
app.use("/api", dashboardRouter);
app.use("/api", eventRouter);
app.use("/api", hospitalRouter);
app.use("/api", programRouter);
app.use("/api", userRouter);
app.use("/api", calendarRouter);
app.use("/api", insuranceRouter);
app.use("/api", proxySdkRouter);
app.use("/api", searchRouter);
app.use("/api", medicalConditionRouter);
app.use("/api", medicationRouter);
app.use("/api", twilioRouter);
app.use("/api", articleRouter);
app.use("/api", surveyRouter);

app.use((req, res) => {
  console.log("in after route", req.params);
  return res.sendFile(path.join(__dirname, "../public/index.html"));
});

if (process.env.NODE_ENV === "production") {
  // app.use(express.static("../../client/build"));
  // const path = require("path");
  // app.get("*", (req, res) => {
  //   res.sendFile(path.resolve("../../", "client", "build", "index.html"));
  // });
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  console.log(err);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
