module.exports = (args = {}) => {

  const BaseController = require('./classes/BaseController.class')(args);
  args.BaseController = BaseController;

  return {
    'users': require('./users.controller')(args),
    'sections': require('./sections.controller')(args),
    'files': require('./files.controller')(args),
    'web3': require('./web3.controller')(args),
    'transactions': require('./transactions.controller')(args)
  };
};
