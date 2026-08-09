function generateInviteCode() {
  return Math.floor(Math.random() * 1e15).toString();
}

export { generateInviteCode };
