//Configuration statement for any enviroment variables (just database location at this time 9/17/20)
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

//importing required modules/created models
const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const Journal_Entry = require('./model/journal_entry')

//Hooking up to mongoDB database with the mongoose module
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection
db.on('error', error => console.log(error))
db.once('open', () => console.log('Mongoose connection, a go'))

//Creating route variables
const indexRouter = require('./routes/index')

//Setting up the server
app.set('view engine', 'ejs');

//Setting up server to use routes, files, etc
app.use(express.static('public'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded( { limit: '1mb', extended: false } ))
app.use('/', indexRouter)


const port = 3000
app.listen(process.env.PORT || port);