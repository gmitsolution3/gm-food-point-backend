import { Counter } from "./counter.model";

const getNextSequence = async (key: string): Promise<number> => {
  const counter = await Counter.findOneAndUpdate(
    {
      key,
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
    },
  );

  return counter.sequence;
};

export const CounterService = {
  getNextSequence,
};
