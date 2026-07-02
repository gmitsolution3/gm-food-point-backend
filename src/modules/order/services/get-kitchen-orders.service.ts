import { EOrderStatus } from "../order.enum";
import { Order, TOrderItem } from "../order.model";

const getKitchenOrders = async () => {
  const orders = await Order.find(
    {
      status: {
        $in: [EOrderStatus.QUEUED, EOrderStatus.COOKING],
      },
    },
    {
      orderNumber: 1,
      tableNumber: 1,
      status: 1,
      orderPreparationTime: 1,
      estimatedCompletionAt: 1,
      notes: 1,
      items: 1,
    },
  )
    .sort({
      createdAt: 1,
    })
    .lean();

  return orders.map((order) => ({
    orderId: order._id,

    orderNumber: order.orderNumber,

    tableNumber: order.tableNumber,

    status: order.status,

    orderPreparationTime: order.orderPreparationTime,

    estimatedCompletionAt: order.estimatedCompletionAt,

    notes: order.notes,

    items: order.items.map((item: TOrderItem) => ({
      name: item.menuName,

      quantity: item.quantity,
    })),
  }));
};

export const GetKitchenOrdersService = {
  getKitchenOrders,
};
