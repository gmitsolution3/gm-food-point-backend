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

export const DashboardService = {
  getFinance,
};
