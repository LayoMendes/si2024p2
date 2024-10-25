// Código para carregar eventos do Google Calendar (mantido)
function listUpcomingEvents() {
    gapi.client.calendar.events.list({
        'calendarId': 'alexbarrosjjjjjj@gmail.com',
        'timeMin': (new Date()).toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 10,
        'orderBy': 'startTime'
    }).then(function (response) {
        var events = response.result.items;
        var eventsList = document.getElementById('calendar-events');

        if (events.length > 0) {
            eventsList.innerHTML = '<ul class="list-group">';
            for (var i = 0; i < events.length; i++) {
                var event = events[i];
                var when = event.start.dateTime || event.start.date;
                var eventItem = `
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        <span>${event.summary}</span>
                        <span class="badge bg-primary rounded-pill">${new Date(when).toLocaleString()}</span>
                    </li>
                `;
                eventsList.innerHTML += eventItem;
            }
            eventsList.innerHTML += '</ul>';
        } else {
            eventsList.innerHTML = '<p>Nenhum evento futuro encontrado.</p>';
        }
    }, function (error) {
        console.error('Erro ao carregar eventos do Google Calendar:', error);
        document.getElementById('calendar-events').innerHTML = `<p>Erro ao carregar eventos: ${error.result.error.message}</p>`;
    });
}



//BANCO DE DADOS - CADASTRO DE PRODUTOS

// Função para adicionar serviço ao Firestore
// Importa Firebase e Firestore
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js";

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "sua_apiKey",
    authDomain: "seu_authDomain",
    projectId: "seu_projectId",
    storageBucket: "seu_storageBucket",
    messagingSenderId: "seu_messagingSenderId",
    appId: "seu_appId"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Função para adicionar um serviço ao Firestore
async function adicionarServico(nome, valor, categoria) {
    try {
        await addDoc(collection(db, "servicos"), { nome, valor, categoria });
        console.log("Serviço adicionado com sucesso.");
        carregarServicos(); // Recarrega os serviços após adicionar um novo
    } catch (e) {
        console.error("Erro ao adicionar serviço: ", e);
    }
}

// Função para carregar serviços do Firestore e exibir na tabela
async function carregarServicos() {
    const querySnapshot = await getDocs(collection(db, "servicos"));
    const servicesTable = document.getElementById("servicesTable");
    servicesTable.innerHTML = ""; // Limpa a tabela

    querySnapshot.forEach((doc) => {
        const servico = doc.data();
        const row = document.createElement("tr");
        row.innerHTML = `<td>${servico.nome}</td><td>R$${parseFloat(servico.valor).toFixed(2)}</td><td>${servico.categoria}</td>`;
        servicesTable.appendChild(row);
    });
}

// Evento ao clicar em "Salvar Serviço"
document.getElementById("saveServiceBtn").addEventListener("click", () => {
    const nome = document.getElementById("serviceName").value;
    const valor = document.getElementById("servicePrice").value;
    const categoria = document.getElementById("serviceCategory").value;

    if (nome && valor && categoria) {
        adicionarServico(nome, valor, categoria);
        document.getElementById("serviceForm").reset();
        const modal = bootstrap.Modal.getInstance(document.getElementById("addServiceModal"));
        modal.hide();
    } else {
        alert("Preencha todos os campos");
    }
});

// Carrega os serviços ao iniciar a página
window.addEventListener("load", carregarServicos);
