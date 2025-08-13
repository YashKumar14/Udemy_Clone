const { customApiError } = require("../errors");
const { StatusCodes } = require("http-status-codes");

const errorHandlerMiddleware = (err, req, res, next) => {
  if (err instanceof customApiError) {
    return res.status(err.statuscode).json({ msg: err.message });
  }
  console.log(err);
  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .send("Something went wrong try again later");
};

module.exports = errorHandlerMiddleware;
