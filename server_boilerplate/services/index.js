module.exports = (args = {}) => {
  return {
    'auth': require('./auth.service')(args)
  };
};
