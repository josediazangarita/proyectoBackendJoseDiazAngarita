document.addEventListener('DOMContentLoaded', (event) => {
    const socket = io();

    let chatBox = document.getElementById('chatBox');
    let sendButton = document.getElementById('sendButton');
    let messageLogs = document.getElementById('messageLogs');

    // Emitir el evento de login al conectar
    socket.emit('login');

    sendButton.addEventListener('click', () => {
        sendMessage();
    });

    chatBox.addEventListener('keyup', evt => {
        if (evt.key === "Enter") {
            if (chatBox.value.trim().length > 0) {
                socket.emit('message', { message: chatBox.value });
                chatBox.value = '';
            }
        }
    });

    function sendMessage() {
        if (chatBox.value.trim().length > 0) {
            socket.emit('message', { message: chatBox.value });
            chatBox.value = '';
        }
    }

    // Sockets listeners
    socket.on('messageLogs', data => {
        let messages = data.map(message => `<div><strong>${message.user}:</strong> ${message.message}</div>`);
        messageLogs.innerHTML = messages.join('');
    });

    socket.on('userConnected', newUser => {
        Swal.fire({
            icon: 'info',
            title: 'Nuevo usuario conectado',
            text: `${newUser} se ha unido al chat`,
            toast: true,
            position: 'top-right',
            showConfirmButton: false,
            timer: 10000,
            timerProgressBar: true,
        });
    });

    socket.on('connect', () => {
    });

    socket.on('statusError', data => {
        alert(data);
    });
});