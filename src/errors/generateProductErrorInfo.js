export const generateProductErrorInfo = (product) => {
    return `Una o varias propiedades del producto están incompletas o no son válidas.
    Lista de propiedades requeridas:
    * title: necesita ser un String, recibido ${product.title}
    * price: necesita ser un Número, recibido ${product.price}
    * stock: necesita ser un Número, recibido ${product.stock}`;
};