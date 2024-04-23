document.addEventListener('DOMContentLoaded', (event) => {
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
    socket.on('productList', function (data) {
        const productList = document.getElementById('productList');
        productList.innerHTML = '';

        data.forEach(product => {
            const listItem = document.createElement('li');
            listItem.dataset.id = product._id;

            const titleElement = document.createElement('h3');
            titleElement.textContent = product.title;
            listItem.appendChild(titleElement);

            const descriptionElement = document.createElement('p');
            descriptionElement.textContent = product.description;
            listItem.appendChild(descriptionElement);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Eliminar';
            deleteButton.addEventListener('click', () => {
                console.log('Clic en botón de eliminar:', product._id);
                socket.emit('deleteProduct', product._id);
            });

            listItem.appendChild(deleteButton);
            productList.appendChild(listItem);
        });
    });

    // Elimina el producto con deletedProductId de la lista de productos
    socket.on('productDeleted', function (deletedProductId) {
        const productList = document.getElementById('productList');
        const productToDelete = Array.from(productList.children).find(product => product.dataset.id === deletedProductId);

        if (productToDelete) {
            productList.removeChild(productToDelete);
        }
    });

    // Agrega el nuevo producto a la lista de productos
    socket.on('newProduct', function (newProduct) {
        const productList = document.getElementById('productList');
        const listItem = document.createElement('li');
        listItem.dataset.id = newProduct._id;

        const titleElement = document.createElement('h3');
        titleElement.textContent = newProduct.title;
        listItem.appendChild(titleElement);

        const descriptionElement = document.createElement('p');
        descriptionElement.textContent = newProduct.description;
        listItem.appendChild(descriptionElement);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.addEventListener('click', () => {
            console.log('Clic en botón de eliminar:', newProduct._id);
            socket.emit('deleteProduct', newProduct._id);
        });

        listItem.appendChild(deleteButton);
        productList.appendChild(listItem);
    });

    // Manejar el envío del formulario para crear un nuevo producto
    const productForm = document.getElementById('productForm');
    productForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(productForm);
        const newProduct = {
            title: formData.get('title'),
            description: formData.get('description'),
            code: formData.get('code'),
            price: formData.get('price'),
            stock: formData.get('stock'),
            category: formData.get('category'),
        };

        socket.emit('addProduct', newProduct);
        productForm.reset();
    });
});

