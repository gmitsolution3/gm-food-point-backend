import httpStatus from "http-status";

import AppError from "../../errors/AppError";

import { Table } from "./table.model";

import { TABLE_MESSAGES } from "./table.constant";
import { ETableStatus } from "./table.enum";

import { ClientSession } from "mongoose";

const syncTables = async (
  totalTables: number,
  session?: ClientSession,
): Promise<void> => {
  const currentTables = await Table.find()
    .session(session ?? null)
    .sort({
      tableNumber: 1,
    })
    .lean();

  const currentCount = currentTables.length;

  /**
   * Already synced
   */
  if (currentCount === totalTables) {
    return;
  }

  /**
   * Create missing tables
   */
  if (currentCount < totalTables) {
    const newTables = [];

    for (
      let tableNumber = currentCount + 1;
      tableNumber <= totalTables;
      tableNumber++
    ) {
      newTables.push({
        tableNumber,
      });
    }

    await Table.insertMany(newTables, {
      session,
    });

    return;
  }

  /**
   * Validate removable tables
   */
  const tablesToRemove = currentTables.filter(
    (table) => table.tableNumber > totalTables,
  );

  const occupiedTable = tablesToRemove.find(
    (table) => table.status === ETableStatus.OCCUPIED,
  );

  if (occupiedTable) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      TABLE_MESSAGES.CANNOT_REMOVE_OCCUPIED_TABLE,
    );
  }

  /**
   * Remove extra tables
   */
  await Table.deleteMany(
    {
      tableNumber: {
        $gt: totalTables,
      },
    },
    {
      session,
    },
  );
};

const getTables = async () => {
  return Table.find(
    {},
    {
      tableNumber: 1,

      status: 1,

      occupiedAt: 1,
    },
  )
    .sort({
      tableNumber: 1,
    })
    .lean();
};

const occupyTable = async (
  {
    tableNumber,
    orderId,
  }: {
    tableNumber: number;
    orderId: string;
  },
  session?: ClientSession,
) => {
  const table = await Table.findOne({
    tableNumber,
  }).session(session ?? null);

  if (!table) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      TABLE_MESSAGES.NOT_FOUND,
    );
  }

  if (table.status === ETableStatus.OCCUPIED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      TABLE_MESSAGES.ALREADY_OCCUPIED,
    );
  }

  table.status = ETableStatus.OCCUPIED;

  table.activeOrderId = orderId;

  table.occupiedAt = new Date();

  await table.save({
    session,
  });

  return table;
};

const releaseTable = async (
  tableNumber: number,
  session?: ClientSession,
) => {
  const table = await Table.findOne({
    tableNumber,
  }).session(session ?? null);

  if (!table) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      TABLE_MESSAGES.NOT_FOUND,
    );
  }

  if (table.status === ETableStatus.AVAILABLE) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      TABLE_MESSAGES.ALREADY_AVAILABLE,
    );
  }

  table.status = ETableStatus.AVAILABLE;

  table.activeOrderId = null;

  table.occupiedAt = null;

  await table.save({
    session,
  });

  return table;
};

export const TableService = {
  syncTables,

  getTables,

  occupyTable,

  releaseTable,
};
