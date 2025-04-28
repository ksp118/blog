const { v4 } = require("uuid");

function uuidToBinary(uuid) {
  return Buffer.from(uuid.replace(/-/g, ""), "hex");
}

function binaryToUuid(bin) {
  const uuid = bin.toString("hex");
  return `${uuid.substring(0, 8)}-${uuid.substring(8, 12)}-${uuid.substring(
    12,
    16
  )}-${uuid.substring(16, 20)}-${uuid.substring(20)}`;
}

module.exports = { uuidToBinary, binaryToUuid, v4 };
