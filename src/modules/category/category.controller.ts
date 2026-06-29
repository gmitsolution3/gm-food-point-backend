import httpStatus from "http-status";

import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

import { CATEGORY_MESSAGES } from "./category.constant";
import { CategoryService } from "./category.service";

const createCategory = catchAsync(async (req, res) => {
  const result = await CategoryService.createCategory(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: CATEGORY_MESSAGES.CREATED,
    data: result,
  });
});

const getCategories = catchAsync(async (req, res) => {
  const result = await CategoryService.getCategories(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: CATEGORY_MESSAGES.RETRIEVED_ALL,
    meta: result.meta,
    data: result.data,
  });
});

const getCategory = catchAsync(async (req, res) => {
  const result = await CategoryService.getCategory(req.params.id as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: CATEGORY_MESSAGES.RETRIEVED,
    data: result,
  });
});

const updateCategory = catchAsync(async (req, res) => {
  const result = await CategoryService.updateCategory(
    req.params.id as string,
    req.body,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: CATEGORY_MESSAGES.UPDATED,
    data: result,
  });
});

const deleteCategory = catchAsync(async (req, res) => {
  const result = await CategoryService.deleteCategory(req.params.id as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: CATEGORY_MESSAGES.DELETED,
    data: result,
  });
});

export const CategoryController = {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};