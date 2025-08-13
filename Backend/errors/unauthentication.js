const CustomApiError = require("./customError");
const { StatusCodes } = require("http-status-codes");

class Unauthenticated extends CustomApiError {
  constructor(message) {
    super(message);
    this.statuscode = StatusCodes.UNAUTHORIZED;
  }
}

module.exports = Unauthenticated;
