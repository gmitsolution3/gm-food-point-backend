import { EFinanceRange } from "./dashboard.enum";

export type TGetFinanceQuery = {
  range: EFinanceRange;
};

export type TChartPoint = {
  label: string;

  value: number;
};

export type TFinanceSummary = {
  totalRevenue: number;

  totalOrders: number;

  averageOrderValue: number;

  cashRevenue: number;

  wechatRevenue: number;
};

export type TFinanceResponse = {
  summary: TFinanceSummary;

  charts: {
    revenue: TChartPoint[];

    orders: TChartPoint[];
  };
};

export type TStatisticsResponse = {
  orders: {
    totalToday: number;

    awaitingPayment: number;

    queued: number;

    cooking: number;

    ready: number;

    completedToday: number;
  };

  payments: {
    pending: number;
  };

  resources: {
    users: number;

    menus: number;

    categories: number;
  };
};