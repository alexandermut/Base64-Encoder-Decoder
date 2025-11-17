// --- DOM Elements ---
const encodeBtn = document.getElementById('encode-btn');
const decodeBtn = document.getElementById('decode-btn');
// FIX: Cast to HTMLTextAreaElement to access properties like 'value' and 'placeholder'.
const inputTextArea = document.getElementById('input-textarea') as HTMLTextAreaElement;
// FIX: Cast to HTMLTextAreaElement to access the 'value' property.
const outputTextArea = document.getElementById('output-textarea') as HTMLTextAreaElement;
const inputLabel = document.getElementById('input-label');
const outputLabel = document.getElementById('output-label');
const clearBtn = document.getElementById('clear-btn');
const swapBtn = document.getElementById('swap-btn');
const copyBtn = document.getElementById('copy-btn');
const errorContainer = document.getElementById('error-container');

// --- State ---
let mode = 'encode'; // 'encode' or 'decode'

// --- Functions ---

/**
 * Aktualisiert die Benutzeroberfläche basierend auf dem aktuellen Modus (Encode/Decode).
 * Ändert Beschriftungen, Platzhalter und den aktiven Button.
 */
function updateUI() {
    if (mode === 'encode') {
        encodeBtn.classList.add('active');
        decodeBtn.classList.remove('active');
        inputLabel.textContent = 'Zu kodierender Text';
        outputLabel.textContent = 'Base64-Ausgabe';
        inputTextArea.placeholder = 'Text hier eingeben oder einfügen...';
    } else {
        decodeBtn.classList.add('active');
        encodeBtn.classList.remove('active');
        inputLabel.textContent = 'Zu dekodierender Base64-String';
        outputLabel.textContent = 'Dekodierter Text';
        inputTextArea.placeholder = 'Base64-String hier einfügen...';
    }
    // Nach der UI-Aktualisierung die aktuelle Eingabe erneut verarbeiten
    processInput();
}

/**
 * Verarbeitet den Text aus dem Eingabefeld.
 * Führt je nach Modus die Kodierung oder Dekodierung durch.
 * Behandelt Fehler und aktualisiert das Ausgabefeld.
 */
function processInput() {
    const inputValue = inputTextArea.value;

    // Buttons basierend auf dem Eingabewert ein-/ausblenden
    clearBtn.style.display = inputValue ? 'flex' : 'none';

    if (inputValue.trim() === '') {
        outputTextArea.value = '';
        errorContainer.style.display = 'none';
        copyBtn.style.display = 'none';
        return;
    }

    try {
        errorContainer.style.display = 'none';
        let result = '';
        if (mode === 'encode') {
            // Unicode-sichere Kodierung
            result = btoa(unescape(encodeURIComponent(inputValue)));
        } else {
            // Unicode-sichere Dekodierung
            result = decodeURIComponent(escape(atob(inputValue)));
        }
        outputTextArea.value = result;
        copyBtn.style.display = result ? 'flex' : 'none';
    } catch (e) {
        outputTextArea.value = '';
        copyBtn.style.display = 'none';
        if (mode === 'decode') {
            errorContainer.textContent = 'Ungültiger Base64-String angegeben.';
            errorContainer.style.display = 'block';
        }
    }
}

// --- Event Listeners ---

encodeBtn.addEventListener('click', () => {
    if (mode !== 'encode') {
        mode = 'encode';
        updateUI();
    }
});

decodeBtn.addEventListener('click', () => {
    if (mode !== 'decode') {
        mode = 'decode';
        updateUI();
    }
});

inputTextArea.addEventListener('input', processInput);

clearBtn.addEventListener('click', () => {
    inputTextArea.value = '';
    inputTextArea.focus();
    processInput();
});

swapBtn.addEventListener('click', () => {
    const currentOutput = outputTextArea.value;
    // Tauschen nur, wenn eine Ausgabe vorhanden ist und kein Fehler angezeigt wird
    if (currentOutput && errorContainer.style.display === 'none') {
        mode = mode === 'encode' ? 'decode' : 'encode';
        inputTextArea.value = currentOutput;
        updateUI();
    }
});

copyBtn.addEventListener('click', () => {
    if (outputTextArea.value) {
        navigator.clipboard.writeText(outputTextArea.value).then(() => {
            const originalContent = copyBtn.innerHTML;
            copyBtn.innerHTML = `
                <svg class="icon-copied" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                <span>Kopiert!</span>
            `;
            setTimeout(() => {
                copyBtn.innerHTML = originalContent;
            }, 2000);
        }).catch(err => {
            console.error('Konnte nicht in die Zwischenablage kopieren: ', err);
        });
    }
});

// --- Initial Setup ---
// Stellt sicher, dass die UI beim ersten Laden korrekt ist.
updateUI();