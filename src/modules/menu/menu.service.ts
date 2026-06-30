import httpStatus from "http-status";
import slugify from "slugify";

import AppError from "../../errors/AppError";

import { Category } from "../category/category.model";

import calculatePagination from "../../utils/calculatePagination";
import validateObjectId from "../../utils/validateObjectId";
import { MENU_MESSAGES } from "./menu.constant";
import { Menu, TMenu } from "./menu.model";
import { TCreateMenuPayload, TUpdateMenuPayload } from "./menu.types";

const createMenu = async (
  payload: TCreateMenuPayload,
): Promise<TMenu> => {
  /**
   * Validate Category
   */
  const category = await Category.findById(payload.categoryId);

  if (!category) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      MENU_MESSAGES.CATEGORY_NOT_FOUND,
    );
  }

  /**
   * Generate Slug
   */
  const slug = slugify(payload.name, {
    lower: true,
    strict: true,
    trim: true,
  });

  /**
   * Validate Slug
   */
  const isSlugExists = await Menu.findOne({ slug });

  if (isSlugExists) {
    throw new AppError(
      httpStatus.CONFLICT,
      MENU_MESSAGES.SLUG_ALREADY_EXISTS,
    );
  }

  /**
   * Validate Suggested Items
   */
  if (payload.suggestedItems?.length) {
    const suggestedItems = await Menu.find({
      _id: {
        $in: payload.suggestedItems,
      },
    }).select("_id");

    if (suggestedItems.length !== payload.suggestedItems.length) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "One or more suggested menu items do not exist.",
      );
    }
  }

  /**
   * Generate Display Order
   */
  const lastMenu = await Menu.findOne()
    .sort({
      displayOrder: -1,
    })
    .select("displayOrder");

  const displayOrder = lastMenu ? lastMenu.displayOrder + 1 : 1;

  /**
   * Validate Discount Price
   */
  if (
    payload.discountPrice !== null &&
    payload.discountPrice !== undefined &&
    payload.discountPrice > payload.price
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Discount price cannot be greater than the original price.",
    );
  }

  /**
   * Create Menu
   */
  const menu = await Menu.create({
    ...payload,
    slug,
    displayOrder,
  });

  return menu;
};

const getMenus = async (query: {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  isAvailable?: boolean | string;
}) => {
  const { page, limit, skip } = calculatePagination(query);

  const filter: Record<string, unknown> = {};

  if (query.search) {
    filter.name = {
      $regex: query.search,
      $options: "i",
    };
  }

  if (query.categoryId) {
    validateObjectId(query.categoryId, "Category");

    const category = await Category.findById(query.categoryId);

    if (!category) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        MENU_MESSAGES.CATEGORY_NOT_FOUND,
      );
    }

    filter.categoryId = query.categoryId;
  }

  if (query.isAvailable !== undefined) {
    filter.isAvailable =
      query.isAvailable === true || query.isAvailable === "true";
  }

  const data = await Menu.find(filter)
    .populate("categoryId")
    .populate("suggestedItems")
    .sort({
      displayOrder: 1,
    })
    .skip(skip)
    .limit(limit);

  const total = await Menu.countDocuments(filter);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data,
  };
};

const getMenu = async (id: string): Promise<TMenu> => {
  validateObjectId(id, "Menu");

  const menu = await Menu.findById(id)
    .populate("categoryId")
    .populate("suggestedItems");

  if (!menu) {
    throw new AppError(httpStatus.NOT_FOUND, MENU_MESSAGES.NOT_FOUND);
  }

  return menu;
};

