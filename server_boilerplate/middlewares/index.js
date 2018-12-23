module.exports = (args = {}) => {
  return {
    'auth': require('./auth.middleware')(args)
  };
};
