import { createSlice } from "@reduxjs/toolkit";

const ProSlice = createSlice({
  name: "pro",
  initialState: false,
  reducers: {
    setPro: (_, { payload }) => {
      return payload;
    },
  },
});

export const {setPro} = ProSlice.actions
export default ProSlice.reducer