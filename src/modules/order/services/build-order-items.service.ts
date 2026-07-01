import httpStatus from "http-status";
import { Types } from "mongoose";

import AppError from "../../../errors/AppError";

import { Menu } from "../../menu/menu.model";
import { ORDER_MESSAGES } from "../order.constant";
import { TOrderItem } from "../order.model";

import validateObjectId from "../../../utils/validateObjectId";

type TCreateOrderItem = {
  menuId: string;
  quantity: number;
};

type TBuildOrderItemsResult = {
  items: TOrderItem[];
  orderPreparationTime: number;
};

type TMenuSnapshot = {
  _id: Types.ObjectId;
  name: string;
  price: number;
  discountPrice: number | null;
  preparationTime: number;
  isAvailable: boolean;
  category: {
    _id: Types.ObjectId;
    name: string;
  };
};

const buildOrderItems = async (
  payload: TCreateOrderItem[],
): Promise<TBuildOrderItemsResult> => {
  for (const item of payload) {
    validateObjectId(item.menuId, "Menu");
  }

  const menuIds = payload.map(
    ({ menuId }) => new Types.ObjectId(menuId),
  );

  const menus = await Menu.aggregate<TMenuSnapshot>([
    {
      $match: {
        _id: {
          $in: menuIds,
        },
      },
    },

    {
      $lookup: {
        from: "categories",
        localField: "categoryId",
        foreignField: "_id",
        as: "category",
      },
    },

    {
      $unwind: "$category",
    },

    {
      $project: {
        name: 1,
        price: 1,
        discountPrice: 1,
        preparationTime: 1,
        isAvailable: 1,

        category: {
          _id: "$category._id",
          name: "$category.name",
        },
      },
    },
  ]);

  if (menus.length !== payload.length) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      ORDER_MESSAGES.INVALID_MENU_ITEM,
    );
  }

  const menuMap = new Map(
    menus.map((menu) => [menu._id.toString(), menu]),
  );

  const items: TOrderItem[] = [];

  let orderPreparationTime = 0;

  for (const orderItem of payload) {
    const menu = menuMap.get(orderItem.menuId);

    if (!menu) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        ORDER_MESSAGES.INVALID_MENU_ITEM,
      );
    }

    if (!menu.isAvailable) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `${menu.name} is currently unavailable.`,
      );
    }

    const effectiveUnitPrice = menu.discountPrice ?? menu.price;

    items.push({
      menuId: menu._id,

      menuName: menu.name,

      categoryId: menu.category._id,

      categoryName: menu.category.name,

      originalUnitPrice: menu.price,

      effectiveUnitPrice,

      quantity: orderItem.quantity,

      totalPrice: effectiveUnitPrice * orderItem.quantity,
    });

    orderPreparationTime = Math.max(
      orderPreparationTime,
      menu.preparationTime,
    );
  }

  return {
    items,
    orderPreparationTime,
  };
};

export const BuildOrderItemsService = {
  buildOrderItems,
};
