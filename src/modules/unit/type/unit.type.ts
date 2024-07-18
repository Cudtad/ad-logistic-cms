export type UnitQueryParams = {
  page?: number;
  limit?: number;
  sort?: string;
  q?: string;
  zoneIds?: number;
};

export type Unit = {
  id: number;
  name: string;
  code: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
  zones: any;
  users: any;
  orders: any;
  unitConfig: any;
};

export type CreateUnitDto = {
  name: string;
  code: string;
  description?: string;
  zoneIds: number[];
  config: {
    orderProcessFee: number;
    accountRentFee: number;
  };
};

export type UpdateUnitDto = {
  name: string;
  description?: string;
  zoneIds: number[];
};
