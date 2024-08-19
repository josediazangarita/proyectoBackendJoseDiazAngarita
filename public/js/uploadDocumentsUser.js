// Función para manejar el envío de imágenes de perfil
async function handleProfileImageSubmit(event) {
    event.preventDefault();
    const userId = document.getElementById('userId').value;
    const profileImageInput = document.getElementById('profileImage');
    
    // Validación para asegurar que el input no esté vacío
    if (!profileImageInput.files.length) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor, selecciona una imagen para cargar.'
        });
        return;
    }

    const formData = new FormData(document.getElementById('profileImageForm'));

    try {
        const response = await fetch(`/api/users/${userId}/profileImage`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error:', errorData);
            Swal.fire({
                icon: 'error',
                title: 'Ocurrió un error...',
                html: `<p>${errorData.modalMessage}</p><p><strong>Detalles:</strong> ${errorData.details}</p>`
            });
            return;
        }

        Swal.fire({
            icon: 'success',
            title: 'Imagen de Perfil Cargada',
            text: 'Tu imagen de perfil se ha cargado exitosamente.',
            showConfirmButton: false,
            timer: 2000
        });
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Ocurrió un error...',
            text: 'Ocurrió un error inesperado. Por favor, intenta de nuevo.'
        });
    }
}

// Función para resetear el input de imagen de perfil
function resetProfileImage() {
    document.getElementById('profileImage').value = '';
}

// Función para agregar un nuevo input para las imágenes de productos
function addProductImageInput() {
    const container = document.getElementById('productImagesContainer');
    const newInput = document.createElement('input');
    newInput.type = 'file';
    newInput.name = 'productImages';
    newInput.classList.add('productImageInput');
    newInput.accept = 'image/*';
    container.appendChild(newInput);
}

// Función para manejar el envío de imágenes de productos
async function handleProductImagesSubmit(event) {
    event.preventDefault();
    const userId = document.getElementById('userId').value;
    const productImageInputs = document.querySelectorAll('#productImagesContainer input[type="file"]');

    const formData = new FormData();
    productImageInputs.forEach(input => {
        if (input.files.length > 0) {
            Array.from(input.files).forEach(file => {
                formData.append('productImages', file);
            });
        }
    });

    if (formData.has('productImages')) {
        try {
            const response = await fetch(`/api/users/${userId}/productImages`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error:', errorData);
                Swal.fire({
                    icon: 'error',
                    title: 'Ocurrió un error...',
                    html: `<p>${errorData.modalMessage}</p><p><strong>Detalles:</strong> ${errorData.details}</p>`
                });
                return;
            }

            Swal.fire({
                icon: 'success',
                title: 'Imágenes Cargadas',
                text: 'Tus imágenes de productos se han cargado exitosamente.',
                showConfirmButton: false,
                timer: 2000
            });
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Si no eres premium no puedes cargar imágenes de productos.'
            });
        }
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor, selecciona al menos una imagen para cargar.'
        });
    }
}

// Función para resetear los inputs de imágenes de productos
function resetProductImages() {
    const container = document.getElementById('productImagesContainer');
    container.innerHTML = '';
    addProductImageInput();
}

// Función para manejar el envío de documentos
async function handleDocumentsSubmit(event) {
    event.preventDefault();
    const userId = document.getElementById('userId').value;
    const documentInputs = document.querySelectorAll('#documentsForm input[type="file"]');

    // Validación para asegurar que al menos un documento esté seleccionado
    const hasDocument = Array.from(documentInputs).some(input => input.files.length > 0);

    if (!hasDocument) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor, selecciona al menos un documento para cargar.'
        });
        return;
    }

    const formData = new FormData(document.getElementById('documentsForm'));

    try {
        const response = await fetch(`/api/users/${userId}/documents`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error:', errorData);
            Swal.fire({
                icon: 'error',
                title: 'Ocurrió un error...',
                html: `<p>${errorData.modalMessage}</p><p><strong>Detalles:</strong> ${errorData.details}</p>`
            });
            return;
        }

        Swal.fire({
            icon: 'success',
            title: 'Documentos Cargados',
            text: 'Tus documentos se han cargado exitosamente.',
            showConfirmButton: false,
            timer: 2000
        });
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Ocurrió un error...',
            text: 'Ocurrió un error inesperado. Por favor, intenta de nuevo.'
        });
    }
}

// Función para resetear los inputs de documentos
function resetDocuments() {
    document.getElementById('document1').value = '';
    document.getElementById('document2').value = '';
    document.getElementById('document3').value = '';
}

// Asignar eventos de envío de formularios
document.getElementById('profileImageForm').addEventListener('submit', handleProfileImageSubmit);
document.getElementById('productImagesForm').addEventListener('submit', handleProductImagesSubmit);
document.getElementById('documentsForm').addEventListener('submit', handleDocumentsSubmit);

// Asignar eventos de reset a los botones correspondientes
document.getElementById('resetProfileImage').addEventListener('click', resetProfileImage);
document.getElementById('resetProductImages').addEventListener('click', resetProductImages);
document.getElementById('resetDocuments').addEventListener('click', resetDocuments);