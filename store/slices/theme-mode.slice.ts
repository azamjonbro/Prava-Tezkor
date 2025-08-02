import { createSlice } from "@reduxjs/toolkit";

const ThemeModeSlice = createSlice({
    name:"ThemeModeSlice",
    initialState: true,
    reducers:{
        setTheme: (state,{payload})=>{
            state = payload
            return state
        }
    }
})

export const {setTheme} = ThemeModeSlice.actions
export default ThemeModeSlice.reducer