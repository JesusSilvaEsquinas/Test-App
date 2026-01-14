// Configuració de Firebase - SUBSTITUEIX AMB LES TEVES CREDENCIALS
const firebaseConfig = {
    apiKey: "AIzaSyCxj-aXpggTTMOpXnWmVX1k8ePkRVP9jZQ",
    authDomain: "todo-firebase-6c6ae.firebaseapp.com",
    projectId: "todo-firebase-6c6ae",
    storageBucket: "todo-firebase-6c6ae.firebasestorage.app",
    messagingSenderId: "938876003230",
    appId: "1:938876003230:web:09ad49964a10274ce96c8f",
    measurementId: "G-NNMSHTYGXS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Referències
const formNota = document.getElementById('form-nota');
const inputTitol = document.getElementById('input-titol');
const inputContingut = document.getElementById('input-contingut');
const llistaNotes = document.getElementById('llista-notes');

// Carregar notes en temps real
db.collection('notes').orderBy('timestamp', 'desc').onSnapshot((snapshot) => {
    llistaNotes.innerHTML = '';
    snapshot.forEach((doc) => {
        const nota = doc.data();
        afegirNotaAlDOM(doc.id, nota);
    });
});

// Afegir nova nota
formNota.addEventListener('submit', async (e) => {
    e.preventDefault();

    const titol = inputTitol.value.trim();
    const contingut = inputContingut.value.trim();

    if (titol && contingut) {
        try {
            await db.collection('notes').add({
                titol: titol,
                contingut: contingut,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });

            inputTitol.value = '';
            inputContingut.value = '';
            inputTitol.focus();
        } catch (error) {
            console.error('Error afegint nota:', error);
            alert('Error guardant la nota. Revisa la consola.');
        }
    }
});

// Afegir nota al DOM
function afegirNotaAlDOM(id, nota) {
    const card = document.createElement('div');
    card.className = 'nota-card';
    card.innerHTML = `
    <div class="nota-header">
      <h3>${nota.titol}</h3>
      <button class="btn-eliminar" data-id="${id}">🗑️</button>
    </div>
    <p>${nota.contingut}</p>
    <small class="timestamp">${formatarData(nota.timestamp)}</small>
  `;

    // Event per eliminar
    card.querySelector('.btn-eliminar').addEventListener('click', () => {
        eliminarNota(id);
    });

    llistaNotes.appendChild(card);
}

// Eliminar nota
async function eliminarNota(id) {
    if (confirm('Segur que vols eliminar aquesta nota?')) {
        try {
            await db.collection('notes').doc(id).delete();
        } catch (error) {
            console.error('Error eliminant nota:', error);
            alert('Error eliminant la nota.');
        }
    }
}

// Formatar data
function formatarData(timestamp) {
    if (!timestamp) return 'Ara mateix';
    const data = timestamp.toDate();
    return data.toLocaleString('ca-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}