module.exports = (args = {}) => {
  const { express } = args.package;
  const router = express.Router();

  router.use('/users', require('./users.route')(args));
  router.use('/files', require('./files.route')(args));

  router.use('*', (req, res) => {
    res.status(404).json({message: `Not found ${req.method}: ${req.baseUrl}`});
  });

  return router;
};
