import type { TablePaginationConfig } from "antd/es/table";
import type { FilterValue, SorterResult } from "antd/es/table/interface";

export type ErrorResponse = {
  message: string;
  [x: string]: any;
};

export type ResponseList<T> = {
  rows: T[];
  total: number;
};

export type ResponseHasMore<T> = {
  rows: T[];
  hasMore: boolean;
};

export type QueryPagination = {
  page?: number;
  limit?: number;
  sort?: string;
  q?: string;
};

export interface TableParams<T = any> {
  pagination?: TablePaginationConfig;
  sorter?: SorterResult<T> | SorterResult<T>[];
  filters?: Record<string, FilterValue | null>;
}

export interface Rule {
  action: string;
  subject: string;
}

export interface PaginationQueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  q?: string;
}
