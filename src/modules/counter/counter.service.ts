import { ClientSession } from "mongoose";

import getBusinessDate from "../../utils/getBusinessDate";

import { COUNTER_KEYS } from "./counter.constant";
import { Counter } from "./counter.model";

const getNextSequence = async (
  key: keyof typeof COUNTER_KEYS,
  session?: ClientSession,
): Promise<number> => {
  const businessDate = getBusinessDate();

  const counter = await Counter.findOneAndUpdate(
    {
      key: COUNTER_KEYS[key],
      businessDate,
    },
    {
      $inc: {
        sequence: 1,
      },
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
      session
    },
  );

  return counter.sequence;
};

export const CounterService = {
  getNextSequence,
};
