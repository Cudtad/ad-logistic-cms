import baseAxios from "@/api/base.api";
import { CreateUnitDto, UnitQueryParams } from "@/modules/unit/type/unit.type";

export const getListUnit = async (params?: UnitQueryParams) => {
  const res = await baseAxios.get("/unit", { params });
  return res.data;
};

export const createUnit = async (payload: CreateUnitDto) => {
  const res = await baseAxios.post("/unit", payload);
  return res;
};
