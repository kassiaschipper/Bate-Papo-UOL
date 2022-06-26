let recipient = "Todos";
let messageStatus = "messages-default-style";
let showMessagesIntervalId;
let onlineUserIntervalId;
//Usuário precisa se identificar para entrar na sala - podendo ou não ter seu usuário permitido
function joinChatRoom() {

    const username = document.querySelector(".username-box").value; //pega o valor digitado na caixa de texto
    const usernameObject = { name: username };

    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", usernameObject);
    promise.then(enterChatRoom);//se nome ok, entra na sala 
    promise.catch(askNewName);//se nome não ok pede outro nome
    // console.log(promise);

}

// função que verifica o erro e solicita novo nome
function askNewName(error) {

    const errorType = error.response.status;
    if (errorType === 400) {
        alert("Esse nome já existe na sala, escolha outro!");
        window.location.reload();
    }
}

function onUserLogoff(error) {
    clearInterval(showMessagesIntervalId);
    clearInterval(onlineUserIntervalId);

    const errorType = error.response.status;
    if (errorType === 400) {
        alert("Você foi desconectado! Entre novamente.");
        window.location.reload();
    }
}

//função que permite a entarda do usuário na sala de bate papo e esconde tela de entrada
function enterChatRoom() {
    refreshOnlineUser();
    //alert("Nome mara");
    //esconde tela 
    const hideLoginArea = document.querySelector(".hide-login-area");
    hideLoginArea.classList.add("hidden");
    //mostra tela do bate papo 
    const chatRoomContainer = document.querySelector(".container")
    chatRoomContainer.classList.remove("hidden");

    //mostra as mensagens 
    showMessagesIntervalId = setInterval(showMessages, 3000);
    //recarrega as mensagens
    //reloadMessages();
    //Enquanto o usuário estiver na sala, a cada 5 segundos o site deve avisar ao servidor que o usuário ainda está presente, ou senão será considerado que "Saiu da sala"
}

function showMessages() {
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promise.then(loadMessages);

}
//função para carregar as mensagens
function loadMessages(element) {

    let messages = document.querySelector(".messages-container");
    messages.innerHTML = "";

    for (let i = 0; i < element.data.length; i++) {

        if (element.data[i].type === "status") {
            messages.innerHTML += `
            <div class="messages-default-style room-entry-message">
                <span class="text-color-gray">(${element.data[i].time})</span>
                <span class="bold-text">${element.data[i].from}</span>
                <span>${element.data[i].text}</span>  
            </div>
            `
        }
        else if (element.data[i].type === "private_message") {
            const username = document.querySelector(".username-box").value;

            if (element.data[i].to === username || element.data[i].to === "Todos"
                || element.data[i].from === username) {
                messages.innerHTML += `
            <div class="messages-default-style private-message private-chat">
                <span class="text-color-gray">(${element.data[i].time})</span>
                <span class="bold-text">${element.data[i].from}</span>
                <span>reservadamente para</span>
                <span>${element.data[i].text}</span>  
            </div>
            `}
        } else { // Mensagem para Todos
            messages.innerHTML += `
            <div class="messages-default-style public-message">
                <span class="text-color-gray">(${element.data[i].time}) </span>
                <span class="bold-text">${element.data[i].from} </span> 
                <span>para </span>
                <span class="bold-text">${element.data[i].to}: </span>
                <span>${element.data[i].text}</span>  
            </div>            
            `

        }

    }
    //Enquanto o usuário estiver na sala, a cada 5 segundos o site deve avisar ao servidor que o usuário ainda está presente, ou senão será considerado que "Saiu da sala"
    // if(onlineUserIntervalId === undefined) {
    //     onlineUserIntervalId =  setInterval(onlineUser, 5000);
    // }

    //scrolla as mensagens
    const scroll = document.querySelector(".messages-container");
    //TODO: Ler para entender o false:  https://developer.mozilla.org/pt-BR/docs/Web/API/Element/scrollIntoView#par%C3%A2metros
    scroll.scrollIntoView(false);
}

