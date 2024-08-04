document.addEventListener('DOMContentLoaded', (event) => {
    const socket = io();

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
                socket.emit('deleteProduct', product._id);
            });

            listItem.appendChild(deleteButton);
            productList.appendChild(listItem);
        });
    });

    socket.on('productDeleted', function (deletedProductId) {
        const productList = document.getElementById('productList');
        const productToDelete = Array.from(productList.children).find(product => product.dataset.id === deletedProductId);

        if (productToDelete) {
            productList.removeChild(productToDelete);
        }
    });

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
            socket.emit('deleteProduct', newProduct._id);
        });

        listItem.appendChild(deleteButton);
        productList.appendChild(listItem);
    });

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

    socket.on('deleteError', function (errorMessage) {
        Swal.fire({
            icon: 'error',
            title: 'No creaste este producto',
            text: errorMessage,
        });
    });

    socket.on('cartError', function (errorMessage) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: errorMessage,
        });
    });
});
