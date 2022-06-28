const passport = require("passport");
const { ExtractJwt, Strategy } = require("passport-jwt");
const { User } = require("../db");

const options = {};

options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = process.env.JWT_SECRET;

const strategy = new Strategy(options, async (payload, done) => {
  try {
    const user = await User.findOne({ where: { id: payload.id } });
    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  } catch (err) {
    done(err, false);
  }
});

passport.use(strategy);
