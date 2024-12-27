import { configureStore } from '@reduxjs/toolkit'
import authSlice from '../features/auth/AuthSlice'
import postSlice from '../features/post/PostSlice.jsx'


export const store = configureStore({
    reducer: {
        authSlice,
        postSlice,
    }
})