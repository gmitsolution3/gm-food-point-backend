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

  charts: {
    weeklyRevenue: {
      date: string;

      revenue: number;
    }[];

    weeklyOrders: {
      date: string;

      orders: number;
    }[];
  };
};
