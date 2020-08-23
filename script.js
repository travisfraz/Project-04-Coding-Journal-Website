
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
const journalData = [];


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


const submitJournalEntry = (entryTitle, methodsLeanred, journalNotes, entryDateFormated) => {

    const dataLength = journalData.length;

    newObj = {
        'title': entryTitle,
        'methodsLearned': methodsLeanred,
        'notes': journalNotes,
        'entryDate': entryDateFormated
    }

    journalData[dataLength] = newObj;



    //Testing
    console.log(journalData.length)

    journalData.forEach(function(entry) {
        console.log(entry);
    })
}


const submitEntryButtons = document.querySelector('[submit-entry]');
submitEntryButtons.addEventListener('click', submitEntry)





/*  //Test code.  Trying to figure out a way to dynamically create an obj of an obj to store the entries.
    //Using time entered as the object entry
function submitJournalEntry(entryTitle, methodsLeanred, journalNotes, entryDateFormated) {
    
    objEntry = {
        title: entryTitle,
        methods: methodsLeanred,
        content: journalNotes
    }
    journalData[entryDateFormated] = objEntry
    



    let entries = Object.entries(journalData) 
    console.log(entries.length)

    for (i=0; i < entries.length; i++) {
        
        console.log(entries[i])
    }

}*/