/*This section loads the stored Journal Entries*/
async function getEntries() {

    const response = await fetch('/api/loadEntries');
    const journalData = await response.json();

    if (journalData === null) {
        journalData = [];
    } else {
        clearEntryScreen();
        journalData.forEach(loadEntries);
        createEntryModals();
    }
}







/*This section contains the modal used for journal entries*/
const openModalButtons = document.querySelectorAll('[data-modal-target]')
const closeModalButtons = document.querySelectorAll('[data-close-button]')
const overlay = document.getElementById('overlay')

openModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = document.querySelector(button.dataset.modalTarget)
        openModal(modal)
    })
})

overlay.addEventListener('click', () => {
    const modals = document.querySelectorAll('.modal.active')
    modals.forEach(modal => {
      closeModal(modal)
    })
  })

closeModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest('.modal');
        closeModal(modal);
    })
})

function openModal(modal) {
    if (modal == null) return;
    modal.classList.add('active');
    overlay.classList.add('active');
}

function closeModal(modal) {
    if (modal == null) return;
    modal.classList.remove('active');
    overlay.classList.remove('active');
}











/*This section takes new journal inputs and saves them*/
const submitEntry = (ev) => {

    ev.preventDefault();

    let entryTitle = document.getElementById('entry-title').value;
    let methodsLeanred = document.getElementById('methods-learned').value;
    let journalNotes = document.getElementById('journal-notes').value;

    let entryDate = new Date();
    let day = entryDate.getDate();
    let month = entryDate.getMonth() + 1;
    let year = entryDate.getFullYear();
    let entryDateFormated = month.toString() + '/' + day.toString() + '/' + year.toString()

    if (entryTitle != '' && methodsLeanred != '' && journalNotes != '') {
        submitJournalEntry(entryTitle, methodsLeanred, journalNotes, entryDateFormated);
        document.querySelector('form').reset();
    } else {
        alert('Please fill out the all fields')
    }
}


const submitJournalEntry = async (entryTitle, methodsLeanred, journalNotes, entryDateFormated) => {

    const newObj = {
        'title': entryTitle,
        'methodsLearned': methodsLeanred,
        'notes': journalNotes,
        'entryDate': entryDateFormated
    }
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newObj)
    }

    const response = await fetch('/api/saveEntries', options);
    const json = await response.json();
    console.log(json);

    getEntries();
}

const submitEntryButtons = document.querySelector('[submit-entry]');
submitEntryButtons.addEventListener('click', submitEntry)









/*This section clears ALL the previously loaded journal entries*/

clearMemory = () => {
    const confirmation = confirm("Would you like to clear ALL journal entries?");
    if (confirmation) {
        localStorage.clear();
        journalData = [];
        clearEntryScreen();
        
    }
}

clearEntryScreen = () => {
    let journalEntryNode = document.getElementById("journal-entry-area");
    while (journalEntryNode.firstChild) {
        journalEntryNode.removeChild(journalEntryNode.lastChild);
    }
}




/*This section adds journal entries to the main window*/

const loadEntries = (journalData) => {
    
    let title = journalData.title;
    let entryDate = journalData.entryDate;
    let id = journalData._id;


    let div = document.createElement("div");
    divText = `Title: ${title} Date: ${entryDate}`
    let node = document.createTextNode(divText);
    div.appendChild(node);

    div.classList.add("journal-entries");
    div.dataset.modalViewerTarget = "#modal-viewer";
    console.log(id);
    div.dataset.modalIndex = id;

    let element = document.getElementById("journal-entry-area");
    element.insertBefore(div, element.firstChild);
}    


//This section sets the entries up to be clickable and pull up the
//modal viewer

const createEntryModals = () => {

    const openModalButtons = document.querySelectorAll('[data-modal-viewer-target]')
    const closeModalButtons = document.querySelectorAll('[data-close-button]')
    const overlay = document.getElementById('overlay')


    openModalButtons.forEach( (button) => 
        button.addEventListener('click', () => {
            const modal = document.querySelector(button.dataset.modalViewerTarget)
            const id = button.getAttribute("data-modal-index");
            openModalViewer(modal, id)
        })
    )

    overlay.addEventListener('click', () => {
        const modals = document.querySelectorAll('.modal-viewer.active')
        modals.forEach(modal => {
            closeModalViewer(modal)
        })
    })

    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal-viewer');
            closeModalViewer(modal);
        })
    })
}

//Function to open the journal entry modal viewer and add the relevant
//data for that journal entry

async function openModalViewer(modal, id) {
    if (modal == null) return;

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({id: id})
    }
    console.log(id);
    const response = await fetch('/api/getEntry', options);
    const journalEntry = await response.json();

    console.log(journalEntry);
    let title = journalEntry.title;
    let entryDate = journalEntry.entryDate;
    let methodsLearned = journalEntry.methodsLearned;
    let notes = journalEntry.notes;

    titleTextNode = document.createTextNode(title);
    elementTitle = document.getElementById("modal-viewer-title");
    elementTitle.appendChild(titleTextNode);

    dateTextNode = document.createTextNode(entryDate);
    elementDate = document.getElementById("modal-viewer-date");
    elementDate.appendChild(dateTextNode);

    methodsTextNode = document.createTextNode(methodsLearned);
    elementMethods = document.getElementById("modal-viewer-methods");
    elementMethods.appendChild(methodsTextNode);

    notesTextNode = document.createTextNode(notes);
    elementNotes = document.getElementById("modal-viewer-notes");
    elementNotes.appendChild(notesTextNode);

    modal.classList.add('active');
    overlay.classList.add('active');
}

//Function to close the journal entry modal viewer and remove the relevant
//data for that journal entry

function closeModalViewer (modal) {
    if (modal == null) return;

    let elementTitle = document.getElementById("modal-viewer-title");
    elementTitle.innerHTML = "";

    let elementDate = document.getElementById("modal-viewer-date");
    elementDate.innerHTML = "";

    let elementMethods = document.getElementById("modal-viewer-methods");
    elementMethods.innerHTML = "";

    let elementNotes = document.getElementById("modal-viewer-notes");
    elementNotes.innerHTML = "";

    modal.classList.remove('active');
    overlay.classList.remove('active');
}