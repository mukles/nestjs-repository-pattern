import { Order } from "./pagination-order.enum";

export interface Pagination {
  order?: Order;
  page?: number;
  take?: number;
}
