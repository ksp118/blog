const crypto = require("crypto");
const util = require("util");

const scryptAsync = util.promisify(crypto.scrypt);

async function hashPassword(pw) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hashKey = await scryptAsync(pw, salt, 64);
  return `${salt}:${hashKey.toString("hex")}`;
}

async function verifyPassword(inPw, dbPw) {
  const [salt, hash] = dbPw.split(":");
  const inHashKey = await scryptAsync(inPw, salt, 64);

  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), inHashKey);
}

module.exports = { hashPassword, verifyPassword };
