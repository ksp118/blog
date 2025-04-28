const { v4: uuidv4 } = require("uuid");

// UUID를 바이너리 형식으로 변환
function uuidToBinary(uuid) {
  if (!uuid) return null;
  return Buffer.from(uuid.replace(/-/g, ""), "hex");
}

// 바이너리를 UUID 형식으로 변환
function binaryToUuid(binary) {
  if (!binary) return null;
  const hex = binary.toString("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(
    12,
    16
  )}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

module.exports = {
  uuidToBinary,
  binaryToUuid,
  v4: uuidv4,
};
