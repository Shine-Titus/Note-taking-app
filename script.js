const openPopupNote = document.querySelectorAll('[data-popup-target]');
const closePopupButton = document.querySelectorAll('[data-close-button]');
const overlay = document.getElementById('overlay');
const addNote = document.querySelector('.add');
const actualPopup = document.querySelector('.popup');
const container = document.querySelector('.notes-container');

const popupTitle = actualPopup.querySelector('.title');
const popupBody = actualPopup.querySelector('.popup-body');
const okButton = actualPopup.querySelector('.done');

let isEditing = false; // To check if we are editing an existing note
let currentNote = null; // Store reference to the note being edited

// Function to open popup
function openPopup(title = "", content = "", editing = false, note = null) {
    actualPopup.classList.add('active');
    overlay.classList.add('active');

    popupTitle.textContent = title;
    popupBody.textContent = content;

    isEditing = editing;
    currentNote = note;
}

// Function to close popup
function closePopup() {
    actualPopup.classList.remove('active');
    overlay.classList.remove('active');

    popupTitle.textContent = ""; // Clear the popup
    popupBody.textContent = "";
}

// Function to create a new note
function createNote(title, content) {
    let newDiv = document.createElement('div');
    newDiv.classList.add('note');
    newDiv.setAttribute('data-popup-target', '#popup');

    let titleElem = document.createElement('h1');
    let contentElem = document.createElement('p');
    let deleteButton = document.createElement('button'); // Create delete button

    titleElem.textContent = title || "Untitled";  
    contentElem.textContent = content || "No content";  
    deleteButton.innerHTML = "Delete Note"; // Trash icon for delete
    deleteButton.classList.add('delete-btn');

    // Append elements
    newDiv.appendChild(titleElem);
    newDiv.appendChild(contentElem);
    newDiv.appendChild(deleteButton);

    // Click event to open and edit this note
    newDiv.addEventListener('click', (event) => {
        if (!event.target.classList.contains('delete-btn')) { // Prevent popup if delete is clicked
            openPopup(titleElem.textContent, contentElem.textContent, true, newDiv);
        }
    });

    // Click event to delete note
    deleteButton.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent opening popup when deleting
        const confirmDelete = confirm("Are you sure you want to delete this note?");
        if (confirmDelete) {
            newDiv.remove(); // Remove note from DOM
        }
    });

    return newDiv;
}

// Add note event (opens popup without creating a note yet)
addNote.addEventListener('click', () => {
    openPopup(); // Opens empty popup
});

// OK button event (creates or updates a note)
okButton.addEventListener('click', () => {
    const titleText = popupTitle.textContent.trim();
    const contentText = popupBody.textContent.trim();

    if (!isEditing) {
        // Creating a new note
        let newNote = createNote(titleText, contentText);
        container.appendChild(newNote);
    } else if (currentNote) {
        // Updating an existing note
        currentNote.querySelector('h1').textContent = titleText || "Untitled";
        currentNote.querySelector('p').textContent = contentText || "No content";
    }

    closePopup();
});

// Attach event listeners for existing notes
document.querySelectorAll('.note').forEach(note => {
    note.addEventListener('click', () => {
        openPopup(note.querySelector('h1').textContent, note.querySelector('p').textContent, true, note);
    });
});

// Close popup event
closePopupButton.forEach(button => {
    button.addEventListener('click', closePopup);
});
overlay.addEventListener('click', closePopup);
