import { ClientSession } from "mongoose";
import { BUSINESS } from "../../../constants/business.constant";
import getBusinessDate from "../../../utils/getBusinessDate";

import { CounterService } from "../../counter/counter.service";
import { Settings } from "../../settings/settings.model";

const generateOrderNumber = async (session?: ClientSession) => {
  const settings = await Settings.findOne();

  if (!settings) {
    throw new Error("Restaurant settings not found.");
  }

  const sequence = await CounterService.getNextSequence("ORDER", session);

  const orderNumber = `${settings.orderNumberPrefix}-${String(
    sequence,
  ).padStart(BUSINESS.ORDER_NUMBER_LENGTH, "0")}`;

  return {
    orderNumber,
    businessDate: getBusinessDate(),
  };
};

export const OrderNumberService = {
  generateOrderNumber,
};
