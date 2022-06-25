let recipient = "Todos";
let messageStatus = "message";

//Usuário precisa se identificar para entrar na sala - podendo ou não ter seu usuário permitido
function joinChatRoom() {
    // alert("teste");

    const username = document.querySelector(".username-box").value; //pega o valor digitado na caixa de texto
    const usernameObject = { name: username };

    const promisse = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", usernameObject);
    promisse.then(enterChatRoom)//se nome ok, entra na sala 
    promisse.catch(askNewName)//se nome não ok pede outro nome
    console.log(promisse);

}

// função que verifica o erro e solicita novo nome
function askNewName(error) { 
    alert("erro");
    const error = error.response.status;
    if (error === 400) {
        alert("Esse nome já existe na sala, escolha outro!");
        window.location.reload();
    }
}

//função que permite a entarda do usuário na sala de bate papo e esconde tela de entrada
function enterChatRoom() {
    //alert("Nome mara");
    //esconde tela 
    const hideLoginArea = document.querySelector(".hide-login-area");
    hideLoginArea.classList.add("hidden");
    //mostra tela do bate papo 
    const chatRoomContainer = document.querySelector(".container").classList.add("hidden");
    
    //mostra as mensagens 
    showMessages();
    //recarrega as mensagens
    reloadMessages();
    //Enquanto o usuário estiver na sala, a cada 5 segundos o site deve avisar ao servidor que o usuário ainda está presente, ou senão será considerado que "Saiu da sala"
    refreshOnlineUser();
}

function showMessages(){
    const promisse = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promisse.then(loadMessages);
    
    //scrola as memsagens 
    const scroll = document.querySelector(".messages-container");
    scroll.scrollIntoView();
    
}
//função para carregar as mensagens
function loadMessages(element){

    let messages = document.querySelector(".messages-container");
    
    for(let i; i < element.data.length; i++){

        if(element.data[i].type === "status"){
            messages.innerHTML +=`
            <div class="messages-default-style room-entry-message">
                <span class="text-color-gray">(${element.data[i].time})</span>
                <span class="bold-text">)${element.data[i].from}<span>
                <span>${element.data[i].text}<span>  
            </div>
            `
        }
        if(element.data[i].type === "private_message"){
            const username = document.querySelector(".username-box").value;
           
            if(element.data[i].to === username || element.data[i].to === "Todos" 
            || element.data[i].from === username){
            messages.innerHTML +=`
            <div class="messages-default-style private-message">
                <span class="text-color-gray">(${element.data[i].time})</span>
                <span class="bold-text">)${element.data[i].from}<span>
                <span>reservadamente para</span>
                <span>${element.data[i].text}<span>  
            </div>
            `}
        }else{
            messages.innerHTML +=`
            <div class="messages-default-style public-message">
                <span class="text-color-gray">(${element.data[i].time})</span>
                <span>para</span>
                <span class="bold-text">)${element.data[i].from}<span>
                <span>${element.data[i].text}<span>  
            </div>            
            `
        }
        
    }

}
function reloadMessages(){
    //atualiza a pagina de 3s em 3s
    setInterval(showMessages, 3000);
}

//Manda o nome do usuário para o servidor
function onlineUser(){
    const username = document.querySelector(".username-box").value;
    const usernameObject = {name: username};
    axios.post("https://mock-api.driven.com.br/api/v6/uol[/participants](https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants", usernameObject);

}

//atualiza o nome do usuario no servidor a cada 5s
function refreshOnlineUser(){
    setInterval(onlineUser,5000);
}


function sendMessage(){
    const message = document.querySelector(".textarea").value;
    const username = document.querySelector(".username-box").value;
    const newMessageObject = {
        from: username,
        to: recipient,
        text: message,
        type: messageStatus
    }

    const promisse = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages",newMessageObject);
    promisse.catch();
    promisse.then(loadMessages);
}
