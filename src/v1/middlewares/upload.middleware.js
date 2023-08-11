const multer = require('multer');
const path = require('path');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,'../public/uploads'))
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname.replace(' ', '_') + '_' + Date.now() + '.'+ file.mimetype.split('/')[1])
    }
  })

  var upload = multer({ storage: storage })

const uploadResponse = (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'upload file successfully',
        filePath: req.file.path.replace(path.join(__dirname, '../'), '')
    })
}

module.exports = {upload, uploadResponse}