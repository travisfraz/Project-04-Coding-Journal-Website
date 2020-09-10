
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
    })
    
})





