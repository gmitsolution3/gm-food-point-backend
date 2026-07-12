import dayjs from "dayjs";

import {
  TBuildDailySeriesOptions,
  TChartPoint,
} from "./chart.types";

const buildDailySeries = async ({
  model,
  dateField,
  startDate,
  endDate,
  match = {},
  operation,
}: TBuildDailySeriesOptions): Promise<TChartPoint[]> => {
  const aggregation = await model.aggregate([
    {
      $match: {
        ...match,

        [dateField]: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },

    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: `$${dateField}`,
          },
        },

        value: operation as any,
      },
    },

    {
      $sort: {
        _id: 1,
      },
    },
  ]);

  const valueMap = new Map<string, number>();

  aggregation.forEach((item) => {
    valueMap.set(item._id, item.value);
  });

  const result: TChartPoint[] = [];

  let current = dayjs(startDate);

  const end = dayjs(endDate);

  while (
    current.isBefore(end, "day") ||
    current.isSame(end, "day")
  ) {
    const key = current.format("YYYY-MM-DD");

    result.push({
      label: current.format("D MMM"),

      value: valueMap.get(key) ?? 0,
    });

    current = current.add(1, "day");
  }

  return result;
};

export const BuildDailySeriesService = {
  buildDailySeries,
};