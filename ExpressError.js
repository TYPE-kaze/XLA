class ExpressError extends Error {
    message;
    statusCode;
    constructor(statusCode, message) {
        super()
        // Object.setPrototypeOf(this, ExpressError.prototype);
        this.statusCode = statusCode
        this.message = message
    }
}

module.exports = ExpressError