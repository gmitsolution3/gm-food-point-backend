import { Model, QueryFilter } from "mongoose";

import { EFinanceRange } from "../dashboard.enum";

import { Order } from "../../order/order.model";

import { EPaymentStatus } from "../../payment/payment.enum";

import { Payment } from "../../payment/payment.model";

import { TChartPoint, TFinanceCharts } from "../dashboard.types";

import dayjs from "dayjs";

type TAggregateSeriesOptions = {
  model: Model<unknown>;

  match: QueryFilter<unknown>;

  bucketExpression: Record<string, unknown>;

  valueExpression: Record<string, unknown>;
};

const aggregateSeries = async ({
  model,
  match,
  bucketExpression,
  valueExpression,
}: TAggregateSeriesOptions): Promise<
  Map<string | number, number>
> => {
  const aggregation = await model.aggregate([
    {
      $match: match,
    },

    {
      $group: {
        _id: bucketExpression,

        value: valueExpression as any,
      },
    },

    {
      $sort: {
        _id: 1,
      },
    },
  ]);

  const series = new Map<string | number, number>();

  aggregation.forEach((item) => {
    series.set(item._id, item.value);
  });

  return series;
};

const buildChartPoints = ({
  start,
  end,
  unit,
  labelFormat,
  series,
}: {
  start: dayjs.Dayjs;
  end: dayjs.Dayjs;
  unit: dayjs.ManipulateType;
  labelFormat: string;
  series: Map<string | number, number>;
}): TChartPoint[] => {
  const points: TChartPoint[] = [];

  let current = start;

  while (current.isBefore(end, unit) || current.isSame(end, unit)) {
    let key: string | number;

    switch (unit) {
      case "hour":
        key = current.hour();
        break;

      case "month":
        key = current.format("YYYY-MM");
        break;

      default:
        key = current.format("YYYY-MM-DD");
    }

    points.push({
      label: current.format(labelFormat),
      value: series.get(key) ?? 0,
    });

    current = current.add(1, unit);
  }

  return points;
};

const buildHourlyCharts = async (): Promise<TFinanceCharts> => {
  const startDate = dayjs().startOf("day");

  const endDate = dayjs().endOf("day");

  const [revenueSeries, orderSeries] = await Promise.all([
    aggregateSeries({
      model: Payment,

      match: {
        status: EPaymentStatus.PAID,

        confirmedAt: {
          $gte: startDate.toDate(),
          $lte: endDate.toDate(),
        },
      },

      bucketExpression: {
        $hour: "$confirmedAt",
      },

      valueExpression: {
        $sum: "$amount",
      },
    }),

    aggregateSeries({
      model: Order,

      match: {
        createdAt: {
          $gte: startDate.toDate(),
          $lte: endDate.toDate(),
        },
      },

      bucketExpression: {
        $hour: "$createdAt",
      },

      valueExpression: {
        $sum: 1,
      },
    }),
  ]);

  const revenue: TChartPoint[] = [];

  const orders: TChartPoint[] = [];

  for (let hour = 0; hour < 24; hour++) {
    revenue.push({
      label: hour.toString().padStart(2, "0"),

      value: revenueSeries.get(hour) ?? 0,
    });

    orders.push({
      label: hour.toString().padStart(2, "0"),

      value: orderSeries.get(hour) ?? 0,
    });
  }

  return {
    granularity: "hourly",

    revenue,

    orders,
  };
};

const buildDailyCharts = async (
  days: number,
): Promise<TFinanceCharts> => {
  const endDate = dayjs().endOf("day");

  const startDate = dayjs()
    .subtract(days - 1, "day")
    .startOf("day");

  const [revenueSeries, orderSeries] = await Promise.all([
    aggregateSeries({
      model: Payment,

      match: {
        status: EPaymentStatus.PAID,

        confirmedAt: {
          $gte: startDate.toDate(),
          $lte: endDate.toDate(),
        },
      },

      bucketExpression: {
        $dateToString: {
          format: "%Y-%m-%d",
          date: {
            $dateTrunc: {
              date: "$confirmedAt",
              unit: "week",
            },
          },
        },
      },

      valueExpression: {
        $sum: "$amount",
      },
    }),

    aggregateSeries({
      model: Order,

      match: {
        createdAt: {
          $gte: startDate.toDate(),
          $lte: endDate.toDate(),
        },
      },

      bucketExpression: {
        $dateToString: {
          format: "%Y-%m-%d",
          date: {
            $dateTrunc: {
              date: "$createdAt",
              unit: "week",
            },
          },
        },
      },

      valueExpression: {
        $sum: 1,
      },
    }),
  ]);

  return {
    granularity: "daily",

    revenue: buildChartPoints({
      start: startDate,

      end: endDate,

      unit: "day",

      labelFormat: "D MMM",

      series: revenueSeries,
    }),

    orders: buildChartPoints({
      start: startDate,

      end: endDate,

      unit: "day",

      labelFormat: "D MMM",

      series: orderSeries,
    }),
  };
};

