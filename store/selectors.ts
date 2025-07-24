import { useSelector } from "react-redux";
import { StoreI } from "./store";

export const useThemeMode = () =>
  useSelector(({ theme_mode }: StoreI) => theme_mode);
export const useLanguage = () =>
  useSelector(({ language }: StoreI) => language);
export const useTickets = () =>
  useSelector(({ tickets }: StoreI) => tickets.tickets);
export const usePro = () => useSelector(({ pro }: StoreI) => pro);
export const useTicketAnswers = () =>
  useSelector(({ tickets }: StoreI) => tickets.answers);
export const useMarathon = () =>
  useSelector(({ tickets }: StoreI) => tickets.marathon);
export const useSavedTickets = () =>
  useSelector(({ savedTicket }: StoreI) => savedTicket);
export const useHomeTest = () => useSelector(({tickets}:StoreI)=>tickets.home_test)