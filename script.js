const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const notesCollection = db.collection('notes');

let notes = []
let editingNoteId = null

const searchInput = document.getElementById('searchInput');

async function loadNotes() {
    try {
        const snapshot = await notesCollection.orderBy('createdAt', 'desc').get();
        notes = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        renderNotes();
    } catch (error) {
        console.error("Błąd podczas pobierania notatek:", error);
        document.getElementById('notesContainer').innerHTML = `<p class="error-text">Nie udało się załadować notatek.</p>`;
    }
}

async function saveNote(event) {
    event.preventDefault();
    const title = document.getElementById('noteTitle').value.trim();
    const content = document.getElementById('noteContent').value.trim();

    const noteData = {
        title: title,
        content: content,
    };

    try {
        if (editingNoteId) {
            const noteRef = notesCollection.doc(editingNoteId);
            await noteRef.update(noteData);
        } else {
            noteData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
            await notesCollection.add(noteData);
        }
        closeNoteDialog();
        loadNotes();
    } catch (error) {
        console.error("Błąd podczas zapisywania notatki:", error);
    }
}

async function deleteNote(noteId) {
    if (confirm("Czy na pewno chcesz usunąć tę notatkę?")) {
        try {
            await notesCollection.doc(noteId).delete();
            loadNotes();
        } catch (error) {
            console.error("Błąd podczas usuwania notatki:", error);
        }
    }
}

function renderNotes() {
    const notesContainer = document.getElementById('notesContainer');

    const searchText = searchInput.value.toLowerCase();

    const notesToRender = notes.filter(note => {
        const titleMatch = note.title.toLowerCase().includes(searchText);
        const contentMatch = note.content.toLowerCase().includes(searchText);
        return titleMatch || contentMatch;
    });

    if (notesToRender.length === 0) {
        if (searchText.length > 0) {
            notesContainer.innerHTML = `
        <div class="empty-state">
          <h2>Brak wyników</h2>
          <p>Nie znaleziono notatek pasujących do "${escapeHTML(searchText)}".</p>
        </div>
      `;
        } else {
            notesContainer.innerHTML = `
        <div class="empty-state">
          <h2>Brak notatek</h2>
          <p>Stwórz swoją pierwszą notatkę, aby zacząć!</p>
          <button class="add-note-btn" onclick="openNoteDialog()">+ Dodaj pierwszą notatkę</button>
        </div>
      `;
        }
        return;
    }

    notesContainer.innerHTML = notesToRender.map(note => {
        const safeTitle = escapeHTML(note.title);
        const renderedContent = marked.parse(note.content);

        return `
      <div class="note-card">
        <h3 class="note-title">${safeTitle}</h3>
        <div class="note-content">${renderedContent}</div> 
        <div class="note-actions">
          <button class="edit-btn" onclick="openNoteDialog('${note.id}')" title="Edytuj Notatkę">
            <i class="fa-solid fa-pencil"></i>
          </button>
          <button class="delete-btn" onclick="deleteNote('${note.id}')" title="Usuń Notatkę">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </div>
    `
    }).join('');
}

function openNoteDialog(noteId = null) {
    const dialog = document.getElementById('noteDialog');
    const titleInput = document.getElementById('noteTitle');
    const contentInput = document.getElementById('noteContent');

    if (noteId) {
        const noteToEdit = notes.find(note => note.id === noteId)
        editingNoteId = noteId
        document.getElementById('dialogTitle').textContent = 'Edytuj Notatkę'
        titleInput.value = noteToEdit.title
        contentInput.value = noteToEdit.content
    } else {
        editingNoteId = null
        document.getElementById('dialogTitle').textContent = 'Dodaj Nową Notatkę'
        titleInput.value = ''
        contentInput.value = ''
    }
    dialog.showModal()
    titleInput.focus()
}

function closeNoteDialog() {
    document.getElementById('noteDialog').close()
}

function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, function(match) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[match];
    });
}

document.addEventListener('DOMContentLoaded', function() {
    loadNotes();

    document.getElementById('noteForm').addEventListener('submit', saveNote);

    document.getElementById('noteDialog').addEventListener('click', function(event) {
        if (event.target === this) {
            closeNoteDialog()
        }
    });

    searchInput.addEventListener('input', () => {
        renderNotes();
    });
})