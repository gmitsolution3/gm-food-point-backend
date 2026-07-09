import dayjs from "dayjs";

import {
  EPaymentMethod,
  EPaymentStatus,
} from "../payment/payment.enum";
import { Payment } from "../payment/payment.model";

import { EFinanceRange } from "./dashboard.enum";
import {
  TFinanceResponse,
  TGetFinanceQuery,
} from "./dashboard.types";

import { Category } from "../category/category.model";
import { Menu } from "../menu/menu.model";
import { EOrderStatus } from "../order/order.enum";
import { Order } from "../order/order.model";
import { User } from "../user/user.model";

import { TStatisticsResponse } from "./dashboard.types";

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const mongoWeekDays = [2, 3, 4, 5, 6, 7, 1];

const RANGE_MAP: Record<
  EFinanceRange,
  {
    amount: number;
    unit: dayjs.ManipulateType;
  }
> = {
  [EFinanceRange.TODAY]: {
    amount: 0,
    unit: "day",
  },

  [EFinanceRange.SEVEN_DAYS]: {
    amount: 7,
    unit: "day",
  },

  [EFinanceRange.FIFTEEN_DAYS]: {
    amount: 15,
    unit: "day",
  },

  [EFinanceRange.ONE_MONTH]: {
    amount: 1,
    unit: "month",
  },

  [EFinanceRange.THREE_MONTHS]: {
    amount: 3,
    unit: "month",
  },

  [EFinanceRange.SIX_MONTHS]: {
    amount: 6,
    unit: "month",
  },

  [EFinanceRange.ONE_YEAR]: {
    amount: 1,
    unit: "year",
  },
};

const getFinance = async ({
  range = EFinanceRange.TODAY,
}: TGetFinanceQuery): Promise<TFinanceResponse> => {
  const config = RANGE_MAP[range];

  const startDate =
    range === EFinanceRange.TODAY
      ? dayjs().startOf("day")
      : dayjs().subtract(config.amount, config.unit).startOf("day");

  const [finance] = await Payment.aggregate([
    {
      $match: {
        status: EPaymentStatus.PAID,

        confirmedAt: {
          $gte: startDate.toDate(),
        },
      },
    },

    {
      $group: {
        _id: null,

        totalRevenue: {
          $sum: "$amount",
        },

        totalOrders: {
          $sum: 1,
        },

        cashRevenue: {
          $sum: {
            $cond: [
              {
                $eq: ["$paymentMethod", EPaymentMethod.CASH],
              },
              "$amount",
              0,
            ],
          },
        },

        wechatRevenue: {
          $sum: {
            $cond: [
              {
                $eq: ["$paymentMethod", EPaymentMethod.WECHAT],
              },
              "$amount",
              0,
            ],
          },
        },
      },
    },
  ]);

  const totalRevenue = finance?.totalRevenue ?? 0;

  const totalOrders = finance?.totalOrders ?? 0;

  return {
    range,

    totalRevenue,

    totalOrders,

    averageOrderValue:
      totalOrders > 0
        ? Number((totalRevenue / totalOrders).toFixed(2))
        : 0,

    cashRevenue: finance?.cashRevenue ?? 0,

    wechatRevenue: finance?.wechatRevenue ?? 0,
  };
};

const getStatistics = async (): Promise<TStatisticsResponse> => {
  const today = dayjs().startOf("day");

  const startOfWeek = today.startOf("week").add(1, "day");

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
    weeklyRevenue,
    weeklyOrders,
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

    Payment.aggregate([
      {
        $match: {
          status: EPaymentStatus.PAID,

          confirmedAt: {
            $gte: startOfWeek.toDate(),
          },
        },
      },

      {
        $group: {
          _id: {
            $dayOfWeek: "$confirmedAt",
          },

          revenue: {
            $sum: "$amount",
          },
        },
      },
    ]),

    Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfWeek.toDate(),
          },
        },
      },

      {
        $group: {
          _id: {
            $dayOfWeek: "$createdAt",
          },

          orders: {
            $sum: 1,
          },
        },
      },
    ]),
  ]);

  const revenueMap = new Map<number, number>();

  weeklyRevenue.forEach((item) => {
    revenueMap.set(item._id, item.revenue);
  });

  const orderMap = new Map<number, number>();

  weeklyOrders.forEach((item) => {
    orderMap.set(item._id, item.orders);
  });

  const weeklyRevenueChart = WEEK_DAYS.map((day, index) => ({
    date: day,

    revenue: revenueMap.get(mongoWeekDays[index]) ?? 0,
  }));

  const weeklyOrderChart = WEEK_DAYS.map((day, index) => ({
    date: day,

    orders: orderMap.get(mongoWeekDays[index]) ?? 0,
  }));

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

    charts: {
      weeklyRevenue: weeklyRevenueChart,

      weeklyOrders: weeklyOrderChart,
    },
  };
};

export const DashboardService = {
  getFinance,

  getStatistics,
};
