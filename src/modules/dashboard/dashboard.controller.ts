import httpStatus from "http-status";

import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

import { DASHBOARD_MESSAGES } from "./dashboard.constant";
import { DashboardService } from "./dashboard.service";

const getFinance = catchAsync(async (req, res) => {
  const result = await DashboardService.getFinance(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,

    success: true,

    message: DASHBOARD_MESSAGES.FINANCE_RETRIEVED,

    data: result,
  });
});

export const DashboardController = {
  getFinance,
};