const express = require('express');
const router = express.Router();
const writerRouter = require('./writer.router');
const pressRouter = require('./press.router');

router.use('/v1/api/writer', writerRouter)
router.use('/v1/api/press', pressRouter)

router.get('/checkstatus', (req, res, next) => {
    res.status(200).json({
        status: 'success',
        message: 'api ok'
    })
})

module.exports = router;