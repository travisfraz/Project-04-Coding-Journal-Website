/*This section loads the stored Journal Entries*/
let journalData = [];

function getEntries() {
    const textEntryData = localStorage.getItem("entryData");
    console.log(textEntryData);
    if (textEntryData === null) {
        journalData = [];
    } else {
        journalData = JSON.parse(textEntryData);
        journalData.forEach(appendEntry);
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


const submitJournalEntry = (entryTitle, methodsLeanred, journalNotes, entryDateFormated) => {
    const dataLength = journalData.length;
    newObj = {
        'title': entryTitle,
        'methodsLearned': methodsLeanred,
        'notes': journalNotes,
        'entryDate': entryDateFormated
    }

    journalData[dataLength] = newObj;
    localStorage.setItem("entryData", JSON.stringify(journalData));
    appendEntry(newObj);
}

const submitEntryButtons = document.querySelector('[submit-entry]');
submitEntryButtons.addEventListener('click', submitEntry)









/*This section clears ALL the previously loaded journal entries*/

clearMemory = () => {
    const confirmation = confirm("Would you like to clear ALL journal entries?");
    if (confirmation) {
        localStorage.clear();
        journalData = [];
    }
}








/*This section adds journal entries to the main window*/

appendEntry = (item) => {
    let title = item.title;
    let entryDate = item.entryDate;

    let div = document.createElement("div");
    divText = `Title: ${title} Date: ${entryDate}`
    let node = document.createTextNode(divText);
    div.appendChild(node);
    div.classList.add("journal-entries");

    
    
    
    
    
    
    
    

    const closeModalButtons = document.querySelectorAll('[data-close-button]')
    const overlay = document.getElementById('overlay')

    
    div.addEventListener('click', () => {
        const modal = document.querySelector(button.dataset.modalTarget)
        openModal(modal)
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










    let element = document.getElementById("journal-entry-area");
    element.appendChild(div);
    

}