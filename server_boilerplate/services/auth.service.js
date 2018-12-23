module.exports = (args) => {
  const { passport, passportJwt } =   args.package;
  const { models, config } = args;

  const ExtractJwt = passportJwt.ExtractJwt;
  const JwtStrategy = passportJwt.Strategy;

  const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme(config.auth.scheme),
    secretOrKey: config.auth.secret
  };

  passport.use(new JwtStrategy(options, function (payload, next) {
    models.Users.findById(payload.id, { include: [{ all: true }] })
      .then(user => next(null, user))
      .catch(next);
  }));

  return passport;
};