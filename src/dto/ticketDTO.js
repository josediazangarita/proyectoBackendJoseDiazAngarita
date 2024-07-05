class TicketDTO {
    constructor({ _id, code, purchase_datetime, amount, purchaser }) {
        this._id = _id;
        this.code = code;
        this.purchaseDatetime = purchase_datetime;
        this.amount = amount;
        this.purchaser = purchaser;
    }
}

export default TicketDTO;