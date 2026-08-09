import rateLimit from "express-rate-limit";

const TOO_MANY_MESSAGE = { success: false, message: "Juda ko'p so'rov yuborildi, birozdan keyin qayta urinib ko'ring" };

// Generous — covers normal app usage across every /api route.
export const apiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: TOO_MANY_MESSAGE,
});

// Tighter — applied on top of apiLimiter for the endpoints that return
// whole batches of question content, so a script can't page through the
// entire question bank in one burst.
export const ticketReadLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: TOO_MANY_MESSAGE,
});
