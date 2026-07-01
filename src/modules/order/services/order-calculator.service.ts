import roundMoney from "../../../utils/roundMoney";
import { TOrderItem } from "../order.model";

type TOrderCalculatorSettings = {
  taxPercentage: number;

  isTaxEnabled: boolean;

  serviceChargePercentage: number;

  isServiceChargeEnabled: boolean;
};

type TCalculateOrderPayload = {
  items: TOrderItem[];

  settings: TOrderCalculatorSettings;
};

type TOrderCalculation = {
  subtotal: number;

  discount: number;

  taxPercentage: number;

  taxAmount: number;

  serviceChargePercentage: number;

  serviceChargeAmount: number;

  grandTotal: number;
};

const calculateOrder = ({
  items,
  settings,
}: TCalculateOrderPayload): TOrderCalculation => {
  /**
   * Subtotal
   */
  const subtotal = roundMoney(
    items.reduce((total, item) => total + item.totalPrice, 0),
  );

  /**
   * Discount
   */
  const discount = roundMoney(
    items.reduce((total, item) => {
      const itemDiscount =
        (item.originalUnitPrice - item.effectiveUnitPrice) *
        item.quantity;

      return total + itemDiscount;
    }, 0),
  );

  /**
   * Tax
   */
  const taxPercentage = settings.isTaxEnabled
    ? settings.taxPercentage
    : 0;

  const taxAmount = roundMoney(subtotal * (taxPercentage / 100));

  /**
   * Service Charge
   */
  const serviceChargePercentage = settings.isServiceChargeEnabled
    ? settings.serviceChargePercentage
    : 0;

  const serviceChargeAmount = roundMoney(
    subtotal * (serviceChargePercentage / 100),
  );

  /**
   * Grand Total
   */
  const grandTotal = roundMoney(
    subtotal + taxAmount + serviceChargeAmount,
  );

  return {
    subtotal,

    discount,

    taxPercentage,

    taxAmount,

    serviceChargePercentage,

    serviceChargeAmount,

    grandTotal,
  };
};

export const OrderCalculatorService = {
  calculateOrder,
};
