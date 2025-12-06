const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.interimResults = true;
recognition.lang = "en-US";

let fullText = "";

const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const saveBtn = document.getElementById("saveBtn");
const clearAllBtn = document.getElementById("clearAllBtn");
const textBox = document.getElementById("textBox");
const notesList = document.getElementById("notesList");


let savedNotes = JSON.parse(localStorage.getItem("notes")) || [];
savedNotes.forEach(function(note) {
    addNoteToList(note);
});


startBtn.addEventListener("click", function() {
    fullText = "";
    textBox.value = "";
    recognition.start();
});


stopBtn.addEventListener("click", function() {
    recognition.stop();
});

recognition.onresult = function(event) {
    let spoken = event.results[0][0].transcript;

    textBox.value = spoken;

    if (event.results[0].isFinal) {
        fullText = fullText + spoken + " ";
        textBox.value = fullText;
    }
};


saveBtn.addEventListener("click", function() {
    let noteText = textBox.value.trim();
    if (noteText === "") {
        return;
    }

    addNoteToList(noteText);

    savedNotes.push(noteText);
    localStorage.setItem("notes", JSON.stringify(savedNotes));

    textBox.value = "";
});


clearAllBtn.addEventListener("click", function() {
    notesList.innerHTML = "";
    savedNotes = [];
    localStorage.setItem("notes", JSON.stringify(savedNotes));
});


function addNoteToList(text) {
    let li = document.createElement("li");
    li.textContent = text;

    let deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "deleteBtn";

    deleteBtn.addEventListener("click", function() {
        notesList.removeChild(li);


        savedNotes = savedNotes.filter(function(item) {
            return item !== text;
        });

        localStorage.setItem("notes", JSON.stringify(savedNotes));
    });

    li.appendChild(deleteBtn);
    notesList.appendChild(li);
}