const buildWeeklyCharts = async (): Promise<TFinanceCharts> => {
  const endDate = dayjs().endOf("week");

  const startDate = endDate.subtract(11, "week").startOf("week");

  const [revenueSeries, orderSeries] = await Promise.all([
    aggregateSeries({
      model: Payment,

      match: {
        status: EPaymentStatus.PAID,

        confirmedAt: {
          $gte: startDate.toDate(),
          $lte: endDate.toDate(),
        },
      },

      bucketExpression: {
        $dateToString: {
          format: "%Y-%m-%d",
          date: {
            $dateTrunc: {
              date: "$confirmedAt",
              unit: "week",
            },
          },
        },
      },

      valueExpression: {
        $sum: "$amount",
      },
    }),

    aggregateSeries({
      model: Order,

      match: {
        createdAt: {
          $gte: startDate.toDate(),
          $lte: endDate.toDate(),
        },
      },

      bucketExpression: {
        $dateToString: {
          format: "%Y-%m-%d",
          date: {
            $dateTrunc: {
              date: "$createdAt",
              unit: "week",
            },
          },
        },
      },

      valueExpression: {
        $sum: 1,
      },
    }),
  ]);

  const revenue: TChartPoint[] = [];

  const orders: TChartPoint[] = [];

  let current = startDate;

  let week = 1;

  while (
    current.isBefore(endDate, "week") ||
    current.isSame(endDate, "week")
  ) {
    const key = current.startOf("week").format("YYYY-MM-DD");

    revenue.push({
      label: `${current.startOf("week").format("D MMM")}`,

      value: revenueSeries.get(key) ?? 0,
    });

    orders.push({
      label: `${current.startOf("week").format("D MMM")}`,

      value: orderSeries.get(key) ?? 0,
    });

    current = current.add(1, "week");

    week++;
  }

  return {
    granularity: "weekly",

    revenue,

    orders,
  };
};

const buildMonthlyCharts = async (
  months: number,
): Promise<TFinanceCharts> => {
  const endDate = dayjs().endOf("month");

  const startDate = endDate
    .subtract(months - 1, "month")
    .startOf("month");

  const [revenueSeries, orderSeries] = await Promise.all([
    aggregateSeries({
      model: Payment,

      match: {
        status: EPaymentStatus.PAID,

        confirmedAt: {
          $gte: startDate.toDate(),
          $lte: endDate.toDate(),
        },
      },

      bucketExpression: {
        $dateToString: {
          format: "%Y-%m",
          date: "$confirmedAt",
        },
      },

      valueExpression: {
        $sum: "$amount",
      },
    }),

    aggregateSeries({
      model: Order,

      match: {
        createdAt: {
          $gte: startDate.toDate(),
          $lte: endDate.toDate(),
        },
      },

      bucketExpression: {
        $dateToString: {
          format: "%Y-%m",
          date: "$createdAt",
        },
      },

      valueExpression: {
        $sum: 1,
      },
    }),
  ]);

  const revenue: TChartPoint[] = [];

  const orders: TChartPoint[] = [];

  let current = startDate;

  while (
    current.isBefore(endDate, "month") ||
    current.isSame(endDate, "month")
  ) {
    const key = current.format("YYYY-MM");

    revenue.push({
      label: current.format("MMM"),

      value: revenueSeries.get(key) ?? 0,
    });

    orders.push({
      label: current.format("MMM"),

      value: orderSeries.get(key) ?? 0,
    });

    current = current.add(1, "month");
  }

  return {
    granularity: "monthly",

    revenue,

    orders,
  };
};

const getFinanceCharts = async (
  range: EFinanceRange,
): Promise<TFinanceCharts> => {
  switch (range) {
    case EFinanceRange.TODAY:
      return buildHourlyCharts();

    case EFinanceRange.SEVEN_DAYS:
      return buildDailyCharts(7);

    case EFinanceRange.FIFTEEN_DAYS:
      return buildDailyCharts(15);

    case EFinanceRange.ONE_MONTH:
      return buildDailyCharts(30);

    case EFinanceRange.THREE_MONTHS:
      return buildWeeklyCharts();

    case EFinanceRange.SIX_MONTHS:
      return buildMonthlyCharts(6);

    case EFinanceRange.ONE_YEAR:
      return buildMonthlyCharts(12);

    default:
      throw new Error("Invalid finance range.");
  }
};

export const FinanceChartService = {
  getFinanceCharts,
};
