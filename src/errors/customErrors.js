export default class CustomError extends Error {
    constructor(name, cause, message, code) {
        super(message);
        this.name = name;
        this.cause = cause;
        this.code = code;
    }
}