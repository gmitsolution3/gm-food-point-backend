import httpStatus from "http-status";

import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

import { SocketEmitter } from "../../socket/socket.emitter";
import { TABLE_MESSAGES } from "./table.constant";
import { TableService } from "./table.service";

const getTables = catchAsync(async (_req, res) => {
  const result = await TableService.getTables();

  sendResponse(res, {
    statusCode: httpStatus.OK,

    success: true,

    message: TABLE_MESSAGES.RETRIEVED,

    data: result,
  });
});

const releaseTable = catchAsync(async (req, res) => {
  const table = await TableService.releaseTable(
    Number(req.params.tableNumber),
  );

  SocketEmitter.tableUpdated({
    tableNumber: table.tableNumber,

    status: table.status,

    occupiedAt: table.occupiedAt,

    activeOrderId: null,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,

    success: true,

    message: TABLE_MESSAGES.RELEASED,

    data: table,
  });
});

export const TableController = {
  getTables,

  releaseTable,
};
