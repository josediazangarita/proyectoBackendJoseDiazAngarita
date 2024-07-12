class CartDTO {
    constructor(cart) {
        this.id = cart._id;
        this.products = cart.products.map(item => ({
            product: item.product,
            quantity: item.quantity
        }));
    }
}

export default CartDTO;