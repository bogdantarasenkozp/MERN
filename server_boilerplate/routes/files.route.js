module.exports = (args) => {
  const { controllers, middlewares } = args;
  const { express, asyncHandler } = args.package;
  const auth = middlewares.auth;

  const router = express.Router();

  const controller = controllers.files;

  return router
    .get('/', auth.isUser, asyncHandler(controller.getFileList.bind(controller)))
    .post('/', auth.isUser, controller.uploadFile.bind(controller), asyncHandler(controller.getUploadedFileInfo.bind(controller)));
};
