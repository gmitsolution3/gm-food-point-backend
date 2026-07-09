const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const MONGO_WEEK_DAYS = [2, 3, 4, 5, 6, 7, 1];

type TAggregationResult = {
  _id: number;

  value: number;
};

const buildWeeklyChart = <TKey extends string>(
  aggregation: TAggregationResult[],
  key: TKey,
): ({ date: string } & Record<TKey, number>)[] => {
  const valueMap = new Map<number, number>();

  aggregation.forEach((item) => {
    valueMap.set(item._id, item.value);
  });

  return WEEK_DAYS.map(
    (day, index): { date: string } & Record<TKey, number> => ({
      date: day,
      [key]: valueMap.get(MONGO_WEEK_DAYS[index]) ?? 0,
    }),
  );
};

export const BuildWeeklyChartService = {
  buildWeeklyChart,
};
