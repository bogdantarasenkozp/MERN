module.exports = (args) => {
  const { BaseController, models, helpers, config } = args;

  const { httpError, jwt, axios, Sequelize } = args.package;

  class UserController extends BaseController {
    constructor() {
      super();
      this.email = new helpers.email;
      this.basePath = `api/${config.apiVersion}/users/`;
    }

    login(req, res, next) {
      let { email, password } = req.body;
      email = email && email.toLowerCase();

      const messages = {
        unauthorized: 'Authorization error',
        forbidden: 'User not verified'
      };

      models.Users.findOne({ where: { email }, include: [{ all:true }] })
        .then(user => {

          if (!user) {
            throw new httpError.Unauthorized(messages.unauthorized);
          }

          if (!user.get('verified')) {
            throw new httpError.Forbidden(messages.forbidden);
          }

          return helpers.users.checkHashPassword(password, user.get('password'))
            .then(equal => {
              if (!equal) {
                throw new httpError.Unauthorized(messages.unauthorized);
              }

              const token = jwt.sign({
                id: user.get('id'),
                email: user.get('email'),
                firstName: user.get('firstName'),
                lastName: user.get('lastName')
              }, config.auth.secret, {
                expiresIn: config.auth.expiresIn
              });

              res.json({ token, role: user.getRoleName(), wallet: user.get('wallet') });
            });
        })
        .catch(next);
    }

    logout(req, res, next) {}

    /**
     * Forgot password
     * @param req
     * @param res
     * @param next
     */
    forgotPassword(req, res, next) {
      const { email } = req.body;

      models.Users.findOne({ where: { email }})
        .then(user => {
          if (!user) {
            throw new httpError.NotFound('Email not found');
          }

          return user.update({
            resetPasswordToken: helpers.users.getResetPasswordToken(),
            resetPasswordExpires: helpers.users.getResetPasswordExpires()
          });
        })
        .then(user => {
          if (!user) {
            throw new httpError.InternalServerError('User was not updated');
          }

          this._sendEmailForgotPasswordVerification({
            email: user.get('email'),
            resetToken: user.get('resetPasswordToken')
          });

          res.json({ id: user.get('id') });
        })
        .catch(next);
    }

    resetPassword(req, res, next) {
      const { token } = req.params;

      this._checkResetToken(token)
        .then(user => user.update({ verified: true }))
        .then(user => res.json({ resetToken: user.get('resetPasswordToken') }))
        .catch(next);
    }

    updatePassword(req, res, next) {
      const { password, resetToken } = req.body;

      this._checkResetToken(resetToken)
        .then(record => {
          return helpers.users.checkHashPassword(password, record.get('password'))
            .then(equal => {
              if (equal) {
                throw new httpError.BadRequest(`You cannot re-use a previous password.
              Please create a new password any try again.`);
              }
            })
            .then(() => helpers.users.encryptPassword(password))
            .then(hash => record.update({
              password: hash,
              resetPasswordExpires: new Date()
            }))
            .then(record => {
              if (!record) {
                throw new httpError.InternalServerError('User was not updated');
              }

              res.json({ message: 'Password was updated' });
            });
        })
        .catch(next);
    }

    emailVerification(req, res, next) {
      const { email, verificationToken } = req.params;
      const currentTime = new Date();

      return models.Users.findOne({
        where: {
          email,
          verificationToken,
          verificationTokenExpires: { $gt: currentTime }
        }
      })
        .then(user => {

          if (!user) {
            throw new httpError.BadRequest('Verification failed');
          }

          return user.update({ verified: true, verificationTokenExpires: currentTime })
            .then(user => res.json({ id: user.get('id') }));
        })
        .catch(next);

    }

    async getUser(req, res) {
      const { id } = req.params;

      const data = await models.Users.scope('get').findById(id);

      if (!data) {
        throw new httpError.NotFound('Not found user');
      }

      res.json(data);
    }

    async getUsers(req, res) {
      const defaultPage = 1;
      const defaultLimit = 10;
      const maxLimit = 100;
      const {
        email = '',
        order = 'ASC',
        page = defaultPage,
        limit: queryLimit = defaultLimit,
        column = 'id'
      } = req.query;

      const limit = queryLimit < maxLimit ? queryLimit : maxLimit;
      const offset = limit * (page - 1);

      let data = await models.Users.scope('get').findAndCountAll({
        order: [ [column, order] ],
        where: {
          email: { like: `%${email}%` }
        },
        limit,
        offset
      })
        .then(data => {
          const { count: total, rows: values } = data;

          return {
            total,
            values,
            page: { size: limit, number: page },
            totalPages: Math.ceil(total/limit)
          };
        });

      return res.json(data);
    }

    async search(req, res) {
      const maxLimit = 100;
      const {
        query = '',
        email = '',
        order = 'ASC',
        page = 1,
        limit: queryLimit = 20,
        column = 'id'
      } = req.query;

      const limit = queryLimit < maxLimit ? queryLimit : maxLimit;
      const offset = limit * (page - 1);

      const data = await models.Users.scope('get').findAndCountAll({
        attributes: [
          Sequelize.literal('DISTINCT("users"."id")'), 'id', 'email'
        ].concat(Object.keys(models.Users.scope('get').rawAttributes)),
        order: [ [column, order] ],
        limit,
        offset,
        distinct: 'id',
        where: {
          $and: {
            email: { like: `%${email}%` },
            $or: [
              { email: { like: `%${query}%` } },
              { '$wallets.address$': { like: '%' + query + '%' } }
            ]
          }
        },
        include: [{
          model: models.Wallets,
          required: false,
          attributes: [],
          as: 'wallets',
          duplicating: false
        }]
      });

      const { count: total, rows: values } = data;

      res.json({
        total,
        values,
        page: { size: limit, number: page },
        totalPages: Math.ceil(total/limit)
      });
    }

    _getAllowedValues(operation, data) {
      const type = {
        update: [
          'name', 'wallet', 'walletReferral', 'lastName', 'address', 'address2',
          'city', 'country', 'zipCode', 'contact', 'gender', 'clickId'
        ],
        updateAdmin: [
          'name', 'wallet', 'walletReferral', 'lastName', 'address', 'address2',
          'city', 'country', 'zipCode', 'contact', 'gender', 'clickId',
          'tokensAmount', 'ethContrib', 'btcContrib', 'ltcContrib'
        ],
        create: [
          'email', 'password', 'name', 'wallet', 'walletReferral', 'lastName',
          'address', 'address2', 'city', 'country', 'zipCode', 'contact', 'gender', 'clickId',
          'tokensAmount', 'ethContrib', 'btcContrib', 'ltcContrib'
        ],
        get: [
          'id', 'email', 'name', 'wallet', 'walletReferral', 'lastName', 'address', 'address2',
          'city', 'country', 'zipCode', 'contact', 'gender', 'clickId',
          'tokensAmount', 'ethContrib', 'btcContrib', 'ltcContrib', 'wallets'
        ]
      };

      let result = {};

      type[operation].forEach(field => {
        result[field] = data[field];
      });

      return result;
    }

    async _updateUser(args) {
      const { id, payload } = args;

      const user = await models.Users.update(payload, { where: { id } });

      if (!user) {
        throw new httpError.NotFound('User not found');
      }

      return user;
    }

    async updateUser(req, res) {
      const payload = this._getAllowedValues('updateAdmin', req.body);
      const { id } = req.params;

      await this._updateUser({ id, payload });

      res.json({ id });
    }

    async updateCurrentUser(req, res) {
      const payload = this._getAllowedValues('update', req.body);
      const id = req._user.id;

      await this._updateUser({ id, payload });

      res.json({ id });
    }

    async changeEmailOrPassword(req, res, next) {
      const { email, oldPassword, password, passwordConfirmation} = req.body;
      const { id, password: currentPassword } = req._user;

      if (!email && !(oldPassword && password && passwordConfirmation)) {
        next(httpError.BadRequest('Please enter email or password.'));
      }

      if ((password || passwordConfirmation || oldPassword)
            && (!password || !passwordConfirmation || !oldPassword)) {
        next(httpError.BadRequest(`You must fill all three fields to change password.`));
      }

      if (oldPassword && password === oldPassword) {
        next(httpError.BadRequest(`You cannot re-use a previous password.
        Please use a new password and try again.`));
      }

      if (oldPassword && password !== passwordConfirmation) {
        next(httpError.BadRequest('Password confirmation should be exactly the same as password.'));
      }

      if (password && password.length < 6) {
        next(httpError.BadRequest(`New password is too short`));
      }

      const checkAndEncryptPassword = (currentPassword, oldPassword, newPassword) =>
      {
        return helpers.users.checkHashPassword(oldPassword, currentPassword)
          .then(equal => {
            if (!equal) {
              throw new httpError.BadRequest(`Invalid old password.`);
            }
          })
          .then(() => helpers.users.encryptPassword(newPassword));
      };

      const checkEmail = (email) =>
      {
        return models.Users.findOne({ where: { email } })
            .then( user => {
              if (user && user.id !== id) {
                throw new httpError.BadRequest(`This email is already in use.`);
              }
            })
      };

      (email ? checkEmail(email) : Promise.resolve())
        .then(() => {
            (password ? checkAndEncryptPassword(currentPassword, oldPassword, password) : Promise.resolve())
                .then(hash => {
                  const payload = {};

                  if (email) {
                    payload.email = email;
                  }

                  if (hash) {
                    payload.password = hash;
                  }

                  return this._updateUser({
                    id,
                    payload
                  });
                })
                .then(record => {
                  if (!record) {
                    throw new httpError.InternalServerError('User was not updated');
                  }

                  res.json({ message: 'User data was updated' });
                })
                .catch(next);
        })
        .catch(next);
    }

    getCurrentUser(req, res, next) {
      if (!req._user) {
        next(httpError.NotFound('Not found user info'));
      }

      const user = req._user;
      const payload = this._getAllowedValues('get', user);
      const role = user.role ? user.role.name : null;

      Object.assign(payload, { role });

      res.json(payload);
    }

    createUser(req, res, next) {
      let payload = this._getAllowedValues('create', req.body);

      payload.email = payload.email && payload.email.toLowerCase();

      const { email } = payload;

      return models.Users.findOne({ where: { email } })
        .then( user => {
          if (user) {
            throw httpError.BadRequest({ field: 'email', message: 'A user with same email already exists' });
          }
        })
        .then(() => {
          return Promise.all([
            payload.password ? helpers.users.encryptPassword(payload.password) : '',
            models.Users.getDefaultRole()
          ])
            .then(data => ({ hash: data[0], roleId: data[1].id }));

        })

        .then(data => {
          const { hash: password, roleId } = data;
          const verificationToken = helpers.users.getResetPasswordToken();
          const verificationTokenExpires = helpers.users.getResetPasswordExpires();

          Object.assign(
            payload,
            {
              password,
              verificationToken,
              verificationTokenExpires,
              roleId,
              verified: config.email.disableVerification ? true : false
            }
          );

          return models.Users.create(payload);
        })
        .then(user => {
          const clickId = user.get('clickId');

          if (!user.get('verified')) {
            this._sendEmailVerification({
              email: user.get('email'),
              verificationToken: user.get('verificationToken')
            });
          }

          this._sendEmailWelcome({ email });

          if (clickId) {
            this._saveClickId(clickId);
          }

          res.json({ id: user.get('id') })
        })
        .catch(next);
    }

    _checkResetToken(token) {
      return models.Users.findOne({
        where: {
          resetPasswordToken: token,
          resetPasswordExpires: { $gt: new Date() }
        }
      })
        .then(user => {
          if (!user) {
            throw new httpError.NotFound('Token not found');
          }

          return user;
        });
    }

    _sendEmailWelcome({ email }) {
      return this.email.send({
        subject: 'Welcome',
        to: email,
        template: 'welcome'
      })
        .catch(error => {
          console.log(error);
        });
    }

    _sendEmailVerification(args) {
      const { email, verificationToken} = args;

      return this.email.send({
        subject: 'Email verification',
        to: email,
        content: `Please follow the link: ${config.hostname}verify/${email}/${verificationToken}`,
        template: 'welcome'
      })
        .catch(error => {
          console.log(error);
        });
    }

    _sendEmailForgotPasswordVerification(args) {
      const { email, resetToken } = args;

      return this.email.send({
        subject: 'Reset password',
        to: email,
        content: `Please follow the link: ${config.hostname}restore/${resetToken}`
      })
        .catch(error => {
          console.log(error);
        });
    }

    _saveClickId(clickId) {
      if (!clickId) { return Promise.reject(); }

      helpers.schedule.createJobRequest(`http://offer.advendor.net/postback?clickid=${clickId}&goal=1&secure=d5bc36d968ad462b377b99729c42d595`);
    }
  }

  return new UserController();
};