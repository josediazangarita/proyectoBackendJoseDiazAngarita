export const generateTicketErrorInfo = (ticket) => {
    return `One or more properties of the ticket are incomplete or invalid.
    List of required properties:
    * amount: needs to be a Number, received ${ticket.amount}
    * purchaser: needs to be a String, received ${ticket.purchaser}`;
};