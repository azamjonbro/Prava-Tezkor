const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function generateDuelCode(length = 6) {
  let code = "";
  for (let i = 0; i < length; i++) {
    code += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return code;
}

export { generateDuelCode };
