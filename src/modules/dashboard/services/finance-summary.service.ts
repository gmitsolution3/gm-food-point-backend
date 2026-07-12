import dayjs from "dayjs";

import {
  EPaymentMethod,
  EPaymentStatus,
} from "../../payment/payment.enum";
import { Payment } from "../../payment/payment.model";

import { EFinanceRange } from "../dashboard.enum";
import { TFinanceSummary } from "../dashboard.types";

const RANGE_CONFIG = {
  [EFinanceRange.TODAY]: {
    amount: 0,
    unit: "day",
  },

  [EFinanceRange.SEVEN_DAYS]: {
    amount: 6,
    unit: "day",
  },

  [EFinanceRange.FIFTEEN_DAYS]: {
    amount: 14,
    unit: "day",
  },

  [EFinanceRange.ONE_MONTH]: {
    amount: 29,
    unit: "day",
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
} as const;

const getFinanceSummary = async (
  range: EFinanceRange,
): Promise<TFinanceSummary> => {
  const config = RANGE_CONFIG[range];

  const endDate = dayjs().endOf("day");

  const startDate =
    range === EFinanceRange.TODAY
      ? dayjs().startOf("day")
      : dayjs()
          .subtract(config.amount, config.unit)
          .startOf("day");

  const [summary] = await Payment.aggregate([
    {
      $match: {
        status: EPaymentStatus.PAID,

        confirmedAt: {
          $gte: startDate.toDate(),
          $lte: endDate.toDate(),
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
                $eq: [
                  "$paymentMethod",
                  EPaymentMethod.CASH,
                ],
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
                $eq: [
                  "$paymentMethod",
                  EPaymentMethod.WECHAT,
                ],
              },
              "$amount",
              0,
            ],
          },
        },
      },
    },
  ]);

  const totalRevenue = summary?.totalRevenue ?? 0;

  const totalOrders = summary?.totalOrders ?? 0;

  return {
    totalRevenue,

    totalOrders,

    averageOrderValue:
      totalOrders === 0
        ? 0
        : Number(
            (totalRevenue / totalOrders).toFixed(2),
          ),

    cashRevenue: summary?.cashRevenue ?? 0,

    wechatRevenue:
      summary?.wechatRevenue ?? 0,
  };
};

export const FinanceSummaryService = {
  getFinanceSummary,
};