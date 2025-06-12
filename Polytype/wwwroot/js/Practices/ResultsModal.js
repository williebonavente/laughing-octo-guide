// ResultsModal.js

let modal, closeBtn, seeResultsBtn;

export function showResultsModal({ statsHtml }) {
    if (!modal) {
        modal = document.getElementById('resultsModal');
        closeBtn = document.getElementById('closeResultsBtn');
        seeResultsBtn = document.getElementById('seeResultsBtn');
        setupModalEvents();
    }
    document.getElementById('vimStats').innerHTML = statsHtml;
    modal.classList.add('show');
    closeBtn && closeBtn.focus();
}

function setupModalEvents() {
    if (closeBtn) {
        closeBtn.onclick = () => closeModalSmoothly();
    }
    document.addEventListener('keydown', (e) => {
        if (modal.classList.contains('show') && e.key === 'Escape') {
            closeModalSmoothly();
        }
    });
    if (seeResultsBtn) {
        seeResultsBtn.onclick = () => {
            modal.classList.add('show');
            document.getElementById('results').style.display = 'none';
            closeBtn && closeBtn.focus();
        };
    }
}

function closeModalSmoothly() {
    modal.classList.remove('show');
    modal.classList.add('exit');
    setTimeout(() => {
        modal.classList.remove('exit');
        document.getElementById('results').style.display = 'block';
    }, 1000); // Match the CSS transition duration
}
