import dayjs from "dayjs";

import { Category } from "../category/category.model";
import { Menu } from "../menu/menu.model";
import { EOrderStatus } from "../order/order.enum";
import { Order } from "../order/order.model";
import {
  EPaymentStatus,
} from "../payment/payment.enum";
import { Payment } from "../payment/payment.model";
import { User } from "../user/user.model";

import {
  TFinanceResponse,
  TGetFinanceQuery,
  TStatisticsResponse,
} from "./dashboard.types";

import { FinanceChartService } from "./services/finance-chart.service";
import { FinanceSummaryService } from "./services/finance-summary.service";

const getFinance = async ({
  range,
}: TGetFinanceQuery): Promise<TFinanceResponse> => {
  const [summary, charts] = await Promise.all([
    FinanceSummaryService.getFinanceSummary(range),
    FinanceChartService.getFinanceCharts(range),
  ]);

  return {
    summary,
    charts,
  };
};

const getStatistics = async (): Promise<TStatisticsResponse> => {
  const today = dayjs().startOf("day");
  
  const [
    totalToday,
    awaitingPayment,
    queued,
    cooking,
    ready,
    completedToday,
    pendingPayments,
    totalUsers,
    totalMenus,
    totalCategories,
  ] = await Promise.all([
    Order.countDocuments({
      businessDate: dayjs().format("YYYY-MM-DD"),
    }),

    Order.countDocuments({
      status: EOrderStatus.AWAITING_PAYMENT,
    }),

    Order.countDocuments({
      status: EOrderStatus.QUEUED,
    }),

    Order.countDocuments({
      status: EOrderStatus.COOKING,
    }),

    Order.countDocuments({
      status: EOrderStatus.READY,
    }),

    Order.countDocuments({
      status: EOrderStatus.COMPLETED,

      updatedAt: {
        $gte: today,
      },
    }),

    Payment.countDocuments({
      status: EPaymentStatus.PENDING,
    }),

    User.countDocuments(),

    Menu.countDocuments(),

    Category.countDocuments(),
  ]);

  return {
    orders: {
      totalToday,

      awaitingPayment,

      queued,

      cooking,

      ready,

      completedToday,
    },

    payments: {
      pending: pendingPayments,
    },

    resources: {
      users: totalUsers,

      menus: totalMenus,

      categories: totalCategories,
    },
  };
};

export const DashboardService = {
  getFinance,

  getStatistics,
};
