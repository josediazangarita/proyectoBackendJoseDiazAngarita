export const generateCartErrorInfo = (cart) => {
    return `Una o varias propiedades del carrito están incompletas o no son válidas.
    Lista de propiedades requeridas:
    * productos: necesita ser un Array, recibido ${cart.products}`;
};