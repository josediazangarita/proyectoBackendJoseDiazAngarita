document.getElementById('registerForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const userData = {
        first_name: document.getElementById('first_name').value,
        last_name: document.getElementById('last_name').value,
        email: document.getElementById('email').value,
        age: document.getElementById('age').value,
        password: document.getElementById('password').value,
    };

    try {
        const response = await fetch('/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error:', errorData);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                html: `<p>${errorData.modalMessage}</p><p><strong>Details:</strong> ${errorData.details}</p>`
            });
            return;
        }

        Swal.fire({
            icon: 'success',
            title: 'Registration Successful',
            text: 'You have been registered successfully. Redirecting to login...',
            showConfirmButton: false,
            timer: 2000
        }).then(() => {
            window.location.href = '/login';
        });
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'An unexpected error occurred. Please try again.'
        });
    }
});