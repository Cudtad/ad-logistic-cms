import { PaginationProps } from "antd";

export const showTotal: PaginationProps["showTotal"] = (total, range) =>
  `${range[0]}-${range[1]} của ${total} đơn hàng`;

export const pageSizeOptions = [10, 20, 30];
