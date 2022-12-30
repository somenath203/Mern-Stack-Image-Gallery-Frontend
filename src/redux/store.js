import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "@reduxjs/toolkit";

import { userSlice } from "./userSlice";


const rootReducer = combineReducers({
    user: userSlice.reducer
});


export const store = configureStore({
    reducer: rootReducer
});