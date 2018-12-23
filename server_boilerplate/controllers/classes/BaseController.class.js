module.exports = (args) => {

  const { httpError } = args.package;

  class BaseController {
    constructor() {
      this.httpError = httpError;
    }
  }

  return BaseController;
};