const updateMenu = async (
  id: string,
  payload: TUpdateMenuPayload,
): Promise<TMenu> => {
  validateObjectId(id, "Menu");

  const menu = await Menu.findById(id);

  if (!menu) {
    throw new AppError(httpStatus.NOT_FOUND, MENU_MESSAGES.NOT_FOUND);
  }

  const price = payload.price ?? menu.price;

  const discountPrice = payload.discountPrice ?? menu.discountPrice;

  /**
   * Validate Discount Price
   */
  if (discountPrice !== null && discountPrice > price) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      MENU_MESSAGES.INVALID_DISCOUNT_PRICE,
    );
  }

  /**
   * Validate Category
   */
  if (payload.categoryId) {
    const category = await Category.findById(payload.categoryId);

    if (!category) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        MENU_MESSAGES.CATEGORY_NOT_FOUND,
      );
    }
  }

  /**
   * Update Name & Slug
   */
  if (payload.name) {
    const slug = slugify(payload.name, {
      lower: true,
      strict: true,
      trim: true,
    });

    const isSlugExists = await Menu.findOne({
      slug,
      _id: {
        $ne: id,
      },
    });

    if (isSlugExists) {
      throw new AppError(
        httpStatus.CONFLICT,
        MENU_MESSAGES.SLUG_ALREADY_EXISTS,
      );
    }

    menu.name = payload.name;
    menu.slug = slug;
  }

  /**
   * Validate Suggested Items
   */
  if (payload.suggestedItems) {
    const suggestedItems = await Menu.find({
      _id: {
        $in: payload.suggestedItems,
      },
    }).select("_id");

    if (suggestedItems.length !== payload.suggestedItems.length) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "One or more suggested menu items do not exist.",
      );
    }

    if (
      payload.suggestedItems.some(
        (item: any) => item.toString() === id,
      )
    ) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "A menu item cannot suggest itself.",
      );
    }
  }
  /**
   * Reorder Menu
   */
  if (
    payload.displayOrder !== undefined &&
    payload.displayOrder !== menu.displayOrder
  ) {
    const oldOrder = menu.displayOrder;
    const newOrder = payload.displayOrder;

    const totalMenus = await Menu.countDocuments();

    if (newOrder > totalMenus) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Display order exceeds total menu items.",
      );
    }

    if (newOrder < oldOrder) {
      await Menu.updateMany(
        {
          _id: { $ne: menu._id },
          displayOrder: {
            $gte: newOrder,
            $lt: oldOrder,
          },
        },
        {
          $inc: {
            displayOrder: 1,
          },
        },
      );
    } else {
      await Menu.updateMany(
        {
          _id: { $ne: menu._id },
          displayOrder: {
            $gt: oldOrder,
            $lte: newOrder,
          },
        },
        {
          $inc: {
            displayOrder: -1,
          },
        },
      );
    }

    menu.displayOrder = newOrder;
  }

  /**
   * Update Remaining Fields
   */
  if (payload.description !== undefined) {
    menu.description = payload.description;
  }

  if (payload.categoryId !== undefined) {
    menu.categoryId = payload.categoryId;
  }

  if (payload.image !== undefined) {
    menu.image = payload.image;
  }

  if (payload.price !== undefined) {
    menu.price = payload.price;
  }

  if (payload.discountPrice !== undefined) {
    menu.discountPrice = payload.discountPrice;
  }

  if (payload.preparationTime !== undefined) {
    menu.preparationTime = payload.preparationTime;
  }

  if (payload.suggestedItems !== undefined) {
    menu.suggestedItems = payload.suggestedItems;
  }

  if (payload.isAvailable !== undefined) {
    menu.isAvailable = payload.isAvailable;
  }

  if (payload.isFeatured !== undefined) {
    menu.isFeatured = payload.isFeatured;
  }

  await menu.save();

  return menu;
};

const deleteMenu = async (id: string): Promise<TMenu> => {
  validateObjectId(id, "Menu");

  const menu = await Menu.findById(id);

  if (!menu) {
    throw new AppError(httpStatus.NOT_FOUND, MENU_MESSAGES.NOT_FOUND);
  }

  const deletedDisplayOrder = menu.displayOrder;

  await menu.deleteOne();

  await Menu.updateMany(
    {
      displayOrder: {
        $gt: deletedDisplayOrder,
      },
    },
    {
      $inc: {
        displayOrder: -1,
      },
    },
  );

  return menu;
};

export const MenuService = {
  createMenu,
  getMenus,
  getMenu,
  updateMenu,
  deleteMenu,
};
