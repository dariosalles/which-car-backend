"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _awssdk = require('aws-sdk'); var _awssdk2 = _interopRequireDefault(_awssdk);
var _crypto = require('crypto'); var _crypto2 = _interopRequireDefault(_crypto);
var _multer = require('multer'); var _multer2 = _interopRequireDefault(_multer);
var _multers3 = require('multer-s3'); var _multers32 = _interopRequireDefault(_multers3);
var _path = require('path');

const { BUCKET_NAME, STORAGE_TYPE } = process.env;

const storageTypes = {
  local: _multer2.default.diskStorage({
    destination: _path.resolve.call(void 0, __dirname, "..", "..", "tmp", "uploads"),
    filename: (req, file, callback) => {
      _crypto2.default.randomBytes(15, (err, res) => {
        if (err) {
          // o parâmetro de callback do filename é usado para retornar o erro, caso tenha
          return callback(err);
        }
        // e a função chamada executarmos o nome do arquivo
        // o primeiro parâmetro é o erro
        return callback(null, res.toString("hex") + _path.extname.call(void 0, file.originalname));
      });
    }
  }),
  s3: _multers32.default.call(void 0, {
    s3: new _awssdk2.default.S3(),
    bucket: BUCKET_NAME,
    contentType: _multers32.default.AUTO_CONTENT_TYPE,
    acl: "public-read",
    key: (req, res, callback) => {
      _crypto2.default.randomBytes(15, (err, res) => {
        if (err) {
          return callback(err);
        }
        return callback(null, res.toString("hex") + _path.extname.call(void 0, file.originalname));
      });
    }
  })
};

exports. default = {
  dest: _path.resolve.call(void 0, __dirname, "..", "..", "tmp", "uploads"),
  storage: storageTypes[STORAGE_TYPE],
  limits: {
    fileSize: 2 * 1024 * 1024
  },
  fileFilter: (req, file, callback) => {
    const allowedMimes = [
      "image/jpeg",
      "image/pjpeg",
      "image/png",
      "image/gif"
    ];

    if (allowedMimes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new Error("Invalid file type"));
    }
  }
};