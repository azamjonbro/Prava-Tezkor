import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface TicketAnswerI {
  lotin: string;
  rus: string;
  krill: string;
}

export interface SavedTicketI {
  id: number;
  imgUrl: string;
  questions: {
    lotin: string;
    rus: string;
    krill: string;
  };
  answers: TicketAnswerI[];
  currentAnswer: number;
  izoh: {
    lotin: string;
    rus: string;
    krill: string;
  };
}

const initialState: SavedTicketI[] = [];

const SavedTicketSlice = createSlice({
  name: "saved_tickets",
  initialState,
  reducers: {
    addTicketToSaved: (state, action: PayloadAction<SavedTicketI>) => {
      state.push(action.payload);
      return state;
    },
    removeTicketFromSaved: (
      state,
      action: PayloadAction<{ ticketId: number }>
    ) => {
      state = state.filter((i) => i.id !== action.payload.ticketId);

      return state;
    },
    setSavedTickets: (_, action: PayloadAction<SavedTicketI[]>) =>
      action.payload,
  },
});

export const { addTicketToSaved, removeTicketFromSaved, setSavedTickets } =
  SavedTicketSlice.actions;
export default SavedTicketSlice.reducer;
