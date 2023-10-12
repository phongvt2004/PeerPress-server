'use strict';



const express = require('express');
const app = express();
const helmet = require('helmet')
const morgan = require('morgan')
const compression = require('compression')
const cors = require('cors')
const path = require('path');
const cookieParser = require('cookie-parser')

Date.prototype.getWeek = function (dowOffset) {
/*getWeek() was developed by Nick Baicoianu at MeanFreePath: http://www.meanfreepath.com */

    dowOffset = typeof(dowOffset) == 'number' ? dowOffset : 0; //default dowOffset to zero
    var newYear = new Date(this.getFullYear(),0,1);
    var day = newYear.getDay() - dowOffset; //the day of week the year begins on
    day = (day >= 0 ? day : day + 7);
    var daynum = Math.floor((this.getTime() - newYear.getTime() - 
    (this.getTimezoneOffset()-newYear.getTimezoneOffset())*60000)/86400000) + 1;
    var weeknum;
    //if the year starts before the middle of a week
    if(day < 4) {
        weeknum = Math.floor((daynum+day-1)/7) + 1;
        if(weeknum > 52) {
            nYear = new Date(this.getFullYear() + 1,0,1);
            nday = nYear.getDay() - dowOffset;
            nday = nday >= 0 ? nday : nday + 7;
            /*if the next year starts before the middle of
                the week, it is week #1 of that year*/
            weeknum = nday < 4 ? 1 : 53;
        }
    }
    else {
        weeknum = Math.floor((daynum+day-1)/7);
    }
    return weeknum;
};

//init dbs 
require('./v1/databases/init.mongodb')
require('./v1/databases/init.redis')

//user middleware
app.use(helmet({
    crossOriginResourcePolicy: false,
  }))
// app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan('combined'))
var whitelist = ['http://localhost:3000', 'https://peerpress.vn/']
var corsOptions = {
  origin: ['http://localhost:3000', 'https://peerpress.vn/'],
  credentials: true,
  methods: ['GET', 'HEAD', 'OPTIONS', 'POST', 'PUT', 'DELETE', 'PATCH']
}
app.use('/v1',cors(corsOptions))
app.use('/public', cors())
app.use('/public', express.static(path.join(__dirname, 'v1/public')))

// compress responses
app.use(compression({
    level: 6,
    threshold: 100*1024
}))
app.use(cookieParser());

// add body-parser
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

//router
app.use(require('./v1/routes/index.router'))

// Error Handling Middleware called

app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});


// error handler middleware
app.use((error, req, res, next) => {
    console.log(error)
    res.status(error.status || 500).send({
        error: {
            status: error.status || 500,
            message: error.message || 'Internal Server Error',
        },
    });
});

module.exports = app;
