
const express = require('express');
const Datastore = require('nedb');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json({ limit: '1mb'}));
app.listen(process.env.PORT || 3000);

const database = new Datastore('journal_entries.db');
database.loadDatabase();

app.post('/api/saveEntries', (request, response) => {
    const journalData = request.body;
    database.insert(journalData);
    response.json({ status: 'Success!'});
})

app.get('/api/loadEntries', (request, response) => {
    database.find({}, (err, docs) => {
        response.json(docs); 
        console.log(docs);
    })
})

app.post('/api/getEntry', (request, response) => {
    const id = request.body
    database.findOne({ _id: id.id}, (err, docs) => {
        response.json(docs);
    })
})







app.post('/api/deleteEntry', (request, response) => {
    entryId = request.body;
    database.remove({ _id: entryId.id }, {}, function (err, numRemoved) {});
    response.json(true);
})




