// eslint-disable-next-line import/no-extraneous-dependencies
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, './uploads');
  },
  filename(req, file, cb) {
    const name = `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, name);
  },
});

const upload = multer({ storage });

module.exports = upload;
