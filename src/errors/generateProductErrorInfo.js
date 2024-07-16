export const generateProductErrorInfo = (product) => {
    return `Una o varias propiedades del producto están incompletas o no son válidas.
    Lista de propiedades requeridas:
    * ID: necesita ser un ObjectId de MongoDB válido.
    * title: necesita ser un String, recibido ${typeof product.title === 'undefined' ? 'undefined' : typeof product.title}
    * price: necesita ser un Número, recibido ${typeof product.price === 'undefined' ? 'undefined' : typeof product.price}
    * stock: necesita ser un Número, recibido ${typeof product.stock === 'undefined' ? 'undefined' : typeof product.stock}`;
};