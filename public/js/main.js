const socket = io()

let username = ''
let userList = []
let submit = document.querySelector('.submit')
submit.addEventListener('click', ()=>{
    username = document.querySelector('.email').value
    socket.emit('join-request', username)
})
