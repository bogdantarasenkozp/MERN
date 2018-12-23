module.exports = (args = {}) => {
  return {
    'users': require('./users.helper')(args),
    'email': require('./sendgrid'),
    'schedule': require('./schedule.helper')(args)
  };
};
