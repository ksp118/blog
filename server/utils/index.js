const { uuid } = require("./uuid");
const { password } = require("./password");

module.exports = {
  ...uuid,
  ...password,
};
