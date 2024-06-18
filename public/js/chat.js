document.addEventListener('DOMContentLoaded', (event) => {
    const socket = io();

    let user;
    let chatBox = document.getElementById('chatBox');
    let sendButton = document.getElementById('sendButton');
    let messageLogs = document.getElementById('messageLogs');

    // Alerta de bienvenida con sweetalert2
    Swal.fire({
        title: 'Bienvenido',
        input: "text",
        text: 'Ingresa un nombre de usuario para identificarte en el chat',
        inputValidator: (value) => {
            return !value && '¡Necesitas un nombre de usuario para continuar!';
        },
        allowOutsideClick: false,
    }).then(result => {
        user = result.value;
        socket.emit('login', user);
    });

    sendButton.addEventListener('click', () => {
        sendMessage();
    });

    chatBox.addEventListener('keyup', evt => {
        if (evt.key === "Enter") {
            if (chatBox.value.trim().length > 0) {
                socket.emit('message', { user: user, message: chatBox.value });
                chatBox.value = '';
            }
        }
    });

    function sendMessage() {
        if (chatBox.value.trim().length > 0) {
            socket.emit('message', { user: user, message: chatBox.value });
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
        console.log('Cliente conectado al chat de sockets');
    });

    socket.on('statusError', data => {
        console.log(data);
        alert(data);
    });
});