module.exports = (args) => {
  const { controllers, middlewares } = args;
  const { express, asyncHandler } = args.package;
  const auth = middlewares.auth;

  const router = express.Router();

  const controller = controllers.users;

  return router
    .post('/', controller.createUser.bind(controller))
    .get('/', auth.isAdmin, asyncHandler(controller.getUsers.bind(controller)))
    .put('/', auth.isUser, asyncHandler(controller.updateCurrentUser.bind(controller)))
    .get('/me', auth.isUser, controller.getCurrentUser.bind(controller))
    .get('/search', auth.isAdmin, asyncHandler(controller.search.bind(controller)))
    .get('/:id', auth.isAdmin, asyncHandler(controller.getUser.bind(controller)))
    .get('/:email/verification/:verificationToken', controller.emailVerification.bind(controller))
    .post('/password/forgot', controller.forgotPassword.bind(controller))
    .get('/password/reset/:token', controller.resetPassword.bind(controller))
    .put('/password', controller.updatePassword.bind(controller))
    .put('/:id', auth.isAdmin, asyncHandler(controller.updateUser.bind(controller)))
    .post('/login', controller.login.bind(controller))
    .post('/changeEmailOrPassword', auth.isUser, asyncHandler(controller.changeEmailOrPassword.bind(controller)));
};