function reloadMessages() {
    //atualiza a pagina de 3s em 3s
    setInterval(showMessages, 3000);
}

//Manda o nome do usuário para o servidor
function onlineUser() {
    const username = document.querySelector(".username-box").value;
    const usernameObject = { name: username };
    let promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", usernameObject);
    promise.catch(onUserLogoff);

}

//atualiza o nome do usuario no servidor a cada 5s
function refreshOnlineUser() {
    onlineUserIntervalId = setInterval(onlineUser, 5000);
}


function sendMessage() {
    const message = document.querySelector(".textarea").value;
    const username = document.querySelector(".username-box").value;
    const newMessageObject = {
        "from": username,
        "to": recipient,
        "text": message,
        "type": "message"
    }

    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", newMessageObject);
    promise.then(sentMessage);
    promise.catch(unsentMessage);
}
//função para quando a promise retornar falha
function unsentMessage(error) {
    console.log(error);
    alert("Mensagem não enviada, tente novamente");
}

function sentMessage() {
    document.querySelector(".textarea").value = "";
}

//funções da sidebar
//abrir a sidebair ao clocar no icone do topo
function showSidebar() {
    const sidebar = document.querySelector(".container-sidebar");
    sidebar.classList.remove("hidden");

    visibleUsers();
    //O site deve obter a lista de participantes assim que entra no chat e deve atualizar a lista a cada 10 segundos
    setInterval(visibleUsers, 10000);
}

//fechar a sidbar ao clicar no fundo preto
function closeSidebar() {
    const close = document.querySelector(".container-sidebar");
    close.classList.add("hidden");
}


function visibleUsers() {
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants");
    promise.then(usersToTalk);
    promise.catch((error)=> console.log(error));
}

function usersToTalk(element) {
    const talkOption = document.querySelector(".all");
    talkOption.classList.add("chosed");

    // const checkMark = document.querySelector(".check-mark");
    // checkMark.classList.remove("hidden");


    // talkOption.innerHTML = `
    // <div class="users public-chat chosed" onclick="messageTo(this)">
    // <div>
    //     <img src="images\\Vector.png">
    //     <span>Todos</span>
    // </div>  
    // 
    // `
    for (let i = 0; i < element.data.length; i++) {
        talkOption.innerHTML += `
        <div class="users" onclick="messageTo(this)">
        <div>
            <img src="images\\Vector 2.png">
            <span>${element.data[i].name}</span>
        </div>  
        
        </div>        
        `
    }//<img class="check-mark" src="images\\check_mark.png">
}

function reloadSidebarUsers() {
    const username = document.querySelector(".username-box").value; //pega o valor digitado na caixa de texto
    const usernameObject = { name: username };

    const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", usernameObject);
}

function messageTo(element) {

    const userChosed = document.querySelector(".users .chosed");

    if (userChosed !== null) {
        userChosed.classList.remove("chosed");
    }
    else {
        element.classList.add(".users .chosed");

        recipient = element.querySelector(".users span").innerHTML;

    }
}

function visibility(element) {
    const chosedUser = document.querySelector(".visibility .chosed")

    if (chosedUser !== null) {
        chosedUser.classList.remove("chosed");
    } else {
        element.classList.add("chosed");
    }

    const privateMessage = document.querySelector(".visibility .chosed .private-chat");
    const publicMessage = document.querySelector(".visibolity .chosed .public-chat");

    if (privateMessage !== null) {
        messageStatus = "private-chat";
    }
    else if (publicMessage !== null) {
        messageStatus = "messages-default-style";

    }
}
//Não está sendo chamada ainda
function textInput() {
    const text = document.querySelector(".text-messages p");

    if (messageStatus === "messages-default-style") {
        text.innerHTML = `
        Enviando mensagem para ${recipient}
        `;
    }
    else if (messageStatus === "private-chat") {
        text.innerHTML = `
        Enviando mensagem para ${recipient}
    `
    }
}