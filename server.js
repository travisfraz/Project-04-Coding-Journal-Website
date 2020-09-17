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

//Setting up the server
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded( { limit: '1mb', extended: false } ))
const port = 3000
app.listen(process.env.PORT || port);

//These are the post/gets used to update the database
//First post saves new journal entries to the database
app.post('/api/saveEntries', async (request, response) => {
    const journalData = new Journal_Entry({
        title: request.body.title,
        methodsLearned: request.body.methodsLearned,
        notes: request.body.notes,
        entryDate: request.body.entryDate
    }) 
    try {
        const newJournalEntry = await journalData.save()
        response.send( {response: 'success'} )
    } catch {
        console.log('Error')
    }
})

//This get loads all journal entries
app.get('/api/loadEntries', async (request, response) => {
    try {
        const data = await Journal_Entry.find({})
        response.json(data)
    } catch {
        console.log('loadEntries error')
    }
})

//This post finds the journal entry with the corresponding id
//and loads it into the journal entry viewer modal
app.post('/api/getEntry', async (request, response) => {
    try {
        const id = request.body
        const journalEntryData = await Journal_Entry.find( { _id: id.id } )
        response.json(journalEntryData)
    } catch {
        console.log('error getEntry')
    }
})

//This post deletes the journal entry shown in the journal entry viewer
app.post('/api/deleteEntry', async (request, response) => {
    try {
        const entryId = request.body
        await Journal_Entry.remove( { _id: entryId.id })
        response.json(true)
    } catch {
        console.log('Error deleting entry')
    }
})