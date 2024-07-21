export const generateCartErrorInfo = (cart) => {
    return `One or more properties of the cart are incomplete or invalid.
    List of required properties:
    * products: needs to be an Array, received ${cart.products}`;
};