import bcrypt from "bcryptjs";

const plainPassword = "admin123";
const hash = bcrypt.hashSync(plainPassword, 10);

console.log("Hash:", hash);
