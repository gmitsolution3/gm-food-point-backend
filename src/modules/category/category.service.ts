import httpStatus from "http-status";
import slugify from "slugify";

import AppError from "../../errors/AppError";
import calculatePagination from "../../utils/calculatePagination";
import validateObjectId from "../../utils/validateObjectId";

import { CATEGORY_MESSAGES } from "./category.constant";
import { Category, TCategory } from "./category.model";
import {
  TCreateCategoryPayload,
  TUpdateCategoryPayload,
} from "./category.types";

const createCategory = async (
  payload: TCreateCategoryPayload,
): Promise<TCategory> => {
  const isNameExists = await Category.findOne({
    name: payload.name,
  });

  if (isNameExists) {
    throw new AppError(
      httpStatus.CONFLICT,
      CATEGORY_MESSAGES.NAME_ALREADY_EXISTS,
    );
  }

  const slug = slugify(payload.name, {
    lower: true,
    strict: true,
    trim: true,
  });

  const isSlugExists = await Category.findOne({
    slug,
  });

  if (isSlugExists) {
    throw new AppError(
      httpStatus.CONFLICT,
      CATEGORY_MESSAGES.SLUG_ALREADY_EXISTS,
    );
  }

  const lastCategory = await Category.findOne()
    .sort({ displayOrder: -1 })
    .select("displayOrder");

  const displayOrder = lastCategory
    ? lastCategory.displayOrder + 1
    : 1;

  return await Category.create({
    name: payload.name,
    slug,
    displayOrder,
  });
};

const getCategories = async (query: {
  page?: number;
  limit?: number;
}) => {
  const { page, limit, skip } = calculatePagination(query);

  const data = await Category.find()
    .sort({ displayOrder: 1 })
    .skip(skip)
    .limit(limit);

  const total = await Category.countDocuments();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data,
  };
};

const getCategory = async (id: string): Promise<TCategory> => {
  validateObjectId(id, "Category");

  const category = await Category.findById(id);

  if (!category) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      CATEGORY_MESSAGES.NOT_FOUND,
    );
  }

  return category;
};

const updateCategory = async (
  id: string,
  payload: TUpdateCategoryPayload,
): Promise<TCategory> => {
  validateObjectId(id, "Category");

  const category = await Category.findById(id);

  if (!category) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      CATEGORY_MESSAGES.NOT_FOUND,
    );
  }

  // Update name & regenerate slug
  if (payload.name) {
    const isNameExists = await Category.findOne({
      name: payload.name,
      _id: { $ne: id },
    });

    if (isNameExists) {
      throw new AppError(
        httpStatus.CONFLICT,
        CATEGORY_MESSAGES.NAME_ALREADY_EXISTS,
      );
    }

    const slug = slugify(payload.name, {
      lower: true,
      strict: true,
      trim: true,
    });

    const isSlugExists = await Category.findOne({
      slug,
      _id: { $ne: id },
    });

    if (isSlugExists) {
      throw new AppError(
        httpStatus.CONFLICT,
        CATEGORY_MESSAGES.SLUG_ALREADY_EXISTS,
      );
    }

    category.name = payload.name;
    category.slug = slug;
  }

  // Reorder categories
  if (
    payload.displayOrder !== undefined &&
    payload.displayOrder !== category.displayOrder
  ) {
    const oldOrder = category.displayOrder;
    const newOrder = payload.displayOrder;

    const totalCategories = await Category.countDocuments();

    if (newOrder > totalCategories) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Display order exceeds total categories.",
      );
    }

    if (newOrder < oldOrder) {
      await Category.updateMany(
        {
          _id: { $ne: category._id },
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
      await Category.updateMany(
        {
          _id: { $ne: category._id },
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

    category.displayOrder = newOrder;
  }

  if (payload.isActive !== undefined) {
    category.isActive = payload.isActive;
  }

  await category.save();

  return category;
};

const deleteCategory = async (id: string): Promise<TCategory> => {
  validateObjectId(id, "Category");

  const category = await Category.findById(id);

  if (!category) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      CATEGORY_MESSAGES.NOT_FOUND,
    );
  }

  const deletedDisplayOrder = category.displayOrder;

  await category.deleteOne();

  await Category.updateMany(
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

  return category;
};

export const CategoryService = {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
