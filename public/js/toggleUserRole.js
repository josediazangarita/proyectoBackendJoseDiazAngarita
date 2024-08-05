document.querySelectorAll('.toggle-role-btn').forEach(button => {
    button.addEventListener('click', () => {
        const userId = button.dataset.userId;
        const currentRole = button.dataset.userRole;

        fetch(`/api/users/premium/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                button.dataset.userRole = data.newRole;
                button.textContent = `Cambiar Rol (Actual: ${data.newRole})`;

                Swal.fire({
                    icon: 'success',
                    title: 'Rol de usuario actualizado',
                    text: `El rol de usuario se cambió a ${data.newRole}`,
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data.message || 'No se pudo cambiar el rol del usuario.',
                });
            }
        })
        .catch(error => {
            console.error('Error al cambiar el rol del usuario:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ocurrió un error al intentar cambiar el rol del usuario.',
            });
        });
    });
});