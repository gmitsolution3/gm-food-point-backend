import dayjs from "dayjs";

import { Order } from "../../order/order.model";
import { EPaymentStatus } from "../../payment/payment.enum";
import { Payment } from "../../payment/payment.model";

import { EFinanceRange } from "../dashboard.enum";
import { TChartPoint } from "../dashboard.types";

import { BuildDailySeriesService } from "./chart/build-daily-series.service";

const getFinanceCharts = async (
  range: EFinanceRange,
): Promise<{
  revenue: TChartPoint[];
  orders: TChartPoint[];
}> => {
  /**
   * We will implement
   *
   * TODAY
   * 7 DAYS
   * 15 DAYS
   * 1 MONTH
   *
   * using Daily Series first.
   *
   * Later we'll add
   *
   * 3 MONTHS
   * 6 MONTHS
   * 1 YEAR
   */

  const endDate = dayjs().endOf("day");

  let startDate = endDate;

  switch (range) {
    case EFinanceRange.TODAY:
      startDate = dayjs().startOf("day");
      break;

    case EFinanceRange.SEVEN_DAYS:
      startDate = dayjs().subtract(6, "day").startOf("day");
      break;

    case EFinanceRange.FIFTEEN_DAYS:
      startDate = dayjs().subtract(14, "day").startOf("day");
      break;

    case EFinanceRange.ONE_MONTH:
      startDate = dayjs().subtract(29, "day").startOf("day");
      break;

    /**
     * Temporary
     */
    case EFinanceRange.THREE_MONTHS:
    case EFinanceRange.SIX_MONTHS:
    case EFinanceRange.ONE_YEAR:
      startDate = dayjs().subtract(29, "day").startOf("day");
      break;
  }

  const [revenue, orders] = await Promise.all([
    BuildDailySeriesService.buildDailySeries({
      model: Payment,

      dateField: "confirmedAt",

      startDate: startDate.toDate(),

      endDate: endDate.toDate(),

      match: {
        status: EPaymentStatus.PAID,
      },

      operation: {
        $sum: "$amount",
      },
    }),

    BuildDailySeriesService.buildDailySeries({
      model: Order,

      dateField: "createdAt",

      startDate: startDate.toDate(),

      endDate: endDate.toDate(),

      operation: {
        $sum: 1,
      },
    }),
  ]);

  return {
    revenue,

    orders,
  };
};

export const FinanceChartService = {
  getFinanceCharts,
};
