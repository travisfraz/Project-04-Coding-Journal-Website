const mongoose = require('mongoose')

const journalEntrySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    }, methodsLearned: {
        type: String,
        required: true
    }, notes: {
        type: String,
        required: true
    }, entryDate: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Journal_Entry', journalEntrySchema)