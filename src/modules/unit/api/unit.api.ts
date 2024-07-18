import baseAxios from "@/api/base.api";
import {
  CreateUnitDto,
  UnitQueryParams,
  UpdateUnitDto,
} from "@/modules/unit/type/unit.type";

export const getListUnit = async (params?: UnitQueryParams) => {
  const res = await baseAxios.get("/unit", { params });
  return res.data;
};

export const createUnit = async (payload: CreateUnitDto) => {
  const res = await baseAxios.post("/unit", payload);
  return res;
};

export const updateUnit = async (id: number, payload: UpdateUnitDto) => {
  const res = await baseAxios.patch(`/unit/${id}`, payload);
  return res;
};

export const deleteUnit = async (id: number) => {
  const res = await baseAxios.delete(`/unit/${id}`);
  return res;
};
