import axiosInstance from "@/api/axios";

export const register = (data)=>{
  return axiosInstance.post("/auth/register",data)
}

export const login = (data)=>{
  return axiosInstance.post("/auth/login",data)
}