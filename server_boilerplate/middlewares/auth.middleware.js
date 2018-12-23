
module.exports = (args) => {
  const { config } = args;
  const { passport, httpError } = args.package;

  const _authenticate = (req, res) => {
    return new Promise((resolve, reject) => {
      return passport.authenticate(config.auth.strategy, (error, user, info) => {
        if (error) {
          reject(error);
        }

        if (!user) {
          reject(httpError.Unauthorized());
        }

        resolve(user);

      })(req, res);
    });
  };

  return {
    'isUser': (req, res, next) => {
      _authenticate(req, res)
        .then(user => {
          req._user = user.get();
          next();
        })
        .catch(next);
    },
    'isAdmin': (req, res, next) => {
      _authenticate(req, res)
        .then(user => {
          if (!user.isAdmin() && !user.isSuperAdmin()) {
            throw new httpError.Forbidden();
          }

          req._user = user.get();
          next();
        })
        .catch(next);
    },
    'isSuperAdmin': (req, res, next) => {
      _authenticate(req, res)
        .then(user => {
          if (!user.isSuperAdmin()) {
            throw new httpError.Forbidden();
          }

          req._user = user.get();
          next();
        })
        .catch(next);
    }
  };
};
