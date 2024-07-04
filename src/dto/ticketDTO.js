class TicketDTO {
    constructor({ code, purchase_datetime, amount, purchaser }) {
        this.code = code;
        this.purchaseDatetime = purchase_datetime;
        this.amount = amount;
        this.purchaser = purchaser;
    }
}

export default TicketDTO;