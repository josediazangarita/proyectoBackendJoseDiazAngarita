export const generateProductErrorInfo = (product) => {
    return `One or more properties of the product are incomplete or invalid.
    List of required properties:
    * ID: needs to be a valid MongoDB ObjectId.
    * title: needs to be a String, received ${typeof product.title === 'undefined' ? 'undefined' : typeof product.title}
    * price: needs to be a Number, received ${typeof product.price === 'undefined' ? 'undefined' : typeof product.price}
    * stock: needs to be a Number, received ${typeof product.stock === 'undefined' ? 'undefined' : typeof product.stock}`;
};