// Conectar al servidor de sockets
const socket = io();
socket.on('connect', () => {
    console.log('Conectado al servidor de sockets');
});

socket.on('statusError', data => {
    console.log(data);
    alert(data);
});

// Manejar el evento 'productList' emitido desde el servidor de sockets
function handleProductList(data) {
    const productList = document.getElementById('productList');
    productList.innerHTML = '';

    data.forEach(product => {
        const listItem = document.createElement('li');

        // Crear elemento para el título
        const titleElement = document.createElement('h3');
        titleElement.textContent = product.title;
        listItem.appendChild(titleElement);

        // Crear elemento para la descripción
        const descriptionElement = document.createElement('p');
        descriptionElement.textContent = product.description;
        listItem.appendChild(descriptionElement);

        // Botón de eliminar
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.addEventListener('click', () => {
            console.log('Clic en botón de eliminar:', product._id);
            socket.emit('deleteProduct', product._id);
        });

        listItem.appendChild(deleteButton);
        productList.appendChild(listItem);
    });
}

// Manejar el evento 'productList' emitido desde el servidor de sockets
socket.on('productList', handleProductList);

// Elimina el producto con deletedProductId de la lista de productos
socket.on('productDeleted', function (deletedProductId) {
    // Obtén la lista de productos
    const productList = document.getElementById('productList');

    // Busca el producto con el ID deletedProductId en la lista de productos
    const productToDelete = Array.from(productList.children).find(product => product.dataset.id === deletedProductId);

    // Si se encontró el producto, elimínalo de la lista
    if (productToDelete) {
        productList.removeChild(productToDelete);
    }
});


// Manejar el envío del formulario para crear un nuevo producto
const productForm = document.getElementById('productForm');
productForm.addEventListener('submit', (event) => {
    event.preventDefault();

    // Obtener los datos del formulario
    const formData = new FormData(productForm);
    const newProduct = {
        title: formData.get('title'),
        description: formData.get('description'),
        code: formData.get('code'),
        price: formData.get('price'),
        stock: formData.get('stock'),
        category: formData.get('category'),
    };

    // Enviar los datos del nuevo producto al servidor a través de WebSocket
    socket.emit('createProduct', newProduct);

    // Limpiar el formulario después de enviar los datos
    productForm.reset();
});
