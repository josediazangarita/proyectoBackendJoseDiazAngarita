document.addEventListener('DOMContentLoaded', (event) => {
    const socket = io();

    const cartIdElement = document.getElementById('cart-id');
    if (!cartIdElement) {
        console.error('Cart ID not found in DOM');
        return;
    }

    const cartId = cartIdElement.value;
    console.log(`Cart ID: ${cartId}`);

    // Función para actualizar el contador del carrito
    function updateCartCounter(count) {
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            if (count > 0) {
                cartCount.textContent = count;
                cartCount.style.display = 'inline'; 
            } else {
                cartCount.style.display = 'none'; 
            }
        }
    }

    // Agregar producto al carrito
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.dataset.productId;
            console.log(`Product ID: ${productId}`);

            fetch(`/api/carts/${cartId}/products/${productId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ quantity: 1 })
            })
            .then(response => response.json())
            .then(data => {
                console.log('Producto agregado al carrito:', data);
                Swal.fire({
                    icon: 'success',
                    title: 'Producto agregado al carrito',
                    showConfirmButton: false,
                    timer: 1500
                });
                updateCartCounter(data.products.length);
            })
            .catch(error => {
                console.error('Error al agregar producto al carrito:', error);
            });
        });
    });

    // Eliminar producto del carrito
    document.querySelectorAll('.remove-from-cart-btn').forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.dataset.productId;
            console.log(`Remove Product ID: ${productId}`);

            fetch(`/api/carts/${cartId}/products/${productId}`, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {
                console.log('Producto eliminado del carrito:', data);
                Swal.fire({
                    icon: 'success',
                    title: 'Producto eliminado del carrito',
                    showConfirmButton: false,
                    timer: 1500
                });
                updateCartCounter(data.products.length);
                updateCartView(data); // Actualizar la vista del carrito
            })
            .catch(error => {
                console.error('Error al eliminar producto del carrito:', error);
            });
        });
    });

    const checkoutButton = document.getElementById('checkout-btn');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            console.log('Finalizar compra');
            fetch(`/api/carts/${cartId}/purchase`, {
                method: 'POST'
            })
            .then(response => response.json())
            .then(data => {
                console.log('Compra finalizada:', data);
                if (data.ticket && data.ticket._id) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Compra finalizada',
                        showConfirmButton: false,
                        timer: 1500
                    }).then(() => {
                        window.location.href = `/ticket/${data.ticket._id}`;
                    });
                } else {
                    Swal.fire({
                        icon: 'info',
                        title: data.message,
                    });
                }
            })
            .catch(error => {
                console.error('Error al finalizar la compra:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error al finalizar la compra',
                    text: error.message,
                });
            });
        });
    }

    // Función para obtener los datos completos de los productos
    async function fetchProductDetails(productId) {
        const response = await fetch(`/api/products/${productId}`);
        const data = await response.json();
        return data.payload;
    }

    // Función para actualizar la vista del carrito con datos completos
async function updateCartView(cart) {
    const cartList = document.getElementById('cartList');
    const totalAmountElement = document.getElementById('totalAmount');
    cartList.innerHTML = '';
    let totalAmount = 0;

    for (const item of cart.products) {
        const productDetails = await fetchProductDetails(item.product);
        console.log('Product data:', productDetails);

        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <h3>${productDetails.title}</h3>
            <p>Precio: $${productDetails.price}</p>
            <p>Cantidad: ${item.quantity}</p>
            <button class="remove-from-cart-btn" data-product-id="${item.product}">Eliminar</button>
        `;
        cartList.appendChild(listItem);
        totalAmount += productDetails.price * item.quantity;
    }

    totalAmountElement.textContent = `Total: $${totalAmount}`;

        // Asignar eventos de clic para los nuevos botones de eliminar producto
        cartList.querySelectorAll('.remove-from-cart-btn').forEach(button => {
            button.addEventListener('click', () => {
                const productId = button.dataset.productId;
                console.log(`Remove Product ID: ${productId}`);

                fetch(`/api/carts/${cartId}/products/${productId}`, {
                    method: 'DELETE'
                })
                .then(response => response.json())
                .then(data => {
                    console.log('Producto eliminado del carrito:', data);
                    Swal.fire({
                        icon: 'success',
                        title: 'Producto eliminado del carrito',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    updateCartCounter(data.products.length);
                    updateCartView(data);
                })
                .catch(error => {
                    console.error('Error al eliminar producto del carrito:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error al eliminar producto del carrito',
                        text: error.message,
                    });
                });
            });
        });
    }

    // Obtener el conteo de productos al cargar la página
    fetch(`/api/carts/${cartId}`)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        updateCartCounter(data.products.length);
    })
    .catch(error => {
        console.error('Error al obtener el conteo de productos del carrito:', error);
    });
});