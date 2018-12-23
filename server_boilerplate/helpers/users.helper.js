module.exports = (args) => {

  const { config } = args;
  const { bcrypt, crypto, moment } = args.package;

  const checkHashPassword = (plainPassword, hashPassword) => {
    return bcrypt.compare(plainPassword, hashPassword)
      .then(compare => !!compare)
      .catch(error => false);
  };

  const getResetPasswordToken = () => {
    return crypto.randomBytes(config.auth.resetPassword.tokenLength).toString('hex');
  };

  const getResetPasswordExpires = () => {
    return moment.utc().add(config.auth.resetPassword.expiresIn, 'm');
  };

  const encryptPassword = (plainPassword) => {
    return bcrypt.hash(plainPassword, config.auth.saltRound);
  };

  return {
    checkHashPassword,
    getResetPasswordToken,
    getResetPasswordExpires,
    encryptPassword
  };
};
