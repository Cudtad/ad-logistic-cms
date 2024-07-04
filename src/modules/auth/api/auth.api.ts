import baseAxios from "@/api/base.api";
import { User } from "../type/auth.type";

type AuthBody = {
  email: string;
  password: string;
};

export const login = (data: AuthBody) => {
  return baseAxios.post("/auth/login", data);
};

export const logout = () => {
  return baseAxios.post("/auth/logout");
};

export const getMe = async () => {
  const res = await baseAxios.get<User>('/users/me')
  return res.data
}