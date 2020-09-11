/*This section loads the stored Journal Entries*/
async function getEntries() {

    const response = await fetch('/api/loadEntries');
    const journalData = await response.json();

    if (journalData === null) {
        journalData = [];
    } else {

        journalData.sort((a,b) => {
            const nameA = a.entryDate.toUpperCase();
            const nameB = b.entryDate.toUpperCase();
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            return 0;
        })

        console.log(journalData);
        clearEntryScreen();
        journalData.forEach(loadEntries);
        createEntryModals();
    }
}







/*This section contains the modal used for journal entries*/
const openModalButtons = document.querySelectorAll('[data-modal-target]')
const closeModalButtons = document.querySelectorAll('[data-close-button]')
const overlay = document.getElementById('overlay')
console.log(overlay)

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
        submitJournalEntry(entryTitle, methodsLeanred, journalNotes, entryDate);
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

clearEntryScreen = () => {
    let journalEntryNode = document.getElementById("journal-entry-area");
    while (journalEntryNode.firstChild) {
        journalEntryNode.removeChild(journalEntryNode.lastChild);
    }
}




/*This section adds journal entries to the main window*/

const loadEntries = (journalData) => {
    
    const title = journalData.title;
    const entryDate = journalData.entryDate;
    const entryDateFormated = formatDate(entryDate)
    const id = journalData._id;

    

    const spanOne = document.createElement("span");
    spanOne.className = "journal-entry-headers"
    spanOne.textContent = `Title: ${title}`

    const spanTwo = document.createElement("span");
    spanTwo.className = "journal-entry-headers"
    spanTwo.textContent = `Date: ${entryDateFormated}`

    const div = document.createElement("div")
    div.appendChild(spanOne)
    div.appendChild(spanTwo)

    div.classList.add("journal-entries");
    div.dataset.modalViewerTarget = "#modal-viewer";
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

    const response = await fetch('/api/getEntry', options);
    const journalEntry = await response.json();

    let title = journalEntry.title;
    let entryDate = journalEntry.entryDate;
    const entryDateFormated = formatDate(entryDate) 
    let methodsLearned = journalEntry.methodsLearned;
    let notes = journalEntry.notes;

    titleTextNode = document.createTextNode(title);
    elementTitle = document.getElementById("modal-viewer-title");
    elementTitle.appendChild(titleTextNode);

    dateTextNode = document.createTextNode(entryDateFormated);
    elementDate = document.getElementById("modal-viewer-date");
    elementDate.appendChild(dateTextNode);

    methodsTextNode = document.createTextNode(methodsLearned);
    elementMethods = document.getElementById("modal-viewer-methods");
    elementMethods.appendChild(methodsTextNode);

    notesTextNode = document.createTextNode(notes);
    elementNotes = document.getElementById("modal-viewer-notes");
    elementNotes.appendChild(notesTextNode);

    modal = document.getElementById("modal-viewer");
    modal.dataset.entryId = id;

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




//This section will setup an entry for deletion

const deleteEntry = async () => {

    const execute = confirm("Do you want to delete this entry?")
    console.log(execute);
    if (execute) {

        const modal = document.getElementById("modal-viewer")
        const entryId = modal.getAttribute("data-entry-id")

        console.log(entryId);

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({id: entryId})
        }

        const response = await fetch('/api/deleteEntry', options);
        const condition = await response.json();

        if (condition) {
            getEntries();
        }
        else {
            alert("Unsuccessful");
        }
    }
    else {
        return
    }
} 

const deleteEntryButton = document.querySelector('[delete-entry]');
deleteEntryButton.addEventListener('click', deleteEntry)


//Function to format date entries for the user
const formatDate = (isoDate) => {
    let tempDate = new Date(isoDate)
    tempDate = tempDate.toDateString()
    const entryDateFormated = tempDate.substr(tempDate.indexOf(" ") + 1)
    return entryDateFormated
}