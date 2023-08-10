const express = require('express');
const router = express.Router();
const writerRouter = require('./writer.router');
const pressRouter = require('./press.router');
const multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })

  var upload = multer({ storage: storage })

router.use('/v1/api/writer', writerRouter)
router.use('/v1/api/press', pressRouter)

router.post('/test',upload.single('file'), (req, res, next) => {
    console.log(req)
    res.status(200).json({
        status: 'success',
        message: 'api ok'
    })
})

module.exports = router;