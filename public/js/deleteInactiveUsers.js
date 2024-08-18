document.addEventListener('DOMContentLoaded', () => {
    const deleteInactiveUsersBtn = document.getElementById('delete-inactive-users-btn');

    deleteInactiveUsersBtn.addEventListener('click', async () => {
        const confirmDelete = confirm('¿Estás seguro de que quieres eliminar a los usuarios inactivos?');
        if (confirmDelete) {
            try {
                const response = await fetch('/api/users/inactive', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const result = await response.json();
                    alert(`Usuarios eliminados: ${result.deletedCount}`);
                    location.reload();
                } else {
                    const error = await response.json();
                    alert(`Error: ${error.message}`);
                }
            } catch (error) {
                console.error('Error al eliminar usuarios inactivos:', error);
                alert('Hubo un problema al intentar eliminar a los usuarios inactivos.');
            }
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.delete-user').forEach(link => {
        link.addEventListener('click', async (event) => {
            event.preventDefault();
            
            const userId = event.target.getAttribute('data-user-id');
            
            if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
                try {
                    const response = await fetch(`/api/users/${userId}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });

                    if (response.ok) {
                        alert('Usuario eliminado exitosamente');
                        window.location.reload();
                    } else {
                        const error = await response.json();
                        alert(`Error: ${error.message}`);
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('Error al eliminar el usuario');
                }
            }
        });
    });
});