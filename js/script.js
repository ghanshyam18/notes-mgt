let notes = [];
const noteList = document.getElementById("note-list");

// Search input Event
const searchInput = document.getElementById("search-input");
searchInput.addEventListener('input', (e) => {
    if (e.target.value) {
        const inputVal = e.target.value.toLowerCase();
        const filteredNotes = notes.filter((n) => n.title.toLowerCase().indexOf(inputVal) > -1 || n.desc
            .toLowerCase().indexOf(inputVal) > -1)
        renderNotes(filteredNotes);
    } else {
        renderNotes(notes);
    }
})

// Note form cancel btn event
const cancelBtn = document.getElementById("note-cancel-btn");
cancelBtn.addEventListener('click', (e) => {
    noteFormAction("hide");
})

// Note form close btn event
const closeBtn = document.getElementById("close-form-btn");
closeBtn.addEventListener('click', (e) => {
    noteFormAction("hide");
})

function noteFormAction(type) {
    const noteForm = document.getElementById('note-form');
    if (type === "show") noteForm.className += " show";
    if (type === "hide") {
        document.getElementById("title").value = "";
        document.getElementById("description").value = "";
        noteForm.className = "form-main";
    }
}

function addNewNote() {
    noteFormAction("show");
}

function editNote(id) {
    const nIndex = notes.findIndex((note) => note.id === id);
    notes[nIndex].is_update = true;

    const nObj = notes[nIndex];
    if (nObj) {

        const title = document.getElementById("title");
        const desc = document.getElementById("description");

        title.value = nObj.title;
        desc.value = nObj.desc;
        document.getElementById('note-title').innerHTML = "Edit Note";
        document.getElementById('note-btn').onclick = () => addnote(nObj.id);
        document.getElementById('note-cancel-btn').onclick = () => cancelEdit(nObj.id);
        document.getElementById('note-btn').innerHTML = "Edit";
        document.getElementById('note-form').className += " edit-form";
        noteFormAction("show");
    }
}

function cancelEdit(id) {

    const nIndex = notes.findIndex((note) => note.id === id);
    if (nIndex > -1) {
        notes[nIndex].is_update = undefined;
    }

    document.getElementById('note-title').innerHTML = "Add Note";
    document.getElementById('note-btn').innerHTML = "Add";
    document.getElementById('note-btn').onclick = () => addnote();
    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    noteFormAction("hide");
}

function deleteNote(id) {
    const nIndex = notes.findIndex((note) => note.id === id);

    if (notes[nIndex].is_update) {
        alert('Can\'t delete this note because it is in edit mode');
        return;
    }

    if (nIndex > -1) {
        notes.splice(nIndex, 1);
        updateLocalStorage(notes);
    }
}

function updateLocalStorage(array) {
    localStorage.setItem('notes', JSON.stringify(array));
    renderNotes(array);
}

function renderNotes(notesAry) {
    noteList.innerHTML = "";
    notesAry.forEach((note) => {
        const li = document.createElement('li');
        li.setAttribute('data-id', note.id);
        li.innerHTML = `
                <div class="content">
                    <h3>${note.title}</h3>
                    <p>${note.desc}</p>
                </div>
                <div class="action-main">
                    <span onclick={editNote(${note.id})} class="action edit-note">Edit</span>
                    <span onclick={deleteNote(${note.id})} class="action delete-note">Delete</span>
                </div>
            `;
        noteList.appendChild(li);
    });
}

function addnote(id) {
    const li = document.createElement("li");
    const title = document.getElementById("title");
    const desc = document.getElementById("description");
    const nIndex = notes.findIndex((note) => note.id === id);

    if (!title.value || !title.value.trim()) {
        alert("Please enter valid input for Title!");
        return;
    } else if (!desc.value || !desc.value.trim()) {
        alert("Please enter valid input for Description!");
        return;
    } else if (notes.findIndex((n, i) => i !== nIndex && n.title.toLowerCase() === title.value.trim()
            .toLowerCase()) > -1) {
        alert("Note already exist! Please try with different title");
        return;
    }


    if (id) {
        if (nIndex > -1) {
            notes[nIndex].title = title.value.trim();
            notes[nIndex].desc = desc.value.trim();
            notes[nIndex].is_update = undefined;
        }
        cancelEdit();
    } else {
        const noteObj = {
            id: Date.now(),
            title: title.value.trim(),
            desc: desc.value.trim()
        };
        notes.unshift(noteObj);
    }

    updateLocalStorage(notes);
    noteFormAction("hide");

    title.value = '';
    desc.value = '';
    title.focus();
}

function initNotes() {
    const notesString = localStorage.getItem('notes') || '';
    notes = notesString ? JSON.parse(notesString) : [];
    renderNotes(notes);
}

// Initialize stored notes from Localstorage
initNotes();