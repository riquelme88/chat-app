const socket = io()

let chatInput = document.querySelector('.chatInput')

let username = ''
let userList = []

function renderList() {
    let ul = document.querySelector('.users')
    ul.innerHTML = ''

    userList.forEach(li=>{
        ul.innerHTML += `<li>${li}</li>`
    })
}

function addMessage (type,user,msg) {
    let chatUl = document.querySelector('.chatList')

    switch(type){
        case 'status' :
            chatUl.innerHTML += `<li class = 'system-txt'> ${msg}</li>`
            break;
        case 'msg' : 
            chatUl.innerHTML += `<li class = 'm-txt'><span>${user}</span> ${msg}</li>`
            break;
        case 'msg-me' : 
            chatUl.innerHTML += `<li class = 'msg-me'><span>${user}</span> ${msg}</li>`
            break;
    }
}

chatInput.addEventListener('keyup', (e)=>{
    if(e.key == 'Enter'){
        let mensagem = chatInput.value.trim()
        chatInput.value = ''
        if(mensagem != ''){
            socket.emit('send-message', mensagem)
        }
    }
})

socket.on('user-ok', (data)=>{
    userList = data.list;
    addMessage('status', null, 'conectado!')
    renderList()
})

socket.on('list-update', (data)=>{
    if(data.joined){
        addMessage('status', null , data.joined + ' entrou no chat.')
    }
    if(data.left){
        addMessage('status', null , data.left + ' saiu do chat.')
    };
    userList = data.list;
    username = data.joined
    renderList()
})

socket.on('show-message', (obj)=>{
    addMessage('msg', obj.username, obj.message)
})

socket.on('show-message-me', (obj)=>{
    addMessage('msg-me', obj.username, obj.message)
})

socket.on('disconnect', ()=>{
    addMessage('status', null, 'Desconectado...')
    userList = []
    renderUserList();
})

socket.on('connect_error', () => {
    addMessage('status', null, 'Tentando reconectar...');
});

socket.on('connect', ()=>{
    addMessage('status', null, 'Reconectado');
    if(username){
        socket.emit('join-request', username)
    }
})