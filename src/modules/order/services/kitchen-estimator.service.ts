import dayjs from "dayjs";
import getBusinessNow from "../../../utils/getBusinessNow";

import { EOrderStatus } from "../order.enum";
import { Order } from "../order.model";

const calculateEstimatedCompletionAt = async (
  orderPreparationTime: number,
): Promise<Date> => {
  const now = getBusinessNow();

  const activeOrders = await Order.find(
    {
      status: {
        $in: [EOrderStatus.QUEUED, EOrderStatus.COOKING],
      },
    },
    {
      estimatedCompletionAt: 1,
    },
  ).lean();

  let kitchenWorkload = 0;

  for (const order of activeOrders) {
    const remainingMinutes = Math.max(
      0,
      dayjs(order.estimatedCompletionAt).diff(now, "minute", true),
    );

    kitchenWorkload += remainingMinutes;
  }

  const estimatedCompletionAt = now
    .add(kitchenWorkload + orderPreparationTime, "minute")
    .toDate();

  return estimatedCompletionAt;
};

export const KitchenEstimatorService = {
  calculateEstimatedCompletionAt,
};
