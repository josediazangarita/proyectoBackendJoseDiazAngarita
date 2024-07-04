class CartDTO {
    constructor(cart) {
        this.id = cart._id;
        this.products = cart.products.map(product => ({
            productId: product.product,
            quantity: product.quantity
        }));
    }
}

export default CartDTO;