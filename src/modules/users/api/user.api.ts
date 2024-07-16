//TODO: API FOR User

import baseAxios from "@/api/base.api";
import { CreateUserDto, UpdateUserDto, UserQueryParams } from "../type/user.type";

export const getListUser = async (params: UserQueryParams) => {
  const res = await baseAxios.get("/users", { params });
  return res.data;
};

export const createUser = async (payload: CreateUserDto) => {
  const res = await baseAxios.post("/users", payload);
  return res.data;
};

export const updateUser = async (id: number, payload: UpdateUserDto) => {
  const res = await baseAxios.patch(`/users/${id}`, payload);
  return res.data;
};

export const deleteUser = async (id: number) => {
  const res = await baseAxios.delete(`/users/${id}`);
  return res.data;
};

export const getUserDetail = async (params: { id: number }) => {
  const res = await baseAxios.get(`/users/${params.id}`);
  return res.data;
};
