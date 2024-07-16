export const generateTicketErrorInfo = (ticket) => {
    return `Una o varias propiedades del ticket están incompletas o no son válidas.
    Lista de propiedades requeridas:
    * amount: necesita ser un Número, recibido ${ticket.amount}
    * purchaser: necesita ser un String, recibido ${ticket.purchaser}`;
};