import { axiosi } from "../../config/axios.js"



export const signup=async(cred)=>{
    try {
        const res=await axiosi.post("auth/signup",cred)
        
        return res.data
    } catch (error) {
        throw error.response?.data?.error;
    }
}
export const login=async(cred)=>{
    try {
        const res=await axiosi.post("auth/signin",cred)
        return res.data
    } catch (error) {
        throw error.response?.data?.error;
    }
}