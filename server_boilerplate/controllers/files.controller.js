module.exports = (args) => {
  const { BaseController, config, models } = args;

  const { httpError, multer, multerS3, AWS, sanitizeFilename } = args.package;

  class FileController extends BaseController {
    constructor() {
      super();
    }

    /**
     *
     * @returns {*}
     * @private
     */
    _getS3() {
      AWS.config.setPromisesDependency(Promise);

      return new AWS.S3(
        new AWS.Config(config.aws)
      )
    }

    /**
     *
     * @param req
     * @returns {{id: *, email: *}}
     * @private
     */
    _getCurrentUserData(req) {
      const { id, email } = req._user;
      return { id, email };
    }
    
    uploadFile(req, res, next) {
      const s3 = this._getS3();
      const { bucket } = config.aws.s3;
      const { email } = this._getCurrentUserData(req);

      if (!email) {
        throw new httpError('User not found');
      }

      const storage = multerS3({
        s3,
        acl: 'public-read',
        bucket,
        key: function(req, file, cb) {
          const filename = sanitizeFilename(file.originalname);

          cb(null, `${email}/${filename}`)
        }
      });

      const upload = multer({ storage });

      upload.single('file')(req, res, next);
    }

    async getUploadedFileInfo(req, res) {
      const { location: path, originalname: filename, size, mimetype } = req.file;
      const { id: userId } = this._getCurrentUserData(req);;
      const model = models.Files;
      const payload = { path, info: req.file, userId };

      let foundFile = await models.Files.findOne({ where: { path, userId } });

      !foundFile
        ? await model.create(payload)
        : await foundFile.update(payload);

      res.json({ filename, size, mimetype, path });
    }

    async getFileList(req, res) {
      const { id: userId } = this._getCurrentUserData(req);
      const files = await models.Files.findAll({ where: { userId } });

      const response = files.map(file => {
        const { location: path, originalname: filename, size, mimetype } = file.get('info');
        return { path, filename, size, mimetype };
      });

      res.json(response);
    }
  }

  return new FileController();
};