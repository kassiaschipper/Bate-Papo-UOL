//Usuário precisa se identificar para entrar na sala - podendo ou não ter seu usuário permitido
function joinChatRoom() {
    // alert("teste");

    const username = document.querySelector(".username-box").value; //pega o valor digitado na caixa de texto
    const usernameObject = { name: username };

    const promisse = axios.post("https://mock-api.driven.com.br/api/v6/uol[/participants](https://mock-api.bootcamp.respondeai.com.br/api/v2/uol/participants", usernameObject);
    promisse.then(enterChatRoom)//se nome ok, entra na sala 
    promisse.catch(askNewName)//se nome não ok pede outro nome
    console.log(promisse);

}

// função que verifica o erro e solicita novo nome
function askNewName(error) { 
    // alert("erro");
    const error = error.response.status;
    if (error === 400) {
        alert("Esse nome já existe na sala, escolha outro!");
        window.location.reload();
    }
}


// function sendMessege(){
//     alert("teste");
// }