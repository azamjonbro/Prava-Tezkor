import crypto from "crypto";

const MAX_AUTH_AGE_SECONDS = 24 * 60 * 60;

// Validates Telegram Mini App initData per Telegram's documented HMAC scheme:
// https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
export function verifyTelegramInitData(initData, botToken) {
  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  if (!hash) {
    return { valid: false, user: null, reason: "Missing hash" };
  }
  params.delete("hash");

  const dataCheckString = [...params.entries()]
    .map(([key, value]) => `${key}=${value}`)
    .sort()
    .join("\n");

  const secretKey = crypto.createHmac("sha256", "WebAppData").update(botToken).digest();
  const computedHash = crypto.createHmac("sha256", secretKey).update(dataCheckString).digest("hex");

  if (computedHash !== hash) {
    return { valid: false, user: null, reason: "Signature mismatch" };
  }

  const authDate = Number(params.get("auth_date"));
  if (authDate && Date.now() / 1000 - authDate > MAX_AUTH_AGE_SECONDS) {
    return { valid: false, user: null, reason: "Stale auth_date" };
  }

  const userRaw = params.get("user");
  if (!userRaw) {
    return { valid: false, user: null, reason: "Missing user" };
  }

  try {
    const user = JSON.parse(userRaw);
    return { valid: true, user };
  } catch {
    return { valid: false, user: null, reason: "Malformed user JSON" };
  }
}
