import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import { login,  signup, } from './AuthApi'
import Cookies from "js-cookie";

const initialState={
    userInfo: Cookies.get("userInfo") ? JSON.parse(Cookies.get("userInfo")) : null,
    status:"idle",
    errors: null,
    signupStatus:"idle",
    signupError:null,
    loginStatus:"idle",
    loginError:null,
    loggedInUser:null,
    successMessage:null,
}


export const signupAsync=createAsyncThunk('auth/signupAsync',async(cred)=>{
    const res=await signup(cred)
    Cookies.set("userInfo", JSON.stringify(res.user), { expires: 1 });
    return res
})

export const loginAsync=createAsyncThunk('auth/loginAsync',async(cred)=>{
    const res=await login(cred)
    Cookies.set("userInfo", JSON.stringify(res.user), { expires: 1 });
    return res
})

const authSlice=createSlice({
    name:"authSlice",
    initialState:initialState,
    reducers:{
        clearAuthSuccessMessage:(state)=>{
            state.successMessage=null
        },
        clearAuthErrors:(state)=>{
            state.errors=null
        },
        resetAuthStatus:(state)=>{
            state.status='idle'
        },
        resetSignupStatus:(state)=>{
            state.signupStatus='idle'
        },
        clearSignupError:(state)=>{
            state.signupError=null
        },
        resetLoginStatus:(state)=>{
            state.loginStatus='idle'
        },
        clearLoginError:(state)=>{
            state.loginError=null
        },
        logout: (state) => {
            state.userInfo = null;
            state.loggedInUser = null;
            Cookies.remove("userInfo"); 
        }
      
        
    },
    extraReducers:(builder)=>{
        builder
            .addCase(signupAsync.pending,(state)=>{
                state.signupStatus='pending'
            })
            .addCase(signupAsync.fulfilled,(state,action)=>{
                state.signupStatus='fullfilled'
                state.loggedInUser=action.payload
                state.userInfo = action.payload.user; 
            })
            .addCase(signupAsync.rejected,(state,action)=>{
                state.signupStatus='rejected'
                state.signupError = action.error.message; 
            })

            .addCase(loginAsync.pending,(state)=>{
                state.loginStatus='pending'
            })
            .addCase(loginAsync.fulfilled,(state,action)=>{
                state.loginStatus='fullfilled'
                state.loggedInUser=action.payload
                state.userInfo = action.payload.user; 
            })
            .addCase(loginAsync.rejected,(state,action)=>{
                state.loginStatus='rejected'
                state.loginError=action.error.message
            })       
    }
})

export const selectSignupStatus=(state)=>state.authSlice.signupStatus
export const selectSignupError=(state)=>state.authSlice.signupError
export const selectLoginStatus=(state)=>state.authSlice.loginStatus
export const selectLoginError=(state)=>state.authSlice.loginError
export const selectLoggedInUser=(state)=>state.authSlice.loggedInUser
export const selectUserInfo = (state) => state.authSlice.userInfo;

export const {clearAuthSuccessMessage,logout, clearAuthErrors,resetAuthStatus, resetSignupStatus,clearSignupError,resetLoginStatus, clearLoginError}=authSlice.actions

export default authSlice.reducer
