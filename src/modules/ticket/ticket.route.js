import { Router } from "express";
import IsAdminMiddlware from "../../middlewares/is_admin.middleware.js";
import {
  CreateTikcet,
  checkAnswer,
  deleteTicketById,
  dismissReport,
  getRandomTickets,
  getReportedTickets,
  getTicketById,
  getTicketGroup,
  getTickets,
  getTicketSummary,
  reportTicket,
  searchTickets,
  updateTicketById,
} from "./ticket.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import upload from "../../configs/multer.js";
import { ticketReadLimiter } from "../../middlewares/rateLimiter.middleware.js";

const TicketRouter = Router();

TicketRouter.post(
  "/create",
  authMiddleware,
  IsAdminMiddlware,
  upload.single("imgUrl"),
  CreateTikcet
);

TicketRouter.get("/findall", authMiddleware, ticketReadLimiter, getTickets);
TicketRouter.get("/summary", authMiddleware, getTicketSummary);
TicketRouter.get("/random", authMiddleware, ticketReadLimiter, getRandomTickets);
TicketRouter.get("/search", authMiddleware, ticketReadLimiter, searchTickets);
TicketRouter.get("/group/:groupId", authMiddleware, ticketReadLimiter, getTicketGroup);
TicketRouter.get("/find/:id", authMiddleware, ticketReadLimiter, getTicketById);
TicketRouter.post("/:id/report", authMiddleware, reportTicket);
TicketRouter.post("/:id/check", authMiddleware, checkAnswer);
TicketRouter.get("/reported", authMiddleware, IsAdminMiddlware, getReportedTickets);
TicketRouter.put("/:id/dismiss-report", authMiddleware, IsAdminMiddlware, dismissReport);

TicketRouter.put(
  "/update/:id",
  authMiddleware,
  IsAdminMiddlware,
  upload.single("imgUrl"),
  updateTicketById
);

TicketRouter.delete(
  "/delete/:id",
  authMiddleware,
  IsAdminMiddlware,
  deleteTicketById
);

export default TicketRouter;
