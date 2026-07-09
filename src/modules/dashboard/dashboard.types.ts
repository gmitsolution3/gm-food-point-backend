import { EFinanceRange } from "./dashboard.enum";

export type TGetFinanceQuery = {
  range?: EFinanceRange;
};

export type TFinanceResponse = {
  range: EFinanceRange;

  totalRevenue: number;

  totalOrders: number;

  averageOrderValue: number;

  cashRevenue: number;

  wechatRevenue: number;
};