import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type LanguageType = "lotin" | "rus" | "krill";

const initialState = "lotin";

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage: (_, action: PayloadAction<LanguageType>) => action.payload,
  },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
