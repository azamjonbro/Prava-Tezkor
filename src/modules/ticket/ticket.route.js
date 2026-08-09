import { Router } from "express";
import IsAdminMiddlware from "../../middlewares/is_admin.middleware.js";
import {
  CreateTikcet,
  deleteTicketById,
  getRandomTickets,
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

const TicketRouter = Router();

TicketRouter.post(
  "/create",
  authMiddleware,
  IsAdminMiddlware,
  upload.single("imgUrl"),
  CreateTikcet
);

TicketRouter.get("/findall", authMiddleware, getTickets);
TicketRouter.get("/summary", authMiddleware, getTicketSummary);
TicketRouter.get("/random", authMiddleware, getRandomTickets);
TicketRouter.get("/search", authMiddleware, searchTickets);
TicketRouter.get("/group/:groupId", authMiddleware, getTicketGroup);
TicketRouter.get("/find/:id", authMiddleware, getTicketById);
TicketRouter.post("/:id/report", authMiddleware, reportTicket);

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
