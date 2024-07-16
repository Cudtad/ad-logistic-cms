import baseAxios from "@/api/base.api";
import { ZoneQueryParams } from "../type/zone.type";

export const getListZone = async (params?: ZoneQueryParams) => {
  const res = await baseAxios.get("/zones", { params });
  return res.data;
};
