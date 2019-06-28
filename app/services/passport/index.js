const passport = require("passport");
const Strategy = require("passport-local").Strategy;
const {
  memberController,
  providerController
} = require("../../controllers/controllerIndex");
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new Strategy({ passReqToCallback: true }, async function(
    req,
    username,
    password,
    done
  ) {
    try {
      if (req.body.entity == "provider") {
        let user = await providerController.authenticateProvider(
          username,
          password
        );
        if (!user.err) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } else {
        let user = await memberController.authenticateMember(
          username,
          password
        );
        if (!user.err) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      }
    } catch (err) {
      return done(err);
    }
  })
);
