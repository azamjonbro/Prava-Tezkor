import { configureStore } from "@reduxjs/toolkit";
import theme_mode from "./slices/theme-mode.slice";
import language from "./slices/language.slice";
import {  MainTicketI } from "./slices/ticket.slice";
import tickets from "./slices/ticket.slice";
import pro from './slices/pro.slice'
import { SavedTicketI } from "./slices/saved_tickets.slice";
import savedTicket from './slices/saved_tickets.slice'

export interface StoreI {
  theme_mode: boolean;
  language: string;
  tickets: MainTicketI
  pro:  boolean
  savedTicket:SavedTicketI[]
}

export const store = configureStore<StoreI>({
  reducer: {
    theme_mode,
    language,
    tickets,
    pro,
    savedTicket
  },
});
