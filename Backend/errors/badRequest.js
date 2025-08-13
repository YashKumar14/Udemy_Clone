const CustomApiError = require("./customError");
const { StatusCodes } = require("http-status-codes");

class BadRequest extends CustomApiError {
  constructor(message) {
    super(message);
    this.statuscode = StatusCodes.BAD_REQUEST;
  }
}

module.exports = BadRequest;
