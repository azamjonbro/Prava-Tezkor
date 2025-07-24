import { api } from "./api";
import axios, { AxiosResponse } from "axios";

export const SignUp = async (): Promise<AxiosResponse<{ token: string }> | undefined> => {
  try {
    return await api.post("/api/auth/signup", {});
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Signup error:", error.response?.data || error.message);
    }
  }
};

export const GetProfile = async (token: string) => {
  try {
    return await api.get("/api/user/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Profile fetch error:", error.response?.data || error.message);
    }
  }
};
