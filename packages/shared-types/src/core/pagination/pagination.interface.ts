import { Order } from "./pagination-order.enum.js";

export interface Pagination {
  order?: Order;
  page?: number;
  take?: number;
}
