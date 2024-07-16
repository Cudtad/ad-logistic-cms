//TODO: Write type here

import { Unit } from "@/modules/unit/type/unit.type";

export type UserQueryParams = {
  page?: number;
  limit?: number;
  sort?: string;
};

export type UserListItem = {
  id: number;
  email?: string;
  name?: string;
  role?: string;
  lastLoggedIn?: Date;
  unitId?: number;
  createdAt?: Date;
  updatedAt?: Date;
  unit?: Unit;
};

export type CreateUserDto = {
  name: string;
  email: string;
  password: string;
  role: string;
  unitId: number;
};

export type UpdateUserDto = {
  name: string;
  unitId: number;
};
