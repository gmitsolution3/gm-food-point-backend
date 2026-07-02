import { ClientSession } from "mongoose";

import { EPaymentStatus } from "./payment.enum";
import { Payment } from "./payment.model";
import { TCreatePaymentPayload } from "./payment.types";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { PAYMENT_SEARCHABLE_FIELDS } from "./payment.constant";

const createPayment = async ({
  session,
  paymentTimeoutMinutes,
  ...payload
}: TCreatePaymentPayload & {
  session?: ClientSession;
}) => {
  const expiresAt = new Date(
    Date.now() + paymentTimeoutMinutes * 60 * 1000,
  );

  const [payment] = await Payment.create(
    [
      {
        ...payload,

        status: EPaymentStatus.PENDING,

        expiresAt,
      },
    ],
    {
      session,
    },
  );

  return payment;
};

const getPayments = async (
  query: Record<string, unknown>,
) => {
  const queryBuilder = new QueryBuilder(
    Payment.find(),
    query,
  );

  queryBuilder.search(
    PAYMENT_SEARCHABLE_FIELDS,
  );

  queryBuilder.filter();

  queryBuilder.sort();

  queryBuilder.paginate();

  const data = await queryBuilder.modelQuery;

  const meta =
    await queryBuilder.countTotal();

  return {
    meta,
    data,
  };
};

export const PaymentService = {
  createPayment,
  getPayments,
};
