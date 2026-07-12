import { QueryFilter, Model } from "mongoose";

export type TChartPoint = {
  label: string;

  value: number;
};

export type TBuildDailySeriesOptions = {
  model: Model<unknown>;

  dateField: string;

  startDate: Date;

  endDate: Date;

  match?: QueryFilter<unknown>;

  operation: Record<string, unknown>;
};