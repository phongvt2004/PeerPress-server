const mongoose = require('mongoose')
//connect mongoose
mongoose.connect( 'mongodb://admin:PeerPress123@db:27017/peer-press', {
    autoIndex: true, 
}).then( _ => console.log('Connected mongoose success!...'))
.catch( err => console.error(`Error: connect:::`, err))

// all executed methods log output to console
mongoose.set('debug', true)
    
// disable colors in debug mode
mongoose.set('debug', { color: false })

// get mongodb-shell friendly output (ISODate)
mongoose.set('debug', { shell: true })

mongoose.plugin(require('mongoose-slug-updater'));

module.exports = mongoose;
