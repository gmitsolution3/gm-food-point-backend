import httpStatus from "http-status";

import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

import { MENU_MESSAGES } from "./menu.constant";
import { MenuService } from "./menu.service";

const createMenu = catchAsync(async (req, res) => {
  const result = await MenuService.createMenu(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: MENU_MESSAGES.CREATED,
    data: result,
  });
});

const getMenus = catchAsync(async (req, res) => {
  const result = await MenuService.getMenus(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: MENU_MESSAGES.RETRIEVED_ALL,
    meta: result.meta,
    data: result.data,
  });
});

const getMenu = catchAsync(async (req, res) => {
  const result = await MenuService.getMenu(req.params.id as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: MENU_MESSAGES.RETRIEVED,
    data: result,
  });
});

const updateMenu = catchAsync(async (req, res) => {
  const result = await MenuService.updateMenu(
    req.params.id as string,
    req.body,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: MENU_MESSAGES.UPDATED,
    data: result,
  });
});

const deleteMenu = catchAsync(async (req, res) => {
  const result = await MenuService.deleteMenu(req.params.id as string);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: MENU_MESSAGES.DELETED,
    data: result,
  });
});

export const MenuController = {
  createMenu,
  getMenus,
  getMenu,
  updateMenu,
  deleteMenu,
};
