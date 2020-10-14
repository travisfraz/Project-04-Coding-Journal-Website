const express = require('express')
const router = express.Router()
const Journal_Entry = require('../model/journal_entry')

//These are the post/gets used to update the database
//First post saves new journal entries to the database
router.post('/api/saveEntries', async (request, response) => {
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
router.get('/api/loadEntries', async (request, response) => {
    try {
        const data = await Journal_Entry.find({})
        response.json(data)
    } catch {
        console.log('loadEntries error')
    }
})

//This post finds the journal entry with the corresponding id
//and loads it into the journal entry viewer modal
router.post('/api/getEntry', async (request, response) => {
    try {
        const id = request.body
        const journalEntryData = await Journal_Entry.find( { _id: id.id } )
        response.json(journalEntryData)
    } catch {
        console.log('error getEntry')
    }
})

//This post deletes the journal entry shown in the journal entry viewer
router.post('/api/deleteEntry', async (request, response) => {
    try {
        const entryId = request.body
        await Journal_Entry.remove( { _id: entryId.id })
        response.json(true)
    } catch {
        console.log('Error deleting entry')
    }
})

//This section will find the enties searched for.
router.get('/api/find', async (req, res) => {
    console.log('Entered')
    /*let searchOptions = {}
    if (req.query.name != null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try {
        const authors = await Author.find(searchOptions)
        res.render('authors/index', { authors: authors,
        searchOptions: req.query
    })
    } catch{
        res.redirect('/')
    }*/
})

module.exports = router